import { Listing } from "./apioutput";
import { FakeApplication } from "./fake-application";
import { ListingsInterface } from "./listings";
async function generateApplication(req, context, events, next) {
  const user = context.vars["email"];
  const password = context.vars["password"];
  const url = context.vars["url"];
  const listingId = context.vars["listingId"];
  const listings = new ListingsInterface(user, password, url, "passkey");
  const listing: Listing = await listings.getListing(listingId);
  const fakeApp = new FakeApplication(
    listingId,
    listing.listingMultiselectQuestions!,
  );
  req.json = fakeApp;
}
module.exports = {
  generateApplication,
};
