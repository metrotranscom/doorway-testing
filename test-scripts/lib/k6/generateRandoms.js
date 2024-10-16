import { randomString } from "k6/utils";
export const randomAddress = () => {
  return {
    street: `${randomIntBetween(1, 9999)} Main St`,
    city: "Anytown",
    state: "CA",
    zip: `${randomIntBetween(10000, 99999)}`,
  };
};
export const randomEmail = () => {
  return `test${randomString(4)}${randomIntBetween(1, 100000)}@example.com`;
};
export const randomPhone = () => {
  return `510-${randomIntBetween(100, 999)}-${randomIntBetween(1000, 9999)}`;
};
export const randomDate = () => {
  const year = randomIntBetween(1900, 2023).toString();
  const month = randomIntBetween(1, 12).toString();
  const day = randomIntBetween(1, 28).toString();
  return {
    year: year,
    month: month,
    day: day,
  };
};
