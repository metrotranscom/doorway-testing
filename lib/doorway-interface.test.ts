import { Listing } from "./apioutput";
import { DoorwayInterface } from "./doorway-interface";
import { startDoorway } from "./mockDoorway";
beforeAll(() => {
  startDoorway();
});
describe("Test of Get function", () => {
  test("Successful Get", async () => {
    const doorway = new DoorwayInterface(
      "good.user@gooduser.com",
      "goodpassword",
      "https://doorway",
    );
    const listings: Listing[] = await doorway.get("/listings");
    expect(listings.length).toBe(6);
  });
});
