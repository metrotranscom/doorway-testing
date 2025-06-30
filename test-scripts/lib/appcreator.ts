import * as dotenv from "dotenv";
import { Listing } from "./apioutput";
import { FakeApplication } from "./fake-application";
import { DoorwayFakeApplications } from "./fake-applications";
import { ListingsInterface } from "./listings";
async function sendthem() {
  dotenv.config();
  const applicationCount = Number(process.env.APPLICATION_COUNT)||1000;
  const url =
    process.env.DOORWAY_URL != undefined ? process.env.DOORWAY_URL : "EMPTY";
  const user =
    process.env.DOORWAY_USER != undefined ? process.env.DOORWAY_USER : "EMPTY";
  const password =
    process.env.DOORWAY_PASSWORD != undefined
      ? process.env.DOORWAY_PASSWORD
      : "EMPTY";
  if (url == "EMPTY" || user == "EMPTY" || password == "EMPTY") {
    console.log(
      "Please set DOORWAY_USER, DOORWAY_URL, and DOORWAY_PASSWORD in your .env file",
    );
    throw new Error("Missing Environment Variables");
  }
  console.log(`Sending ${applicationCount} applications to ${url} as ${user}`);
  const doorway = new DoorwayFakeApplications(user, password, url, "passkey");
  const listings = new ListingsInterface(user, password, url, "passkey");
  let listing: Listing;
  if (process.env.LISTING_ID != undefined) {
    listing = await listings.getListing(process.env.LISTING_ID);
  } else {
    listing = (await listings.listingMatcher("Elm Village"))
  }
  for (var i = 0; i < applicationCount; i++) {
    const app: FakeApplication = new FakeApplication(
      listing.id,
      listing.listingMultiselectQuestions!,
    );
    await doorway.submit(app);
  }
}

sendthem().then(() => {
  console.log("DONE!");
});
