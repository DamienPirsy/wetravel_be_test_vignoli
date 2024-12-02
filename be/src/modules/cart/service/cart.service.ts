import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cart } from '../dto/cart.dto';
import { CartUpdateDto } from '../dto/cart.update.dto';
import { CartNotFoundException } from '../exception/cart.not.found.exception';
import { CartExpiredException } from '../exception/cart.expired.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { CartCreatedDto } from '../dto/cart.created.dto';
import { CartCancelledEvent } from '../event/cart.cancelled.event';
import { CartCreatedEvent } from '../event/cart.created.event';
import { CartUpdatedEvent } from '../event/cart.updated.event';

@Injectable()
export class CartService {
  private expiration: Date;
  private CART_CREATED: string;
  private CART_UPDATED: string;
  private CART_CANCELLED: string;

  constructor(
    private readonly prisma: PrismaService,
    private eventBus: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    // TODO mettere expiration in env
    this.expiration = new Date(Date.now() + 15 * 60 * 1000);
    this.CART_CREATED = this.configService.get<string>('CART_CREATED');
    this.CART_UPDATED = this.configService.get<string>('CART_UPDATED');
    this.CART_CANCELLED = this.configService.get<string>('CART_CANCELLED');
  }

  async createOrUpdateCart({
    userId,
    amount,
    seats,
    packId,
  }: CartUpdateDto): Promise<Cart> {
    const currentTimestamp = new Date();

    // cerco il carrello: ogni utente ha UN solo carrello
    const cart = await this.userCart(userId);

    if (cart) {
      // Se seats è 0 = richiesta di cancellazione cart
      if (seats == 0) {
        await this.clearCart(cart.userId);
        this.eventBus.emit(this.CART_CANCELLED, new CartCancelledEvent(cart));
        return null;
      }

      if (cart.expiresAt >= currentTimestamp) {
        // Aggiorna il carrello se non è scaduto (posso cambiare pacchetto o numero di posti)
        // se cambia il numero di posti aggiorno anche i dati del pacchetto
        this.eventBus.emit(
          this.CART_UPDATED,
          new CartUpdatedEvent(cart, { amount, seats, packId }),
        );
        return await this.prisma.cart.update({
          where: { id: cart.id },
          data: {
            amount,
            seats,
            packId,
          },
        });
      } else {
        // Se il carrello è scaduto devo "ripristinare" i posti liberi, cancello il carrello e restituisco errore
        await this.clearCart(cart.id);
        this.eventBus.emit(this.CART_CANCELLED, new CartCancelledEvent(cart));
        throw new CartExpiredException();
      }
    } else {
      const cartData: CartCreatedDto = CartCreatedDto.fromRequest({
        userId,
        packId,
        amount,
        seats,
        expiresAt: this.expiration,
      });
      const cart = await this.prisma.cart.create({
        data: cartData,
      });
      this.eventBus.emit(this.CART_CREATED, new CartCreatedEvent(cart));
      return cart;
    }
  }

  // Recupera carrello in base allo userid
  async userCart(userId: string): Promise<Cart> {
    return await this._getCartBy({ userId });
  }

  // Carrello in base al suo id
  async getCartById(id: string): Promise<Cart> {
    const cart = await this._getCartBy({ id });
    if (!cart) {
      throw new CartNotFoundException();
    }
    return cart;
  }

  // Metodo generico sottostante
  async _getCartBy(where: any): Promise<Cart> {
    return await this.prisma.cart.findUnique({
      where: where,
    });
  }

  // elimina carrello
  async clearCart(id: string): Promise<void> {
    await this.prisma.cart.delete({
      where: { id },
    });
  }
}
