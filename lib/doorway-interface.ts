import axios from "axios";
import * as fs from "fs";
import { DoorwayLogin } from "./doorway-login";
import { instance } from "./winston.logger";
export class DoorwayInterface {
  url: string;
  user: string;
  password: string;
  logger: typeof instance;
  doorwayLogin: DoorwayLogin;
  constructor(user: string, password: string, url: string) {
    this.url = url;
    this.user = user;
    this.password = password;
    this.logger = instance;
    this.doorwayLogin = new DoorwayLogin(user, password, url);
  }
  async get<T = any>(endpoint: string, query?: object): Promise<T> {
    this.logger.info("Logging into Doorway");
    let data: T;
    try {
      const tokens = await this.doorwayLogin.login();
      const getURL = `${this.url}${endpoint}`;
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get(getURL, {
          headers: {
            Cookie: `${tokens["accessToken"]};${tokens["refreshToken"]}`,
          },
          params: query != undefined ? query : "",
        });
        if (response.data.items != undefined) {
          data = response.data.items;
        } else {
          data = response.data;
        }
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(
            `Get from ${getURL} failed with an error code of ${getError.code}`,
          );
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error("Problems logging into Doorway!");
      this.logger.error(error);
      throw error;
    }
    return data!;
  }
  async binaryGet(
    endpoint: string,
    query?: object,
    filename = "/tmp/lottery.zip",
  ): Promise<void> {
    this.logger.info("Logging into Doorway");
    try {
      const tokens = await this.doorwayLogin.login();
      const getURL = `${this.url}${endpoint}`;
      axios.defaults.withCredentials = true;
      try {
        const writer = fs.createWriteStream(filename);
        const response = await axios
          .get(getURL, {
            responseType: "stream",
            headers: {
              Cookie: `${tokens["accessToken"]};${tokens["refreshToken"]}`,
            },
            params: query != undefined ? query : "",
          })
          .then((response) => {
            response.data.pipe(writer);
          });
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(
            `Get from ${getURL} failed with an error code of ${getError.code}`,
          );
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error("Problems logging into Doorway!");
      this.logger.error(error);
      throw error;
    }
  }
  async post<T = any>(endpoint: string, body: T): Promise<T> {
    this.logger.info("Logging into Doorway");
    let data: T;
    try {
      const tokens = await this.doorwayLogin.login();
      const getURL = `${this.url}${endpoint}`;
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.post(getURL, {
          headers: {
            Cookie: `${tokens["accessToken"]};${tokens["refreshToken"]}`,
          },
          body: body,
        });
        if (response.data.items != undefined) {
          data = response.data.items;
        } else {
          data = response.data;
        }
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(
            `Get from ${getURL} failed with an error code of ${getError.code}`,
          );
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error("Problems logging into Doorway!");
      this.logger.error(error);
      throw error;
    }
    return data!;
  }
}
