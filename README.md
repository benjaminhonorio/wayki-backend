# Waiky backend

## How to run

1. Install all packages with `npm install`
2. Set your required environment variables as you see fit in a `.env` file following the sample `.env.example` structure provided.
   Default PORT is 3002 (see config folder).
3. There are 3 node environments: production, development and test.
   You can run in production with `npm start`, development with `npm run dev` and tests with `npm test` (not tests yet)

## TODO:

- [ ] Post Controller
- [ ] Post Model and Schema
- [ ] User Controller
- [ ] User Model and Schema
- [ ] Deploy to Heroku

## Optionals

Considerations:

-Requests folder inside tests folder is there to share `.rest `files which can be used as altarnative to postman and can be run in VSCode for testing purposes.
see [link](https://fullstackopen.com/en/part3/node_js_and_express#the-visual-studio-code-rest-client)

-For testing the api see sections a and b in [link](https://fullstackopen.com/en/part4)

TODO:

- [ ] Write testing requests in .rest files
- [ ] API tests with jest and supertest
- [ ] Move mongoose database connection
