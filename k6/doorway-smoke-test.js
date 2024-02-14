
import get from './listings/get.js';
export default function () {
    const url = `https://backend.housingbayarea.mtc.ca.gov/listings`
    if (__ENV.DOORWAY_ENVIRONMENT !== undefined) {
        const environment = __ENV.DOORWAY_ENVIRONMENT
        url = `https://backend.${environment}.housingbayarea.mtc.ca.gov/listings`
    }
    get(url);
}