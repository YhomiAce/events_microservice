

###  Description

### User and Event Service
Handles user registration, authentication, event creation,
join requests, and request management.

## Api Documentation

<p> The Apis are documented using Swagger OpenApi </p>
<a href="http://localhost:3000/api/docs">Swagger Api Docs</a>

## Models and Migrations
<p> The ORM used for this project is <b>Typeorm</b> </p>
<p> The entities are in the <b>src/entities</b> folder</p>
<p> The migrations are in the <b>src/database/migrations</b> folder</p>


<p> To create a new empty migration:</p>

```bash
$ docker-compose exec events npm run migration:create --name=name-of-migration
```
<p> To generate a migration from entity file:</p>

```bash
$ docker-compose exec events npm run migration:generate --name=name-of-migration
```
<p> To run a migration:</p>

```bash
$ docker-compose exec events npm run migration:run
```
<p> To rollback/revert last migration:</p>

```bash
$ docker-compose exec events npm run migration:revert
```
