import Fuse from 'fuse.js';
import { Listing, ListingFilterParams, ListingsStatusEnum } from './apioutput';
import { MatchingError } from './custom-errors';
import { DoorwayInterface } from './doorway-interface';
import { instance } from './winston.logger';
export class ListingsInterface {
  constructor(
    user: string,
    password: string,
    url: string,
    passkey: string,
    maxListings: number = 10000
  ) {
    this.url = url;
    this.logger = instance;
    this.maxListings = maxListings;
    this.passkey = passkey;
    this.doorwayInterface = new DoorwayInterface(user, password, url);
  }
  doorwayInterface: DoorwayInterface;
  url: string;
  passkey: string;
  maxListings: number;
  logger: typeof instance;
  getUrl(): string {
    return this.url;
  }
  async getAllListings(): Promise<Listing[]> {
    this.logger.debug('Calling listings API');
    //doorways function to get listings is now a POST function
    const listings: Listing[] = await this.doorwayInterface.getList<Listing>(
      '/listings/list',
      {},
      'POST'
    );
    this.logger.debug('Here are the listings: ');
    await this.logger.debug(listings);
    return listings;
  }
  async listingMatcher(match: string, threshold: number = 0.7): Promise<Listing> {
    this.logger.debug('Getting all the listings.');
    const listings = await this.getAllListings();
    await this.logger.debug(`${listings.length} total listings found`);
    const fuse = new Fuse(listings, {
      keys: ['name', 'listingsBuildingAddress.street'],
      isCaseSensitive: false,
      includeScore: true,
      threshold: threshold,
    });
    let result = await fuse.search(match);
    this.logger.info(`${result.length} matches found`);
    this.logger.debug(result[0].score);
    if (result.length == 0) {
      throw new MatchingError({
        name: 'NO_MATCH_FOR_LISTING',
        message: `Cant Find Listing ${match}`,
        cause: match,
      });
    }
    return result[0].item;
  }
  async getListing(id: string): Promise<Listing> {
    this.logger.info(`Getting Listing ${id}`);
    const listing = await this.doorwayInterface.get<Listing>(`/listings/${id}`);
    return listing;
  }
  async getClosedListings() {
    this.logger.debug('Calling listings API');
    const closedFilter: ListingFilterParams = {
      $comparison: '=',
      status: ListingsStatusEnum.Closed,
    };
    const listings: Listing[] = await this.doorwayInterface.getList<Listing>(
      '/listings/list',
      { filter: closedFilter },
      'POST'
    );
    this.logger.debug('Here are the listings: ');
    await this.logger.debug(listings);
    return listings;
  }
}
