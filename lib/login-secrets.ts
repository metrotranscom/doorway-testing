import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { instance as logger } from "./winston.logger";
export const getLoginSecrets = async (
  environment: string,
): Promise<LoginSecrets> => {
  const secretName = `doorway-lambdas/${environment}/serviceaccount`;
  logger.debug(`Getting Secret: ${secretName}`);
  const input = {
    SecretId: secretName,
  };
  const secretValueCommand = new GetSecretValueCommand(input);
  const secretsManagerClient = new SecretsManagerClient();
  let dwUser: string;
  let dwPassword: string;

  logger.debug(secretValueCommand);
  const response = await secretsManagerClient.send(secretValueCommand);
  const secretString = JSON.parse(response.SecretString!);
  const loginSecrets = {
    url: secretString.url,
    dwUser: secretString.user,
    dwPassword: secretString.password,
  };
  return loginSecrets;
};
export interface LoginSecrets {
  url: string;
  dwUser: string;
  dwPassword: string;
}
