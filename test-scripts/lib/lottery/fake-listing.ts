import { faker } from "@faker-js/faker/locale/af_ZA";
import {
  IdDTO,
  Jurisdiction,
  ListingCreate,
  ListingEventCreate,
  ListingsStatusEnum,
  UnitsSummaryCreate,
} from "../apioutput";
export class FakeListing implements ListingCreate {
  name: string;
  description: string;
  displayWaitlistSize: boolean;
  status: ListingsStatusEnum;
  jurisdictions: Jurisdiction;
  unitsSummary: UnitsSummaryCreate[];
  listingEvents: ListingEventCreate[] = [];
  listingMultiselectQuestions?: IdDTO[] = [];
  lotteryOptIn: boolean = true;
  constructor(jurisdiction: Jurisdiction, preferenceIds: IdDTO[]) {
    this.name = `${faker.person.fullName} Arms`;
    this.description = "This is a fake listing";
    this.status = ListingsStatusEnum.Active;
    this.jurisdictions = jurisdiction;
    this.listingMultiselectQuestions = preferenceIds;
  }
}
