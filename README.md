<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Installation

We're still in early alpha in developing this, so expect this process to become simpler soon, once DB backend is more stable

### Install postgres

Using the method of your choice, install a postgres server on your machine.

Then, create two databases, one with a name of your choice, the other (if you want to run tests) with the specific `heimdallts_jest_testing_service_db`

Edit your bash.profile (or equivalent file/method of setting environment variables) to export the following environment variables:

```bash
export DATABASE="localhost"
export DATABASE_USER="your db username"
export DATABASE_PASSWORD="your db password"
export JWT_SECRET="type some random characters here until we get a better method of generating them"
```

### Clone required repositories
```bash
git clone https://github.com/mitre/heimdallts.git heimdallts-server
git clone https://gitlab.mitre.org/rthew/sequelize-typescript-example.git heimdallts-db
```

### Build DB backend
```bash
cd heimdallts-db
npm i && npm run build && npm link
cd ..
```

### Build server

```bash
cd heimdallts-server
npm i && npm link hdf-db-sequelize
```

### Start

`npm run start:dev`

## Running the app


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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

![Docker Pulls](https://img.shields.io/docker/pulls/mitre/heimdall?label=Docker%20Hub%20Pulls)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/mitre/heimdall)
# Heimdall

Heimdall is a centralized visualization server for your InSpec evaluations and profiles.

## Description

Heimdall supports viewing of InSpec profiles and evaluations in a convenient interface. Data uploads can be automated through usage of curl and added as a step after an InSpec pipeline stage.

## Heimdall vs Heimdall-Lite

There two versions of the MITRE Heimdall - the full [Heimdall](https://github.com/mitre/heimdall/) and the [Heimdall-Lite](https://github.com/mitre/heimdall-lite/) version. We produced each to meet different needs and use-cases.

### Use Cases

| [Heimdall-Lite](https://github.com/mitre/heimdall-lite/) | [Heimdall](https://github.com/mitre/heimdall/) |
| :------------------------------------------------------- | :---------------------------------------------------------- |
| Ship the App & Data via simple Email                     | Multiple Teams Support                                      |
| Minimal Footprint & Deployment Time                      | Timeline and Report History                                 |
| Local or disconnected Use                                | Centralized Deployment Model                                |
| One-Time Quick Reviews                                   | Need to view the delta between one or more runs             |
| Decentralized Deployment                                 | Need to view subsets of the 800-53 control alignment        |
| Minimal A&A Time                                         | Need to produce more complex reports in multiple formats    |

### Features

| Features                                                                       | Heimdall-Lite     | Heimdall                                                                      |
| :----------------------------------------------------------------------------- | :---------------- | :---------------------------------------------------------------------------- |
| Installation Requirements                                                      | any web server    | rails 5.x Server <br/> PostgreSQL                                             |
| Overview Dashboard & Counts                                                    | x                 | x                                                                             |
| 800-53 Partition and TreeMap View                                              | x                 | x                                                                             |
| Data Table / Control Summary                                                   | x                 | x                                                                             |
| InSpec Code / Control Viewer                                                   | x                 | x                                                                             |
| SSP Content Generator                                                          | x                 | x                                                                             |
| PDF Report and Print View                                                      | x                 | x                                                                             |
| Users & Roles & multi-team support                                             |                   | x                                                                             |
| Authentication & Authorization                                                 | Hosting Webserver | Hosting Webserver<br />LDAP<br />GitHub OAUTH & SAML<br />GitLab OAUTH & SAML |
| Advanced Data / Filters for Reports and Viewing                                |                   | x                                                                             |
| Multiple Report Output<br />(DISA Checklist XML, CAT, XCCDF-Results, and more) |                   | x                                                                             |
| Authenticated REST API                                                         |                   | x                                                                             |
| InSpec Run 'Delta' View                                                        |                   | x                                                                             |
| Multi-Report Tagging, Filtering and Comparison                                 |                   | x                                                                             |


We publish our latest builds on [packackager.io](https://packager.io/gh/mitre/heimdall), [Docker Hub](https://hub.docker.com/r/mitre/heimdall) and Chef Habitat (Coming Soon).

### Run With Docker

Given that Heimdall requires at least a database service, we use Docker Compose.

#### Setup Docker Container (Clean Install)

1. Install Docker
2. ...

#### Managing Docker Container

The following commands are useful for managing the data in your docker container:

- `docker-compose run ???` **This destroys and rebuilds the db**
- `docker-compose run ???` **This updates the db**
- `docker-compose run ???` **This updates the db**

#### Running Docker Container

Make sure you have run the setup steps at least once before following these steps!

1. Run the following command in a terminal window:
   - `docker-compose up -d`
2. Go to `127.0.0.1:8050` in a web browser

##### Updating Docker Container

A new version of the docker container can be retrieved by running:

```
docker-compose pull
???
```

This will fetch the latest version of the container, redeploy if a newer version exists, and then apply any database migrations if applicable. No data should be lost by this operation.

##### Stopping the Container

`docker-compose down` # From the source directory you started from

## Using Heimdall

### Getting Started

Once you install Heimdall, you will have to create your first account. By default this account will have full `admin` rights and you will then be able to create other users and grant them access to roles, `circles` (groups) and teams as you need. You can add your first user by selecting 'Create Account' and then logging in as that user.

### Using LDAP and OAuth

Heimdall also supports connecting to your corporate LDAP and other OAuth authentication services but the authorization of those users in Heimdall is managed via the application itself (_PRs Welcome_).

### Uploading Results Manually

Once you have an account you can upload InSpec JSONs (see [reporters](https://www.inspec.io/docs/reference/reporters/)) for evaluations and profile then view them by clicking on the evaluations and profiles tab at the top of the page.

### Supporting Groups/Circles and Multiple Teams

Heimdall supports separating users into groups we call 'Circles' which is basically just groups and roles. This will allow you to deploy a command service which many teams can use, allow your AO or Security Teams to review and comment on multiple teams work while still providing separation of roles and responsibilities.

The Heimdall Administrator can define Circles and add users to those circles. At the moment, this is done directly in the Heimdall application (_PRs Welcome_) and teams can `push` their results to a circle via `curl`. This will allow multiple work streams to happen and easy integration into workflow processes while trying to keep the human element from going blind :).

My default everything goes to the public circle, you should define your circles with respect to the R&R of your organization and project and program structure.

Although it's just a suggestion, we have also found that having a few generic results in the `public` circle is useful to help easy demonstrations or conversations to happen. This will allow all visitors to view the profile/evaluation you uploaded.

### Remote Upload and Pipeline Integration via CURL

To upload through curl you'll need an API key. This is located on your profile page which can be reached by clicking on your user name in the top right corner, then on profile.

At its most basic, the upload API takes three parameters: the file, your email address, and your API key.

???

### Useful Tools

The [inspec_tools](https://github.com/mitre/inspec_tools) and [heimdall_tools](https://github.com/mitre/heimdall_tools) also have useful features that help you manage your results, do integration with your CI/CD and DevOps pipelines and get your teams working.

[inspec_tools](https://github.com/mitre/inspec_tools) has the [`compliance`](https://github.com/mitre/inspec_tools#compliance) and [`summary`](https://github.com/mitre/inspec_tools#summary) functions which will help you define a `go/no-go` for your pipeline results and allow you to define your `thin blue line` of success or failure. Incorporating these tools, you can `scan`, `process`, `evaluate` and `upload` your results to allow your various teams and `stages` to define the granularity they need while still following the `spirit` of the overall `DevSecOps` process as a whole.

For example, the [`compliance`](https://github.com/mitre/inspec_tools#compliance) function will let you easily use Jenkins, GitLab/Hub CICD or Drone to have clean pass/fail with an `exit 0` or `exit 1` and allow you to define exactly the `high`, `medium` and `low` and overall `compliance score` that you and your Security Official agreed to in `production` or in `development`.

_NOTE_ You should always test like you are in _production_, that is where you are going to end up after all!!

## Configuration

???

#### Build container from behind an Intercepting proxy

???

#### Host container off relative url

???

#### Switch container to dev mode

???

## Development

???

### Dependencies

???

## Versioning and State of Development

This project uses the [Semantic Versioning Policy](https://semver.org/).

# Contributing, Issues and Support

## Contributing

Please feel free to look through our issues, make a fork and submit _PRs_ and improvements. We love hearing from our end-users and the community and will be happy to engage with you on suggestions, updates, fixes or new capabilities.

## Issues and Support

Please feel free to contact us by **opening an issue** on the issue board, or, at [inspec@mitre.org](mailto:inspec@mitre.org) should you have any suggestions, questions or issues. If you have more general questions about the use of our software or other concerns, please contact us at [opensource@mitre.org](mailto:opensource@mitre.org).

## A complete PR should include 7 core elements:


??? 
- A signed PR ( aka `git commit -a -s` )
- Code for the new functionality
- Updates to the CLI
- New unit tests for the functionality
- Updates to the docs and examples in `README.md`
- (if needed) Example / Template files
  - Scripts / Scaffolding code for the Example / Template files
- Example Output of the new functionality if it produces an artifact

### Our PR Process

1. open an issue on the main heimdall website noting the issues your PR will address
2. fork the repository
3. checkout your repository
4. cd to the repository
5. git co -b `<your_branch>`

???

9. ensure unit tests still function and add unit tests for your new feature
10. add new docs to the `README.md`
11. (if needed) create and document any example or templates
12. (if needed) create any supporting scripts
13. update the version and changelog (see below for instructions)

14. Open a PRs on the MITRE heimdall repository

### Versioning and the Changelog

???


## Licensing and Authors

### Authors

- Robert Thew
- Aaron Lippold
- Jacob Henry

### NOTICE

© 2019-2020 The MITRE Corporation.

Approved for Public Release; Distribution Unlimited. Case Number 18-3678.

### NOTICE

MITRE hereby grants express written permission to use, reproduce, distribute, modify, and otherwise leverage this software to the extent permitted by the licensed terms provided in the LICENSE.md file included with this project.

### NOTICE

This software was produced for the U. S. Government under Contract Number HHSM-500-2012-00008I, and is subject to Federal Acquisition Regulation Clause 52.227-14, Rights in Data-General.

No other use other than that granted to the U. S. Government, or to those acting on behalf of the U. S. Government under that Clause is authorized without the express written permission of The MITRE Corporation.

For further information, please contact The MITRE Corporation, Contracts Management Office, 7515 Colshire Drive, McLean, VA 22102-7539, (703) 983-6000.
