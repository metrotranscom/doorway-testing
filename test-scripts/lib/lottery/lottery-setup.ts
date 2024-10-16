import { DoorwayInterface } from "../doorway-interface";
export default function () {
  const listing = "a51f7f73-98ce-423c-84b7-78465c420777";
  const url = "https://backend.staging.housingbayarea.mtc.ca.gov";
  const doorway = new DoorwayInterface(
    "doorwaysvc@housingbayarea.org",
    "WFtAME&uWxZqkZJ26Plwt#!A@cXlAD@k6N",
    url,
  );
  doorway.get("/listings");
}
