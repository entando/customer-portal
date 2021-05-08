# Deployment
With this configuration, you can use the ent cli (https://dev.entando.org/v6.3/docs/reference/entando-cli.html) to perform the full deployment sequence:

1. `cp -r bundle_src bundle` (this is only needed the first time ina local env unless the bundle dir is removed)
2. `ent prj init`
3. `ent prj build` (build the frontend and backend) or `ent prj fe-build -a` (to just build the frontend, including changes from bundle_src)
4. `ent prj pbs-init` (requires the git bundle repo url)
5. `ent prj pub` or `ent prj fe-push` (publish all or just the frontend)
6. For a local Entando installation: `ent prj generate-cr | ent kubectl create -n entando -f -`

Install the bundle using the App Builder.

# Prerequisites
* JIRA Service Management instance
  * Service URL, e.g. https://<YOUR_ACCOUNT>.atlassian.net/rest/api/latest/
  * Service account email and password (or preferably API token)
  * Project name key, e.g. ENT
  * Custom field ids for organizations (default 10002), subscription level (default 10038). See https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/#fieldformats for documentation on field mapping and formats.
  * By default the Customer Portal uses issue types Support and Feature Request
  * The Affects Version field is used to map to the EntandoVersion and the text of the versions must match
* Keycloak
  * cp-admin
  * cp-support
  * cp-partner
  * cp-customer
  * The built-in mapper for email must be enabled on the server client so that user accounts can be retrieved from Jira and tickets created used that account information.
  * Test users are automatically added in a local keycloak instance from docker/realm-config - admin/admin, support/user, partner/user, user/user.
* Pages
  * Some features are delivered using dedicated pages within Entando.
    * open_service_ticket.page
    * new_or_renew_subscription.page
    * manage_users.page
* Email 
  * TODO configuration for email server
  
# Development tips
* The database model can be revised using `ent jhipster import-jdl jdl/entando-customer-portal-datamodel.jdl`. Caveat, changes will need to be reviewed and accepted individually. 
  * For example, the UI code may be reformatted and stock unused widgets generated
  * repository/*Repository classes have some custom queries and methods
  * web/rest/*Resource classes have been heavily customized with security checks and generally should be rolled back.
* You can use `./mvnw clean` to reload the fake dataset from src/main/resources/config/liquibase/fake-data.
* Removing the src/main/docker/keycloak-db directory will result in the realm from src/main/docker/realm-config being reloaded on the next restart.

---
Standard Blueprint documentation follows...

---

# Spring Boot/microservice application - custportApp

This application was generated using JHipster 6.9.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v6.9.0](https://www.jhipster.tech/documentation-archive/v6.9.0).

This is a "microservice" application intended to be part of a microservice architecture, please refer to the [Doing microservices with JHipster][] page of the documentation for more information.

This application is configured for Service Discovery and Configuration with . On launch, it will refuse to start if it is not able to connect to .

## Development

To start your application in the dev profile, run:

    ./mvnw

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the custportApp application for production, run:

    ./mvnw -Pprod clean verify

To ensure everything worked, run:

    java -jar target/*.jar

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

    ./mvnw -Pprod,war clean verify

## Testing

To launch your application's tests, run:

    ./mvnw verify

For more information, refer to the [Running tests page][].

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar
```

or

For more information, refer to the [Code quality page][].

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a postgresql database in a docker container, run:

    docker-compose -f src/main/docker/postgresql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/postgresql.yml down

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

    ./mvnw -Pprod verify jib:dockerBuild

Then run:

    docker-compose -f src/main/docker/app.yml up -d

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 6.9.0 archive]: https://www.jhipster.tech/documentation-archive/v6.9.0
[doing microservices with jhipster]: https://www.jhipster.tech/documentation-archive/v6.9.0/microservices-architecture/
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v6.9.0/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v6.9.0/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v6.9.0/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v6.9.0/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v6.9.0/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v6.9.0/setting-up-ci/
