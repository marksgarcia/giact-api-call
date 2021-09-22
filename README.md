# GIACT EXPRESS API

### What is this repository for?

- This API currently POSTs to the GIACT gIdentifyESI and gIdentify API using ExpressJS and returns a javascript object composed of two keys (esi, identify) in the response, with each key holding the value of its respective API response. Future iterations can simply return a truthy or falsey statement regarding the whether a user should be flagged or not.
- 1.0.0

### Packages & Dependencies

- NodeJS
- [ExpressJS](https://www.npmjs.com/package/express)
- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [xml-parser](https://www.npmjs.com/package/xml-parser)

### How do I get set up?

1. First, clone or download the repo and run `npm install` from the root directory to install the necessary dependencies.
2. You will need to set up a `.env` file with the _Sandbox_ or _Production_ API credentials in it (details below).
3. Once the packages have installed, run `npm start` to start the server on your localhost port 3000.
4. Open Postman and perform calls via the following setup:
   a. Set the request method to a **POST**
   b. Set the url to `localhost:3000/`
   c. Select the **Body** option under the URL window and then select **raw** from the options and then set the type to **JSON**
5. You should now be ready to test the development server.

### ENV File

Your .env file should be set up in the following manner:
```

GIACT_UN=<USERNAME>
GIACT_PW=<PASSWORD>
GIACT_ENV=SANDBOX

```


Where `<USERNAME>` and `<PASSWORD>` are replaced with the credentials that you use for either the Sandbox or Production environment. So, if my username was **markymark** and my password was **HelloW0rld!**, then my .env file would look like this:

**Note:** The `GIACT_ENV` variable can be set to either **SANDBOX** or **PRODUCTION** and will modify which URL the API uses for the POST method.

```

GIACT_UN=markymark
GIACT_PW=HelloW0rld
GIACT_ENV=SANDBOX

```

Additionally, for ease of use, you could also set up your .env file in the following manner
```

GIACT_UN=<SBUSERNAME>
GIACT_PW=<SBPWORD>
GIACT_ENV=SANDBOX

#GIACT_UN=<PRODUSERNAME>
#GIACT_PW=<PRODPWORD>
#GIACT_ENV=PRODUCTION

```
The `#` sets the PROD values in this example as comments. In this manner, you can quickly jump between PROD and SANDBOX while testing.
### Call Parameters

Each call to Giact's Identify API is broken into a collection of parameters, some required, and some not. The parameters are shown below:

| Parameter    | Type   | Required |
| ------------ | ------ | -------- |
| firstName    | String | **true** |
| middleName   | String | false    |
| lastName     | String | **true** |
| addressLine1 | String | **true** |
| addressLine2 | String | false    |
| city         | String | **true** |
| state        | String | **true** |
| zipCode      | String | **true** |
| phone        | String | false    |
| dateOfBirth  | String | false    |
| dlNumber     | String | false    |
| dlState      | String | false    |
| taxId        | string | false    |

Each call to Giact's IdentifyESI API is broken into a collection of parameters, some required, and some not. The parameters are shown below:

| Parameter    | Type   | Required |
| ------------ | ------ | -------- |
| email        | String | **true** |
| firstName    | String | false    |
| middleName   | String | false    |
| lastName     | String | false    |
| addressLine1 | String | false    |
| addressLine2 | String | false    |
| city         | String | false    |
| state        | String | false    |
| zipCode      | String | false    |
| ipAddress    | String | false    |

To perform a call using the parameters, simply enter JSON into the **Body** section of Postman before sending your request.

An example request is shown below, and the appropriate parameters of this request will be sent to both the gIdentify and the gIdentifyESI APIs:

```JSON
{
    "email": "jane.doe@gmail.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "addressLine1": "1923 Lake Forest Rd",
    "city" : "Grapevine",
    "state" : "TX",
    "zipCode" : "76051",
    "ipAddress": "123.45.67.89"

}
```

Consult the GIACT test guidelines for a colleciton of the users and their relevant data that can be used in the sandbox environment.

### Who do I talk to?

- Repo owner or admin - Mark Garcia (msgarcia@collni.edu)
