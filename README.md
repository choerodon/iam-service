# IAM Service
This service includes management functions of user, role, permission, organization, project, password policy, fast code, client, menu, icon, multi-language , and supports for importing third-party users through ldap.

- Role

There are three built-in roles in `iam-service`:

1. Platform administrator (having all privileges of platform global layout).
2. Organization administrator (having all privileges of  a single organization's organizational layout). 
3. Project administrator (having all privileges of a single project's project layout).
    

    When assigning a role to a user, the role-associated labels are sent to the devops for processing, and the corresponding roles are assigned to gitlab.

- User

  After the service is initialized, a user admin is built in. Which has all the platform-wide privileges, including all permissions for all organizations and all projects.

  Creating, modifying, and deleting users lead to send events, gitlab synchronization to do the appropriate operation

- Privilege

  All interfaces of the service define permissions through the `@Permission` annotation. All interfaces of this service define permissions through the `@Permission` annotation. With the `register server` and `manager service`, the privileges information of all services will be automatically entered into the database to make it effective through the service. The `@Permission` annotation sets the interface as a public interface (accessible without login), login access, global layer interfaces, organization layer interfaces, and project level interfaces.

- Organization

  After the service is initialized, an organization "operational organization" is built in. At the same time, the admin user has all the privileges of the organization.

- Client

  
  The addition, deletion, and modification of the built-in client is a interface of organizational layer, which corresponds to the "client" needed to log in via `oauth-server`.

- Directory

  Corresponding to the front page display directory, including add, delete, change check, is the global layer interface.
  
- Password policy


## Feature

- Currently only Chinese and English are supported. Will support more languages later.
- Refactor the code and optimize the domain model in DDD.

## Requirements

- The project is an eureka client project, which local operation needs to cooperate with `register-server`, and the online operation needs to cooperate with `go-register-server`.

## Installation and Getting Started

1. Start up [register-server](https://github.com/choerodon/eureka-server)
2. In the local mysql, create the `iam_service` database. 

```sql
CREATE USER 'choerodon'@'%' IDENTIFIED BY "123456";
CREATE DATABASE iam_service DEFAULT CHARACTER SET utf8;
GRANT ALL PRIVILEGES ON iam_service.* TO choerodon@'%';
FLUSH PRIVILEGES;
```
New file of "init-local-database.sh" in the root directory of the manager-service project：

```sh
mkdir -p target
if [ ! -f target/choerodon-tool-liquibase.jar ]
then
    curl http://nexus.choerodon.com.cn/repository/choerodon-release/io/choerodon/choerodon-tool-liquibase/0.5.2.RELEASE/choerodon-tool-liquibase-0.5.2.RELEASE.jar -o target/choerodon-tool-liquibase.jar
fi
java -Dspring.datasource.url="jdbc:mysql://localhost/iam_service?useUnicode=true&characterEncoding=utf-8&useSSL=false" \
 -Dspring.datasource.username=choerodon \
 -Dspring.datasource.password=123456 \
 -Ddata.drop=false -Ddata.init=true \
 -Ddata.dir=src/main/resources \
 -jar target/choerodon-tool-liquibase.jar
```

And executed in the root directory of the iam-service project：

```sh
sh init-local-database.sh
```

4. Go to the project directory and run `mvn spring-boot:run` or run `IAMServiceApplication` in idea.

## Dependencies
- `go-register-server`
- `config-server`

## Links

* [Change Log](./CHANGELOG.zh-CN.md)

## How to Contribute

Pull requests are welcome! [Follow](https://github.com/choerodon/choerodon/blob/master/CONTRIBUTING.md) to know for more information on how to contribute.