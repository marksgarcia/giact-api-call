const express = require("express");
const app = express();
const axios = require("axios");
const { Base64Encoder } = require("base64-encoding");

require("dotenv").config();
app.use(express.json());

app.post("/", async (req, res, next) => {
  // Pull in environmental variables for authentication and security purposes
  const username = process.env.GIACT_UN;
  const password = process.env.GIACT_PW;

  const authEncoded = new Base64Encoder().encode(
    new TextEncoder().encode(`${username}:${password}`)
  );

  // Destructure our req.body into individual items
  const {
    firstName,
    middleName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    email,
    phone,
    ipAddress,
  } = req.body;

  // Set dictionaries to set the XML values we need for the specific API call
  const personEntity = {
    PersonEntity: {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: email,
      AddressEntity: {
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        State: state,
        ZipCode: zipCode,
      },
    },
  };

  const additionalFields = {
    MiddleName: middleName,
    PhoneNumber: phone,
    CurrentIpAddress: ipAddress,
  };

  const addBodyEntries = () => {
    for (let [key, value] of Object.entries(additionalFields)) {
      value !== undefined && (personEntity.PersonEntity[key] = value);
    }
  };

  buildBody = () => {
    addBodyEntries();
    body = {
      ServiceFlags: ["identifyperson", "esi"],
      PersonEntity: personEntity.PersonEntity,
    };
    return body;
  };

  // Parse the xml that comes back in the axios response and return useable JSON
  const parseResponse = async (response) => {
    var obj = await parse(response);
    return obj.root.children[0].children[0].children[0].children;
  };

  // set the axios config fil so that we can POST to formatted SOAP request to the given API
  const generateAxiosConfig = () => {
    const body = buildBody();
    const axiosConfig = {
      method: "POST",
      url: process.env.API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authEncoded}`,
      },
      data: JSON.stringify(body), // Be sure to specifc
    };
    return axiosConfig;
  };

  // Handle the server callback and return the parsed and formatted data
  const giactCallBack = await axios(generateAxiosConfig())
    .then((result) => result.data)
    .catch((error) => error);
  // Build responses object with the ESI and Identify Calls so that we parse any relevant data out of each of them
  res.send(giactCallBack);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});