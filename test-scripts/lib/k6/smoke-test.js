import {
  randomIntBetween,
  randomItem,
  randomString,
} from "https://jslib.k6.io/k6-utils/1.6.0/index.js";
import { check, group } from "k6";
import http from "k6/http";
import {
  randomAddress,
  randomDate,
  randomEmail,
  randomPhone,
} from "./generateRandoms.js";
export default function () {
  group("Get Listing and Apply", () => {
    const url = __ENV.DOORWAY_URL || "EMPTY";
    const user = __ENV.DOORWAY_USER || "EMPTY";
    const password = __ENV.DOORWAY_PASSWORD || "EMPTY";
    if (url === "EMPTY" || user === "EMPTY" || password === "EMPTY") {
      console.log(
        "Please set DOORWAY_USER, DOORWAY_URL, and DOORWAY_PASSWORD in your .env file",
      );
      throw new Error("Missing Environment Variables");
    }
    const loginResp = http.post(`${url}/auth/login`, {
      email: user,
      password: password,
    });
    const cookies = loginResp.cookies;
    const listingId = "e1efdce2-8109-4d9f-8369-d30df976be24";
    const listingQuery = http.get(`${url}/listings/${listingId}`, {
      headers: {
        Cookie: `${cookies["accessToken"]};${cookies["refreshToken"]}`,
      },
    });
    check(listingQuery, {
      "listing Query status code is 200": (r) => r.status === 200,
    });
    const listing = JSON.parse(listingQuery.body);
    const preferenceJSON = randomItem(listing.listingMultiselectQuestions);
    const preferenceInfo = JSON.parse(JSON.stringify(preferenceJSON));
    const preferenceName = preferenceInfo.multiselectQuestions.text;
    const preferenceId = preferenceInfo.multiselectQuestions.id;
    const optionName = preferenceInfo.multiselectQuestions.options[0].text;
    const householdSize = randomIntBetween(1, 5);
    const householdMembers = [];
    for (let i = 0; i < householdSize; i++) {
      const birthDay = randomDate();
      const noEmail = randomItem([true, false]);
      const noPhone = randomItem([true, false]);
      householdMembers.push({
        firstName: randomString(8),
        middleName: randomString(8),
        lastName: randomString(8),
        birthMonth: birthDay.month,
        birthDay: birthDay.day,
        birthYear: birthDay.year,
        emailAddress: noEmail ? "" : randomEmail(),
        noEmail: noEmail,
        phoneNumber: noPhone ? "" : randomPhone(),
        phoneNumberType: "home",
        noPhone: noPhone,
        householdMemberAddress: {
          placeName: "",
          city: "",
          county: "",
          state: "",
          street: "",
          street2: "",
          zipCode: "",
          latitude: 0,
          longitude: 0,
        },
        sameAddress: "yes",
        mailingAddress: {
          placeName: "",
          city: "",
          county: "",
          state: "",
          street: "",
          street2: "",
          zipCode: "",
          latitude: 0,
          longitude: 0,
        },
        sameMailingAddress: true,
        relationship: "other",
      });
    }
    const applicantBirthday = randomDate();
    const applicantAddress = randomAddress();
    const applicantWorkAddress = randomAddress();
    const additionalPhone = randomItem([true, false]);
    const altContactAddress = randomAddress();
    const vouchers = randomItem(["issuedVouchers", "rentalAssistance", "none"]);
    const app = {
      additionalPhone: additionalPhone,
      additionalPhoneNumber: additionalPhone ? randomPhone() : "",
      additionalPhoneNumberType: "home",
      contactPreferences: ["email"],
      householdSize: householdSize,
      sendMailToMailingAddress: false,
      householdExpectingChanges: false,
      householdStudent: false,
      incomeVouchers: [vouchers],
      income: randomIntBetween(0, 10000).toString(),
      incomePeriod: "perMonth",
      status: "submitted",
      language: "en",
      acceptedTerms: true,
      submissionType: randomItem(["paper", "electronical"]),
      submissionDate: new Date().toUTCString(),
      receivedBy: "k6",
      receivedAt: new Date().toUTCString(),
      listings: {
        id: listingId,
      },
      applicant: {
        firstName: randomString(8),
        middleName: randomString(8),
        lastName: randomString(8),
        birthMonth: applicantBirthday.month,
        birthDay: applicantBirthday.day,
        birthYear: applicantBirthday.year,
        emailAddress: randomEmail(),
        noEmail: false,
        phoneNumber: randomPhone(),
        phoneNumberType: "cell",
        noPhone: false,
        workInRegion: "yes",
        applicantAddress: {
          city: applicantAddress.city,
          state: applicantAddress.state,
          street: applicantAddress.street,
          street2: "",
          zipCode: applicantAddress.zip,
        },
        applicantWorkAddress: {
          city: applicantWorkAddress.city,
          state: applicantWorkAddress.state,
          street: applicantWorkAddress.street,
          street2: "",
          zipCode: applicantWorkAddress.zip,
        },
      },
      applicationsMailingAddress: {
        city: applicantAddress.city,
        state: applicantAddress.state,
        street: applicantAddress.street,
        street2: "",
        zipCode: applicantAddress.zip,
      },
      applicationsAlternateAddress: {
        city: applicantWorkAddress.city,
        state: applicantWorkAddress.state,
        street: applicantWorkAddress.street,
        street2: "",
        zipCode: applicantWorkAddress.zip,
      },
      alternateContact: {
        type: "familyMember",
        firstName: randomString(8),
        lastName: randomString(8),
        phoneNumber: randomPhone(),
        emailAddress: randomEmail(),
        address: {
          city: altContactAddress.city,
          state: altContactAddress.state,
          street: altContactAddress.street,
          street2: "",
          zipCode: altContactAddress.zip,
        },
      },
      accessibility: {
        mobility: randomItem([true, false]),
        vision: randomItem([true, false]),
        hearing: randomItem([true, false]),
      },
      // demographics: {
      //   ethnicity: "string",
      //   gender: "string",
      //   sexualOrientation: "string",
      //   howDidYouHear: ["string"],
      //   race: ["string"],
      //   spokenLanguage: "string",
      // },
      householdMember: householdMembers,
      preferredUnitTypes: [
        // {
        //   id: "string",
        //   name: "string",
        //   ordinal: 0,
        // },
      ],
      preferences: [
        {
          multiselectQuestionId: preferenceId,
          key: preferenceName,
          checked: true,
          options: [
            {
              key: optionName,
              checked: true,
            },
          ],
        },
      ],
    };
    console.log(JSON.parse(JSON.stringify(app)));
    const sendApp = http.post(`${url}/applications`, JSON.stringify(app), {
      // headers: {
      //   "Content-Type": "application/json",
      //   Cookie: `${cookies["accessToken"]};${cookies["refreshToken"]}`,
      // },
    });
    console.log(sendApp.status);
    console.log(sendApp.body);
    check(sendApp, {
      "Send App status code is 200": (r) => r.status === 201,
    });
    //   const app = new ApplicationCreate();
    //   app.listingId = listingId;
    if (
      sendApp.status === 200 &&
      sendApp.body != null &&
      typeof sendApp.body == "string"
    ) {
      console.log(sendApp.body);
      //const listing: Listing = JSON.parse(res.body);
      //console.log(listing);
    }
  });
  // // sleep(1);
}
