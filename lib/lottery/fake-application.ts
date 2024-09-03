import { faker } from "@faker-js/faker";
import {
  AccessibilityUpdate,
  AddressCreate,
  AlternateContactUpdate,
  ApplicantUpdate,
  ApplicationCreate,
  ApplicationMultiselectQuestion,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  DemographicUpdate,
  HouseholdMemberUpdate,
  IdDTO,
  IncomePeriodEnum,
  LanguagesEnum,
  ListingMultiselectQuestion,
} from "../Api";
export class FakeApplication implements ApplicationCreate {
  acceptedTerms?: boolean;
  language?: LanguagesEnum;
  incomeVouchers?: string[];
  contactPreferences: string[];
  householdSize: number;
  status: ApplicationStatusEnum;
  submissionType: ApplicationSubmissionTypeEnum;
  submissionDate: string;
  listings: IdDTO;
  applicant: ApplicantUpdate;
  applicationsMailingAddress: AddressCreate;
  applicationsAlternateAddress: AddressCreate;
  alternateContact: AlternateContactUpdate;
  accessibility: AccessibilityUpdate;
  demographics: DemographicUpdate;
  householdMember: HouseholdMemberUpdate[];
  preferredUnitTypes: IdDTO[];
  preferences?: ApplicationMultiselectQuestion[];
  income: string;
  incomePeriod?: IncomePeriodEnum;
  additionalPhone?: boolean;
  additionalPhoneNumber?: string;
  additionalPhoneNumberType?: string;
  householdExpectingChanges?: boolean;
  householdStudent?: boolean;
  sendMailToMailingAddress?: boolean;
  constructor(listingId: string, prefs: ListingMultiselectQuestion[]) {
    const totalPrefs = prefs.length;
    const selectedPrefs = faker.number.int({ min: 0, max: totalPrefs });
    const appPrefs: ApplicationMultiselectQuestion[] = [];
    for (var i = 0; i < totalPrefs; i++) {
      const listingPref = prefs[i];
      if (appPrefs.length < selectedPrefs) {
        appPrefs.push({
          multiselectQuestionId: listingPref.multiselectQuestions.id,
          claimed: true,
          key: listingPref.multiselectQuestions.text,
          options: [{ key: "Yep", checked: true }],
        });
      }
    }
    this.status = ApplicationStatusEnum.Submitted;
    this.submissionType = ApplicationSubmissionTypeEnum.Paper;
    this.additionalPhone = false;
    this.additionalPhoneNumber = faker.string.numeric({ length: 10 });
    this.additionalPhoneNumberType = "home";
    this.contactPreferences = ["email"];
    const birthday = faker.date.birthdate();
    this.applicant = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      birthDay: birthday.getDay().toString(),
      birthMonth: `${birthday.getMonth() + 1}`,
      birthYear: birthday.getFullYear().toString(),
      phoneNumber: faker.string.numeric({ length: 10 }),
      phoneNumberType: "cell",
      emailAddress: "this@that.com",
      applicantAddress: {
        city: faker.person.lastName(),
        street: `${faker.string.numeric({
          length: 4,
        })} ${faker.person.lastName()} St.`,
        zipCode: faker.string.numeric({ length: 5 }),
        state: "CA",
      },
      applicantWorkAddress: {
        city: faker.person.lastName(),
        street: `${faker.string.numeric({
          length: 4,
        })} ${faker.person.lastName()} St.`,
        zipCode: faker.string.numeric({ length: 5 }),
        state: "CA",
      },
    };
    this.alternateContact = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address: {
        city: faker.person.lastName(),
        street: `${faker.string.numeric({
          length: 4,
        })} ${faker.person.lastName()} St.`,
        zipCode: faker.string.numeric({ length: 5 }),
        state: "CA",
      },
    };
    this.listings = { id: listingId };
    this.householdSize = faker.number.int({ max: 8, min: 1 });
    const race = ["black", "white", "asian"];
    const sexualOrientation = [
      "straightHeterosexual",
      "asexual",
      "bisexual",
      "gayLesbianSameGenderLoving",
    ];
    const gender = [
      "male",
      "female",
      "transMan",
      "transWoman",
      "genderqueerGenderNon-Binary",
    ];
    this.householdMember = [];
    for (var i = 0; i < this.householdSize; i++) {
      const hmBirthday = faker.date.birthdate();
      this.householdMember.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        householdMemberAddress: this.applicant.applicantAddress,
        householdMemberWorkAddress: this.applicant.applicantWorkAddress,
        birthDay: hmBirthday.getDay().toString(),
        birthMonth: `${hmBirthday.getMonth() + 1}`,
        birthYear: hmBirthday.getFullYear().toString(),
      });
    }
    this.demographics = {
      race: [race[faker.number.int({ min: 0, max: 2 })]],
      sexualOrientation:
        sexualOrientation[faker.number.int({ min: 0, max: 3 })],
      gender: gender[faker.number.int({ max: 4, min: 0 })],
      howDidYouHear: ["NA"],
    };
    this.accessibility = {
      mobility: faker.datatype.boolean(),
      vision: faker.datatype.boolean(),
      hearing: faker.datatype.boolean(),
    };
    this.preferredUnitTypes = [];
    this.acceptedTerms = true;
    this.language = LanguagesEnum.En;
    const vouchers = ["issuedVouchers", "rentalAssistance", "none"];
    this.incomeVouchers = [];
    this.householdExpectingChanges = false;
    this.householdStudent = false;
    this.preferences = appPrefs;
  }
}
