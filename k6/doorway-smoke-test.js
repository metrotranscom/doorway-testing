import get from './listings/get.js';
export default function () {
    const url = 'https://backend.staging.housingbayarea.mtc.ca.gov/listings'
    get(url);
}