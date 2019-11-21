# graphql-basics

### Steps for installing Prisma:

`npm i -g prisma2`

Check the Prisma version to make sure it was intalled correctly.

`prisma -v`

### Set up data store for Heroku project:

- Add steps here or link

### Steps to set up Prisma in project:

Within directory you want prisma: `git init {folderName}`

The cli walkthrough will ask:
- If you are using an existing db
- What kind of db (MySQL, PostGreSQL, MongoDB)
- Does the db contain existing data

then...
#### (The corresponding information for the following can be found from Heroku, since I was using Heroku.)
- host
- database
- user
- password
- port 
- ssl
- select the programming language for the Prisma generated client ( select don't generate )

Within the folder you initialized (`prisma init ...`), and after you complete the cli prisma walkthrough, 3 files will be generated:
- datamodel.prisma (can change extension to .graphql)
- docker-compose.yml
- prisma.yml

NOTE: The `docker-compose.yml` file will have the information you entered from the cli prompt questions.

```
version: '3'
services:
  prisma:
    image: prismagraphql/prisma:1.34
    restart: always
    ports:
    - "4466:4466"
    environment:
      PRISMA_CONFIG: |
        port: 4466
        # uncomment the next line and provide the env var PRISMA_MANAGEMENT_API_SECRET=my-secret to activate cluster security
        # managementApiSecret: my-secret
        databases:
          default:
            connector: {type of db you selected}
            host: {host from Heroku}
            database: {database from Heroku}
            schema: public {can be deleted or ignored}
            user: {user name from Heroku}
            password: {password from Heroku}
            ssl: {true or false}
            rawAccess: true
            port: '5432' {defaults to 5342}
            migrations: true
```

### Setting up Docker on your machine:
Make sure you have Docker installed on your machine, if not, install `Docker CE edition for Mac` from `docker.com`
Once installed go to Docker in applications folder and click it, this will run Docker on your machine.

The following command will build, (re)create, start, and attach to containers for a service. 
It will grab all the code necessary to run in a container so that the project is compatible in all environments.

Run in same directory as project: `docker.compose up -d` 

### Deploy Prisma to db:

Once the downloading is complete, deploy changes or updated from `datamodel.graphql` to db.

Run: `prisma deploy`

The terminal will return a url that will open up the Graphql playground.

You will need to run the previous command everytime you make changes/updates to datamodel to be reflected in db.
