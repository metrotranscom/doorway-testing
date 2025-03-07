import { FakeApplication } from "./fake-application";
import { ListingsInterface } from "./listings";
import { instance as logger } from "./winston.logger";
async function generateApplication(req, context, events, next) {
  const user = context.vars["email"];
  const password = context.vars["password"];
  const url = context.vars["url"];
  logger.info(`Generating application for ${user} on ${url} with password ${password}`);
  const listingId = context.vars["listingId"];
  const listings = new ListingsInterface(user, password, url, "passkey");
  const fakeApp = new FakeApplication(
    listingId,[]
  );
  req.json = fakeApp;
}
module.exports = {
  generateApplication,
};
