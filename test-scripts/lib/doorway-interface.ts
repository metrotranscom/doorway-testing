import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import { DoorwayLogin } from './doorway-login';
import { instance } from './winston.logger';
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
  async post<T = any>(endpoint: string, body: object): Promise<AxiosResponse<T, any>> {
    this.logger.info('Logging into Doorway');
    let data: T;
    const tokens = await this.doorwayLogin.login();
    axios.defaults.withCredentials = true;
    const postURL = `${this.url}${endpoint}`;

    this.logger.debug(`POST ${postURL}`);
    const response = await axios.post(postURL, body, {
      headers: {
        Cookie: `${tokens['accessToken']};${tokens['refreshToken']}`,
      },
    });

    this.logger.info(`HTTP Response Code ${response.status}`);

    return response;
  }

  async getList<T = any[]>(
    endpoint: string,
    query: object = {},
    method: string = 'GET'
  ): Promise<T[]> {
    this.logger.info('Logging into Doorway');
    let data: T[] = [];
    try {
      const tokens = await this.doorwayLogin.login();
      axios.defaults.withCredentials = true;
      const getURL = `${this.url}${endpoint}`;
      try {
        let page = 1;
        let limit = 200;
        let totalPages = 1;
        while (page <= totalPages) {
          this.logger.debug(`${method} ${getURL}`);
          let params = {
            page: page,
            limit: limit,
          };
          Object.keys(query).forEach((key) => (params[key] = query[key]));
          //This looks a little weird. The reason is that Doorway recently had its method to get listings changed to a POST
          // so i had to accomodate the possibility of both GET and POST requests with the data passed in different ways.
          const response = await axios.request({
            method: method,
            url: getURL,
            headers: {
              Cookie: `${tokens['accessToken']};${tokens['refreshToken']}`,
            },
            params: method == 'GET' ? params : undefined,
            data: method == 'POST' ? params : undefined,
          });
          this.logger.info(`HTTP Response Code ${response.status}`);
          totalPages = response.data.meta.totalPages;
          page += 1;
          if (response.data.items != undefined) {
            response.data.items.forEach((item) => {
              data.push(item);
            });
          } else {
            data = response.data;
          }
        }
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(`Get from ${getURL} failed with an error code of ${getError.code}`);
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error('Problems logging into Doorway!');
      this.logger.error(error);
      throw error;
    }
    return data!;
  }
  async get<T = any>(endpoint: string, query: object = {}): Promise<T> {
    this.logger.info('Logging into Doorway');
    let data: T;
    try {
      const tokens = await this.doorwayLogin.login();
      axios.defaults.withCredentials = true;
      const getURL = `${this.url}${endpoint}`;
      try {
        this.logger.debug(`GET ${getURL}`);
        const response = await axios.get<T>(getURL, {
          headers: {
            Cookie: `${tokens['accessToken']};${tokens['refreshToken']}`,
          },
        });
        this.logger.info(`HTTP Response Code ${response.status}`);
        data = response.data;
        this.logger.info(data);
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(`Get from ${getURL} failed with an error code of ${getError.code}`);
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error('Problems logging into Doorway!');
      this.logger.error(error);
      throw error;
    }
    return data!;
  }
  async binaryGet(endpoint: string, query?: object, filename = '/tmp/lottery.zip'): Promise<void> {
    this.logger.info('Logging into Doorway');
    try {
      const tokens = await this.doorwayLogin.login();
      const getURL = `${this.url}${endpoint}`;
      axios.defaults.withCredentials = true;
      try {
        this.logger.debug(`GET ${getURL}`);
        const response = await axios.get(getURL, {
          responseType: 'arraybuffer',
          headers: {
            Cookie: `${tokens['accessToken']};${tokens['refreshToken']}`,
          },
          params: query != undefined ? query : '',
          timeout: 600000,
        });
        this.logger.debug(`HTTP Response Code: ${response.status}`);
        const fileData = Buffer.from(response.data, 'binary');
        fs.writeFileSync(filename, fileData);
        //await writer.close();
      } catch (getError) {
        if (axios.isAxiosError(getError)) {
          this.logger.error(`Get from ${getURL} failed with an error code of ${getError.code}`);
          this.logger.error(getError.message);
          throw getError;
        }
      }
    } catch (error) {
      this.logger.error('Problems logging into Doorway!');
      this.logger.error(error);
      throw error;
    }
  }
}
