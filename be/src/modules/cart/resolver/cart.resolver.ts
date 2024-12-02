import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Cart } from '../dto/cart.dto';
import { CartRequestDto } from '../dto/cart.request.dto';
import { CartService } from '../service/cart.service';
import { PacksService } from '../../packs/service/packs.service';
import { UsersService } from '../../users/service/users.service';
import { PackNotFoundException } from '../../packs/exception/pack.not.found.exception';
import { PackNotAvailableException } from '../../packs/exception/pack.not.available.exception';
import { BadRequestException } from '@nestjs/common';

@Resolver('Cart')
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly packsService: PacksService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => Cart, { name: 'getUserCart' })
  async getUserCart(@Args('userId') userId: string): Promise<Cart> {
    return await this.cartService.userCart(userId);
  }

  @Mutation(() => Cart)
  async addToCart(
    @Args('cartRequest') { email, packId, seats }: CartRequestDto,
  ) {
      // Getting the package details
      const pack = await this.packsService.packageById(packId);
      if (!pack) {
        throw new PackNotFoundException();
      }

      if (pack.freeSeats < seats) {
        throw new PackNotAvailableException();
      }
    try {
      // create user if it doesn't exist
      const user = await this.usersService.findOrCreate({
        email,
      });

      return await this.cartService.createOrUpdateCart({
        userId: user.id,
        amount: pack.price * seats,
        seats: seats,
        packId: pack.id,
      });
    } catch (e) {
       throw new BadRequestException('Cound not add to cart')
    }
  }

  @Mutation(() => Boolean)
  async deleteCart(@Args('cartId') id: string) {
    await this.cartService.clearCart(id);
    return true;
  }
}
