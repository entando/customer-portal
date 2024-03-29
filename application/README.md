# Deployment and installation
With this configuration, you can use the ent cli (https://dev.entando.org/next/docs/reference/entando-cli.html) to perform the full deployment sequence:

### Setup the project directory.
1. Prepare the bundle directory: `cp -r bundle_src bundle`
2. Initialize the project: `ent prj init`
3. Initialize publication: `ent prj pbs-init` (requires the git bundle repo url)

### Publish the bundle.
1. Build: `ent prj build` (build the frontend and backend) or `ent prj fe-build -a` (to just build the frontend, including changes from bundle_src)
2. Publish: `ent prj pub` or `ent prj fe-push` (publish all or just the frontend)
3. Deploy (after connecting to k8s): `ent prj deploy`
4. Install the bundle via 1) App Builder, 2) `ent prj install`, or 3) `ent prj install --conflict-strategy=OVERRIDE` on subsequent installs.
5. Iterate steps 1-4 to publish new versions.

# Prerequisites
* JIRA Service Management instance
  * Service URL, e.g. https://<YOUR_ACCOUNT>.atlassian.net/rest/api/latest/
  * Service account email and password (or preferably API token)
  * Project name key, e.g. ENT
  * Custom field ids (version, organization and subscription level) are pre-loaded with default values in the`ticketing_system_configuration`table. These values can be modified via the Admin UI.
  * By default the Customer Portal uses issue types Support, New Feature, and Bug during ticket creation. 
* Keycloak
  * cp-admin
  * cp-support
  * cp-partner
  * cp-customer
  * The built-in mapper for email must be enabled on the server client so that user accounts can be retrieved from Jira and tickets created used that account information.
  * Test users are automatically added in a local keycloak instance from docker/realm-config - admin/admin, support/user, partner/user, user/user.
* Pages
  * Some features are delivered using dedicated pages within Entando.
      * customer_portal.page
      * cp_admin_config.page
      * cp_keycloak_silent_check_sso.page
  
# Development tips
* The database model can be revised using `ent jhipster import-jdl jdl/entando-customer-portal-datamodel.jdl`. Caveat, changes will need to be reviewed and accepted individually. As of Entando 6.3, you'll need to add a liquibase changeset by hand if you don't want to reset your database. This may change with the next version of Entando or more specifically JHipster 7 which upgrades liquibase. Caveat#2, the most recent data model changes for the ticketing_system_configuration were not generated using the JDL so the code has diverged slightly.
  * For example, the UI code may be reformatted and stock unused widgets generated
  * repository/*Repository classes have some custom queries and methods
  * web/rest/*Resource classes have been heavily customized with security checks and generally should be rolled back.
* You can use `./mvnw clean` to reload the fake dataset from src/main/resources/config/liquibase/fake-data.
* You may encounter checksum issues with liquibase. These can be cleared (if you've enabled the jdbc connection in the
  pom.xml) using './mvnw liquibase:clearCheckSums' BUT you should carefully consider this a warning sign. You may have
  introduced changes in the database schema and actually need to update the liquibase changesets instead.
* Removing the src/main/docker/keycloak-db directory will result in the realm from src/main/docker/realm-config being
  reloaded on the next restart.
* Access controls are applied both in the UI and in the microservices. Individual REST APIs (e.g. ProjectResource) must either have tight constraints on an admin or support user (via an `@PreAuthorize annotation`) or customer or project-level access checks (e.g. `projectService.checkProjectAccess(projectId)`).
* For local installations, the `.env.local.template` must be copied to  `.env.local` to initialize the FE properly.

e.g. `cp ui/widgets/cp-widgets-dir/cp-widgets/.env.local.template ui/widgets/cp-widgets-dir/cp-widgets/.env.local`

# Local testing
* (First time) Make sure `.env.local` is in place as noted above
* Start keycloak and postgresql: `docker-compose -f src/main/docker/local_app.yml up`. Keycloak will be available on `http://localhost:9080/auth/`
* Start the microservice:  `ent prj be-test-run`. Available on `http://localhost:8081/services/custportApp/swagger-ui.html?urls.primaryName=entando`
* Start the MFE: `ent prj fe-test-run` and select the cp-widgets. Available on `http://localhost:3000`

---
------
The default Blueprint documentation follows...
------
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
