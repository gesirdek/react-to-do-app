import axios from "axios";

export default axios.create({
  baseURL: "https://getir-be.usefulapps.me/v1",
  headers: {
    "Content-Type": "application/json",
  }
});