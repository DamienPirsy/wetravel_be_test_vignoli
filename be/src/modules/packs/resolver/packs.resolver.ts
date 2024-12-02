import { Resolver, Query, Args } from '@nestjs/graphql';
import { PacksService } from '../service/packs.service';
import { Pack } from '../dto/pack.dto';

@Resolver(() => Pack)
export class PacksResolver {
  constructor(private packsService: PacksService) {}

  // Recupera tutti i pacchetti di viaggio
  @Query(() => [Pack], { name: 'getAllPackages' })
  async getAllPackages(): Promise<Pack[]> {
    return await this.packsService.getPackages();
  }

  // dettaglio pacchetto
  @Query(() => Pack, { name: 'getPackageById', nullable: true })
  async getPackageById(@Args('id') id: string): Promise<Pack | null> {
    return await this.packsService.packageById(id);
  }
}
