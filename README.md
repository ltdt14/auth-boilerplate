# Auth Boilerplate

This is a boilerplate for a API server with authentication.
It provides a Signup and Login Endpoint and requires an authtoken
to do crud actions on lists with listitems of a user.
A webapp which directly uses this boilerplate is available here:

[Auth Boilerplate Webapp](https://authfront.lassetodt.de)

**Credentials for test accout**
- Email: user@user.de
- Password: password

<!-- toc -->

- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installing](#installing)
  * [Usage](#usage)
  * [API](#api)
- [Development](#development)
- [Versioning](#versioning)
- [License](#license)

<!-- tocstop -->

## Featues

- API Server with ExpressJS
- MongoDB connection
- Authentication with PassportJS
- API documentation with APIDoc
- Testing with Mocha
- Code Coverage with Istanbul
- Linting with ESLint via Airbnb Styleguide and PrettierJS
- Documentation with JSDoc

## Getting Started

### Prerequisites

- This boilerplate requires a MongoDB connection. Provide the MongoDB URI in .env file.
- This boilerplate requires some other variables provided in .env file. See .env.example for details

### Installing

- clone this repo
- run `npm install` to install dependencies

### Usage

- run `npm start` to start the server

### API

[See API Doc](docs/API.md) to see all available REST Endpoints

## Development

[See Developer Readme](docs/DEV_README.md) for all available

## License

MIT

## Sources
- [Tutorial Scotch.io](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
