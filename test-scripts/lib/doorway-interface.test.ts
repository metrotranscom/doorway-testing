import { AxiosResponse } from 'axios';
import { Application, Listing } from '../api/Api';
import { DoorwayInterface } from './doorway-interface';
import application from './mockApplicationsMessage.json';
import { startDoorway } from './mockDoorway';
beforeAll(() => {
  startDoorway();
});
describe('Test of Get function', () => {
  test('Successful Get', async () => {
    const doorway = new DoorwayInterface(
      'good.user@gooduser.com',
      'goodpassword',
      'https://doorway'
    );
    const listing: Listing = await doorway.get<Listing>(
      '/listings/74d3c630-8a46-4b81-940a-d99e2f26ccce'
    );
    expect(listing.name).toBe('Brickline Flats');
  });
  test('Successful Get of a List', async () => {
    const doorway = new DoorwayInterface(
      'good.user@gooduser.com',
      'goodpassword',
      'https://doorway'
    );
    const listings: Listing[] = await doorway.getList<Listing>('/listings/list');
    expect(listings.length).toBe(6);
  });
});
describe('Test of Post function', () => {
  test('Successful Post', async () => {
    const doorway = new DoorwayInterface(
      'good.user@gooduser.com',
      'goodpassword',
      'https://doorway'
    );
    const appResponse: AxiosResponse<Application, any> = await doorway.post<Application>(
      '/applications',
      application
    );
  });
});
