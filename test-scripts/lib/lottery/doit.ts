import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { Application, ApplicationSubmissionTypeEnum, Listing } from "../apioutput";
import { DoorwayInterface } from "../doorway-interface";
import { FakeApplication } from "../fake-application";
import { DoorwayFakeApplications } from "../fake-applications";
import { ListingsInterface } from "../listings";
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
    const isItaDup = faker.number.int({ min: 1, max: 100 });
    if (isItaDup > 99) {
      console.log("DUPLICATE");
      app.applicant.firstName = faker.person.firstName();
      app.submissionType = app.submissionType =
        ApplicationSubmissionTypeEnum.Electronical
          ? ApplicationSubmissionTypeEnum.Paper
          : ApplicationSubmissionTypeEnum.Electronical;
      await doorway.submit(app);
    }
    setTimeout(() => { }, 1000);
  }
}
async function deletethem() {
  dotenv.config();
  const applicationCount = 1000;
  const listingId = "faee955f-5bf4-4032-947a-f86b944ae4eb";
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
  const doorway = new DoorwayInterface(user, password, url);
  const apps: Application[] = await doorway.get<Application[]>(
    "/applications",
    { listingId: listingId, limit: 20 },
  );
  for (var i = 0; i < apps.length; i++) {
    console.log(apps[i].id);
    doorway.delete(`/applications`, { id: apps[i].id });
    setTimeout(() => { }, 1000);
  }
}
sendthem().then(() => {
  console.log("DONE!");
});
