import http from "k6/http";
import { check } from "k6";

export default function (url) {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = http.get(url);
  console.log(res.json().items.length);
  check(res, {
    "response code was 200": (res) => res.status == 200,
    "body has listings": (res) => res.json().items.length > 0,
  });
}
