# Multiplayer Pong Game And Social Networking Using React, Typescript, Node and Nestjs!

### Summary!

This fullstack website allows users to play the classic game of pong against others. it also features a range of impressive functionalities, including a login system, user profiles, a match-making system, a group chat interface, a DM system, a ranking system, a friends system, and a two-factor authentication system. This project offers an excellent opportunity to demonstrate technical proficiency across both frontend and backend development.

This is the final project of the core curriculum at 42 School (One of the top ten most innovative universities according to the WURI 2021 ranking). I completed this project on my own. All projects at 42 School go through three evaluations, and you can see the requirements for delivering the project at the end of this page.

## Main Technologies

* Frontend: React, Typescript, Styled Components.
* Backend: Nest.js, Node.js, Express.js, PostgreSQL.
* Authentication: Passport, JWT.
* 2FA: SendGrid API.
* Others: Docker and Docker Compose.

## Visual Overview

Dashboard:

![Dashboard](readme/dashboard.png "Dashboard")

Private Profile:

![Dashboard](readme/privateprofile.png "Private Profile")

Online Multiplayer Game:

![Dashboard](readme/ponggame.png "Online Multiplayer Game")

Public Chat Room:

![Dashboard](readme/publicchatroom.png)

Users Modal:

![Dashboard](readme/usersmodal.png)

Friends Modal:

![Dashboard](readme/friendsmodal.png)

Ranking:

![Dashboard](readme/ranking.png)

Chat Rooms:

![Dashboard](readme/chatrooms.png)

Room Adm Panel:

![Dashboard](readme/admpanel.png)

Final Game Scream:

![Dashboard](readme/finalscream.png)

There are additional functionalities in the game. At the end of this README, I will provide a list of all the requirements and tasks completed for this project.

Remove the database: rm -rf ./pgdata

### Usage

1 - First, you need to install and download Docker and Docker Compose.

2- Open the project folder.

3- Run docker compose command inside the project folder

```
docker-compose up –-build
```
or
```
docker compose up –-build
```

4- Go to the login URL:

```
http://localhost:3000/
```

If you are not a 42 student:

```
http://localhost:3000/test
```

### What was done in the project?!

<List>
        <li>The website allows users to play real-time multiplayer Pong games with a chat feature and complies with specific rules, including using Node and NestJS for the backend, a TypeScript and React for the frontend, and PostgreSQL for the database.</li>
        <li>The User Account section of the website allows users to log in using the OAuth system of 42 intranet API, choose a unique name and avatar, enable two-factor authentication, add friends, view their status, display their stats, and have a match history including 1v1 games and ladder.</li>
        <li>The website's chat feature allows users to create public, private or password-protected channels, send direct messages and block other users, while channel owners can set a password, remove it, and appoint other administrators who have specific permissions to kick, ban or mute users, as well as invite users to play Pong games and access their profiles.</li>
        <li>The website is designed to allow users to play live Pong games against each other and features a matchmaking system for finding opponents, a customizable Pong game that is true to the original 1972 version, and the ability to select a default version without any extra features. The game is also responsive to ensure optimal gameplay.</li>
        <li>Ensuring full functionality of the website necessitates tackling security concerns such as hashing any stored passwords, safeguarding against SQL injections, and incorporating server-side validation for forms and user input.</li>
</List>

![image description](readme/comousar.png)

## Index

