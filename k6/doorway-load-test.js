import get from './listings/get.js';
export const options = {
    // define thresholds
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ["p(99)<2000"], // 99% of requests should be below 1s
    },
    scenarios: {
        // define scenarios
        breaking: {
          executor: "ramping-vus",
          stages: [
            { duration: "10s", target: 20 },
            { duration: "50s", target: 20 },
            { duration: "50s", target: 40 },
            { duration: "50s", target: 60 },
            { duration: "50s", target: 80 },
            { duration: "50s", target: 100 },
            { duration: "50s", target: 120 },
            { duration: "50s", target: 140 },
            //....
          ],
        },
      },
};
export default function () {
    const url = 'https://backend.staging.housingbayarea.mtc.ca.gov/listings'
    get(url);
}