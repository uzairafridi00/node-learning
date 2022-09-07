# Auth In MERN

## NOTE

1. Create `.env` file and add Your DB information in it.
2. If someone find your PRIVATE KEY they can easily logged in without Authentication

```js
DB = "PAST YOUR URL HERE";
JWT_PRIVATE_KEY = "YOUR PRIVATE KEY HERE";
SALT = 10;
```

## SERVER

1. mkdir server -> cd server and install `npm i --save express mongoose dotenv nodemon cors`
2. `In package.json` file under the scripts write `"start": "nodemon index.js"`
3. Now for creating model we need to install some more packages i.e `npm i --save jsonwebtoken joi joi-password-complexity`
4. Now we will use a module which will be use to HASH our passwords `npm i --save bcrypt`

## CLIENT

1. Now make client react app `npx create-react-app client`.
2. Now install these libraries `npm i --save axios react-router-dom`