*  [Summary](#Summary)
*  [Main Technologies](#Main-Technologies)
*  [Visual Overview](#visual-overview)
*  [Usage](#Usage)
*  [What was done in the project?!](#What-was-done-in-the-project)
*  [Requirements](#Requirements)


### Study

#### Backend

## Node

“As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications.”

When javascript was first created it was designed to run in the broweser. Simply, it allow us to run javascript in a machine. Besides that it also adds functionalities to javascript as the ability to read and write local files, create http connections and listen to network requests.

Node is asynchronous which allow us to use callbackfunction.

“any time we get a network request, run this callback function”

In my code, we can see that here:

```
@Get('running')
  async getRunningGames(@Req() request: any, @Body() data : any): Promise<any> {
    try
    {
    const games = await this.GameService.getRunningGames();
    return games;
    }
    catch (e) {
      return e;
    }
  }
```

When i make a get request to localhost:3001/running it calls a callback function that returns a array with the running games in the application. 

## CRUD

CRUD stands for: Create, Read, Update and Delete. Put simply, if you are designing a CRUD interface that means that users can expect to be able to do these 4 things to items in the database (providing they have the appropriate permissions of course).

In your library example, this simply means that we are going to be building the ability for users to create entries (add books, authors or genres to the database), read entries (or, retrieve lists of books and other things from the database), update entries (edit details of an entry), and delete entries (remove them from the database).

## RESTful API?

REST stands for Representational State Transfer. It is an architectural style for designing networked applications.

Uniform Interface: The interface between components is defined in a way that doesn’t depend on implementation details.

Stateless: The server is independent of all previous requests, so the client can make requests in any order.

Layered System: The client doesn’t know how many layers the server has, and the server can make requests to other servers on behalf of the client.

Caching: The client can cache responses, so it doesn’t need to make the same request multiple times.

Code on Demand: The server can extend or customize the functionality of the client by transferring executable code.

The advantages are:

Scalability: Since the client doesn’t need to maintain state, it can improve scalability.

Flexibility: Since the client and server are completely decoupled, it can provide flexibility by allowing different layers of application functionality.

Independence: You can use different programming languages to write programs without affecting the design of the API.

Font: https://www.explainthis.io/

# How to use?

It uses the http protocol:

GET: Used to retrieve data from the server.
POST: Used to send data to the server.
PUT: Used to update data on the server.
DELETE: Used to delete data from the server.
PATCH: Used to update part of the data on the server.

It also has a http header that can contain a set of key-values that provide additional information about the request. In my code i use the header to send the login token. 

# HTTP Status Code

It is a 3-digit number that indicate the status of the response:

1xx: Informational responses, the request has been received and the process is continuing.
2xx: Success, the request has been successfully received, understood, and accepted.
3xx: Redirection, further action needs to be taken in order to complete the request.
4xx: Client error, the request contains bad syntax or cannot be fulfilled.
5xx: Server error, the server failed to fulfill an apparently valid request.

## SQL Injection

SQL Injection is a common type of cyber attack that involves modifying SQL statements to maliciously access a database.

In nestjs we use ORM (TypeORM) to prevent against SQL .injections. We also can use paremeterized queries if we want to use raw SQL queries. 

There is other types of attacks such as XSS, CSRF...

## Encryption, Encoding and Hashing

-Encryption: Encryption is the process of transforming data in such a way that it becomes unreadable unless the recipient has the key to decrypt it. Encryption is often used to protect sensitive information during transmission or storage, and it can be reversed with the correct key. Examples of encryption algorithms include AES, RSA, and DES.

-Encoding: Encoding is the process of converting data from one format to another, usually to make it more suitable for transmission or storage. Encoding does not provide any security or privacy protection and can be easily reversed. Examples of encoding schemes include base64, UTF-8, and ASCII.

-Hashing: Hashing is the process of transforming data into a fixed-length string of characters, often referred to as a hash value or digest. Hashing is a one-way process that cannot be reversed, and it is commonly used to verify the integrity of data or passwords. Hashing algorithms produce a unique hash value for each input, making it difficult to guess the original data from the hash value. Examples of hashing algorithms include SHA-256, MD5, and bcrypt.

All the passwords stored in my database are hashed. And i used encoding to store names that need to be used in urls. I also used encryption to generate the login token of the application. 

## NPM 




### Requirements

#### Mandatory part

## I - 1 Overview

In this subject you will need to build a website for the mighty pong contest.
Your website will help user run pong tournament and play against each other.
There will be an admin view, chat with moderators, real time multiplayer online
games.

You will need to follow thoses rules:

-   you must use the last stable version of every frameworks or libraries.
-   Your website backend should be written in NestJS.
-   You must use a postgresql database and no other databases.
-   The front end must be written with any typescript framework.
-   Your website should be a single page app, but user should be able to use the back
    button on the browser https://en.wikipedia.org/wiki/Singlepage_application
-   Your website must be usable on the latest version to date on Google Chrome,
    Firefox, Safari.
-   There must be no unhandled errors or warning when browsing through the website.
-   You can use any library.
-   Everything should run with a single call to docker-compose up –build

## I - 2 Security concerns

Because you are creating a fully-working website, there are a few security concerns that
you will have to tackle

-   Any password stored in your database must be encrypted
-   Your website must be protected against SQL injections
-   You must implement some kind of server-side validation for forms and any user
    input

## I - 3 User Account

-   A user must login using the oauth system of 42 intranet
-   A user must be able to choose a unique name that will be displayed on the website
-   A user has a number of victory and loss and other stats (ladder level, number of
    won tournaments, achievements etc...)
-   A user must have an avatar generated or uploaded by the user
-   A user must be able to activate a 2 factor authentication (like google authenticator
    or a sms etc...)
-   A user can be in 1 guild at a time
-   A user can add other users as friends, and see their current status (online, offline,
    in a game...)
-   Each user has a match history (including duel, ladder or tournaments games) that
    can be consulted by anyone logged-in

## I - 4 Chat

-   Users must be able to create channels public/private or protected by a password
-   Users must be able to send direct messages to other user
-   Users must be able to block other user and therefore they will not see their messages
    anymore
-   A user that create a new channel is automatically its owner until he leaves the
    channel - owner of a channel can add/change/remove a password to access to the channel - owner can select user to be administrator and is also administrator of the
    channel - administrator can ban or mute users for a certain amount of time
-   Through the chat interface users should be able to ask other player to do a Pong
    match
-   Through the chat interface users must be able to see other players profiles


## I - 5 Game

- The main purpose of this website is to play pong against other players and show everyone
how good you are!
- Therefor we should be able to play pong directly on the website and live against an
other player. It can be in a canvas or it can be with 3d effects, it can be ugly but it must be a pong
like the one from 1972.
- If you want to, you can add power ups, different maps etc... but user must be able to
play a default pong game without any added stuff.
- The game must be responsive!
- Other users can watch the game live without interfering in it.