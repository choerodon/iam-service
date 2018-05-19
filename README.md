# iam-service
> IAM services: With management functions of user, role, permission, organization, project, password policy, fast code, client, menu, icon, multi-language , and support for importing third-party users through idap. This service is based on Domain Driven Design (DDD).

- Role

  The service is initialized with three built-in roles: the platform administrator (having all privileges of platform global layout), the organization administrator (having all privileges of  a single organization's organizational layout), and the project administrator (having all privileges of a single project's project layout).
   When assigning a role to a user, the role-associated labels are sent to the devops for processing, and the corresponding roles are assigned to gitlab.

- User

  After the service is initialized, a user admin is built in. Which has all the platform-wide privileges, including all permissions for all organizations and all projects.
Creating, modifying, and deleting users lead to send events, gitlab synchronization to do the appropriate operation

- Privilege

  All interfaces of the service define permissions through the @Permission annotation. All interfaces of this service define permissions through the @Permission annotation. With the registration service and management service, the privileges information of all services will be automatically entered into the database to make it effective through the service. The @Permission annotation sets the interface as a public interface (accessible without login), login access, global layer interfaces, organization layer interfaces, and project level interfaces.

- Organization

  After the service is initialized, an organization "operational organization" is built in. At the same time, the admin user has all the privileges of the organization.

- Clinet
  
  The addition, deletion, and modification of the built-in client is a interface of organizational layer, which corresponds to the "client" needed to log in via oauth-server.

- Directory
  
  Corresponding to the front page display directory, including add，delete，change check,  is the global layer interface.
  
- Password policy

  The interface for querying and updating the password policy is an organization-layout interface.

## Feature

- Currently only Chinese and English are supported. More languages will be supported later.
- Refactor the code and optimize the domain model in DDD.

## Requirements

- The project is an eureka client project, which local operation needs to cooperate with register-server, and the online operation needs to cooperate with go-register-server.

## To get the code

```
git clone https://github.com/choerodon/iam-service.git
```

## Installation and Getting Started

1. Start up register-server
2. In the local mysql, create the iam_service database. In the project directory, execute sh init-local-database.sh to initialize the data table.。
3. Start up kafka
4. Go to the project directory and run `mvn spring-boot:run` or run ʻEventStoreApplication` in idea.

## Usage

- Build mirror

   Pull source code to execute mvn clean install, generate app.jar in the target directory, copy it to src/main/docker directory, there are dockerfile, perform docker build as a mirror.
- The usage of existing mirror

 ```
 docker pull registry.xxx/xxx/iam-service:0.1.0
 ```
- Create a new k8s job, initialize the configuration with choerodon-tool-config, and initialize the database with choerodon-tool-liquibase.
- Create new deployment on k8s and running, you can refer to the code directory deployment file to write code.

## Dependencies

- go-register-server: Register server
- config-server：Configure servere
- kafka
- mysql: iam_service database

## Reporting Issues

If you find any shortcomings or bugs, please describe them in the Issue.
    
## How to Contribute

Pull requests are welcome! Follow this link for more information on how to contribute.


