import axios, { AxiosResponse } from "axios";
import * as fs from "fs";
import { Validator } from "jsonschema";
import { DoorwayLogin } from "./doorway-login";
import { FakeApplication } from "./fake-application";
import { ListingsInterface } from "./listings";
import { UnitTypeService } from "./unit-types";
import { instance } from "./winston.logger";
export class DoorwayFakeApplications {
  doorwayLogin: DoorwayLogin;
  url: string;
  passkey: string;
  maxListings: number;
  logger: typeof instance;
  user: string;
  password: string;
  unitTypeService: UnitTypeService;
  listingsService: ListingsInterface;
  constructor(user: string, password: string, url: string, passkey: string) {
    this.url = `${url}/applications`;
    this.passkey = passkey;
    this.user = user;
    this.password = password;
    this.logger = instance;
    this.doorwayLogin = new DoorwayLogin(user, password, url);
    this.unitTypeService = new UnitTypeService(url, user, password);
    this.listingsService = new ListingsInterface(user, password, url, passkey);
  }
  async submit(application: FakeApplication): Promise<AxiosResponse<any, any>> {
    this.logger.info("Submittng paper Application to the Doorway API");
    axios.defaults.withCredentials = true;
    const tokens = await this.doorwayLogin.login();
    this.logger.info(
      `Submitting application for listing ${application.listings.id}`,
    );
    this.logger.info(application);
    const response = axios.post(this.url, application, {
      headers: {
        Cookie: `${tokens["accessToken"]};${tokens["refreshToken"]}`,
        //passkey: this.passkey,
      },
    });
    return response;
  }
  isValid(application: object): boolean {
    const appSchema = JSON.parse(
      fs.readFileSync("./lib/handler-functions/applicationSchema.json", "utf8"),
    );
    const validator = new Validator();
    const result = validator.validate(application, appSchema);
    if (!result.valid) {
      this.logger.error("Error validating input. See messages below");
      this.logger.error(result.errors);
      throw result.errors;
    }
    return result.valid;
  }
}
