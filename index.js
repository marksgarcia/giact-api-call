const express = require("express");
const app = express();
const axios = require("axios");
const parse = require("xml-parser");
require("dotenv").config();

app.use(express.json());

app.post("/", async (req, res, next) => {
  // Pull in environmental variables for authentication and security purposes
  const username = process.env.GIACT_UN;
  const password = process.env.GIACT_PW;
  const environment = process.env.GIACT_ENV;

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
    mode,
  } = req.body;

  // Set dictionaries to set the XML values we need for the specific API call
  const globalDictionary = {
    FirstName: firstName,
    MiddleName: middleName,
    LastName: lastName,
    PhoneNumber: phone,
    AddressLine1: addressLine1,
    AddressLine2: addressLine2,
    City: city,
    State: state,
    ZipCode: zipCode,
    EmailAddress: email,
    CurrentIpAddress: ipAddress,
  };

  // Build the XML based off the dictionary
  const buildXML = (dictionary) => {
    let xml = "";
    Object.entries(dictionary).map(([key, value]) => {
      if (value !== undefined) {
        xml += `<${key}>${value}</${key}>`;
      }
    });

    return xml;
  };

  // Parse the xml that comes back in the axios response and return useable JSON
  const parseResponse = async (response) => {
    var obj = await parse(response);
    return obj.root.children[0].children[0].children[0].children;
  };

  // Format XML line items if the req.body returned a value that was not undefined
  const apiURL =
    environment === "PRODUCTION"
      ? "https://api.giact.com/VerificationServices/V5/InquiriesWS-5-8.asmx?"
      : "https://sandbox.api.giact.com/VerificationServices/V5/InquiriesWS-5-8.asmx?";

  // Build our SOAP style request for axios in the appropriate format
  const generateSoapRequest = () => {
    let userData = buildXML(globalDictionary);

    const soapRequest =
      `<?xml version="1.0" encoding="utf-8" ?>\n` +
      `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n` +
      `xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n<soap:Header>\n` +
      `<AuthenticationHeader xmlns="http://api.giact.com/verificationservices/v5">\n` +
      `<ApiUsername>${username}</ApiUsername>\n` +
      `<ApiPassword>${password}</ApiPassword>\n` +
      `</AuthenticationHeader>\n` +
      `</soap:Header>\n` +
      `<soap:Body>\n<PostInquiry xmlns="http://api.giact.com/verificationservices/v5">\n<Inquiry>\n` +
      "<GIdentifyEnabled>true</GIdentifyEnabled>\n" +
      "<GIdentifyEsiEnabled>true</GIdentifyEsiEnabled>\n" +
      `<Customer>\n` +
      userData +
      `</Customer>\n` +
      `</Inquiry>\n` +
      `</PostInquiry>\n` +
      `</soap:Body>\n` +
      `</soap:Envelope>`;
    return soapRequest;
  };

  // set the axios config fil so that we can POST to formatted SOAP request to the given API
  const generateAxiosConfig = () => {
    const soapRequest = generateSoapRequest();
    const axiosConfig = {
      method: "POST",
      url: apiURL,
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "http://api.giact.com/verificationservices/v5/PostInquiry",
      },
      data: soapRequest, // Be sure to specifc
    };
    return axiosConfig;
  };

  // Handle the server callback and return the parsed and formatted data
  const giactCallBack = await axios(generateAxiosConfig())
    .then(function (response) {
      return response.data;
    })
    .then((res) => parseResponse(res))
    .catch(function (error) {
      return error;
    });

  // Build responses object with the ESI and Identify Calls so that we parse any relevant data out of each of them
  res.send(giactCallBack);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
