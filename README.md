# Cart-order-deliver API example

* Nest.js
* Node v12.17.0
* [Auto semantic versioning](https://semver.org/)
* [Changelog generation](https://github.com/conventional-changelog/standard-version)
* [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)
* Precommit prettier
* VSCode debug launcher

## Installation

```bash
$ npm install
```

## Running the app

* Run docker-composed database:

`docker-compose up`

Access psql database on port `5433` (default) and/or adminer at port `8080` (default)

* Run the application

```bash
# copy .env.example to .env and provide database configuration
$ cp .env.example .env

# if your default nodeJS version is not v12.17.0
$ nvm use 

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Application will be available on port `3000` (default)

## Release

```bash
# for first release. Create tag and changelog, but skip version bumping
$ npm run first-release

# tag, changelog and version bump
$ npm run release
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
