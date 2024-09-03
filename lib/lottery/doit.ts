import { ListingsInterface } from "../listings";
import { FakeApplication } from "./fake-application";
import { DoorwayFakeApplications } from "./fake-applications";
async function sendthem() {
  const listingId = "a51f7f73-98ce-423c-84b7-78465c420777";
  const url = "https://backend.staging.housingbayarea.mtc.ca.gov";
  const user = "dwlambdasvc@housingbayarea.org";
  const password = "WFtAME&uWxZqkZJ26Plwt#!A@cXlAD@k6N";
  const doorway = new DoorwayFakeApplications(user, password, url, "passkey");
  const listings = new ListingsInterface(user, password, url, "passkey");
  const listing = await listings.getListing(listingId);
  for (var i = 0; i < 1000; i++) {
    await doorway.submit(
      new FakeApplication(listing.id, listing.listingMultiselectQuestions!)
    );
    setTimeout(() => {
      console.log("hello world");
    }, 1000);
  }
}
sendthem().then(() => {
  console.log("DONE!");
});
