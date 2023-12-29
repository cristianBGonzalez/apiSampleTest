# Prerequisite

You must have the following installed in your machine:

- docker
- node.js
- prisma

Due to a *current bug* I'm working on, you will be needing node.js and prisma (installed via npm) in order to run this correctly.

# Setup

You'll need to create a `.env` file. You can use the `.env.sample` file as a template. It's recommeneded not to change the port numbers unless you want to change them in the `docker-compose` file as well. (I haven't gotten the chance to add ports or other variables from the `.env` to the `docker-compose` file yet.)

To add 

# Docker

Once you have setup your `.env` file, then you'll to run the following code in your terminal:

```bash
docker-compose up --build
```

Once that's done, we'll need to do one more thing in order to get the database working properly (with its bugs included). Execute the following code in a different terminal, and make sure you are in the path of the repository.

```bash
npx prisma migrate dev
```

This will add the table ***User*** to the database.

# Access the API and pgAdmin Pages

To check the correct port number for pgadmin or sveltekit api, you can run the following code on a different terminal:

```bash
docker ps
```

Once you see the results, the API will be under the IMAGE ***svelte-app*** while pgAdmin will be under the IMAGE ***dpage/pgadmin4***. There you will see the correct port number next to the local address. You can usually access those pages with `http://localhost:<Image's Port Number>/`


# Getting the IP of Your Database

Using the same code as above, you will need to get the Container ID for the IMAGE ***postgres***. Once you have copied the ID, then you'll need to run the following code:

```bash
docker inspect <Container ID>
```

In the output, you'll need to find the "IPAddress" entry that is near the bottom of the result. Save that IP as you'll need it to view the database via pgAdmin.

# pgAdmin

With `http://localhost:<pgAdmin's Port Number>/`, you can access and login. Your login and password are based on ***PGADMIN_DEFAULT_EMAIL*** and ***PGADMIN_DEFAULT_PASSWORD*** that you've entered in your `.env` file.
Once logged in, under the **Object Explorer** sidebar, right click on *Servers* and select "Register", then "Server...". 
In the **General** tab, the field *Name* should be the same as ***POSTGRES_DB*** that is in your `.env` file. 
In the **Connection** tab, the field *Host name/address*, put the IP Address that we got earlier in [Getting The IP of Your Database](#getting-the-ip-of-your-database). Once that's done, enter your password which should be based on ***POSTGRES_PASSWORD*** that's in your `.env` file.

# Testing API with Postman

[Postman](https://www.postman.com/) is a useful tool to test APIs. There is also Thunder Client for VS Code, but for now I'll be explaing with Postman. In the Postman site, you'll need to signup in order to use their services. Once that's done, you'll need to enter "My Workspace".
There, you'll need to click *Collections* that is to the left. Then you'll need to click *Import* that is to the top right of the sidebar. You'll need to import ***SvelteKit HS256 JWT.postman_collection.json*** that's part of the repository. Once imported, you can click on the differnt folders and see the different test senarios.

# Unfortunate Bug

Currently, if you test the API with Postman with either *Register* or *Login*, there will be an error message from prisma with the following message:

>Can't reach database server at `localhost`:`6500`
>Please make sure your database server is running at `localhost`:`6500`.

At the moment, this bug has been preventing me from testing any further and I haven't added more features to the API that would make it support more CRUD operations (it's currently lacking a different Update and Delete). 