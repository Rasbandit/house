require('dotenv').config();

const express = require('express'),
  massive = require('massive'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  port = 7000;

const main = require('./controllers/main');

console.log(process.env.NODE_ENV);

const app = express();

app.use(express.static(`${__dirname}./../build`));

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

massive(process.env.CONNECTION_STRING).then(db => {
  app.set('db', db);
  app.listen(port, () => {
    console.log(`Ship docked at port: ${port}`);
  });
});

app.post('/api/auth/login', main.login);
app.post('/api/auth/register', main.register);
app.post('/api/favorites/:id', main.favorite);
app.post('/api/create', main.addHouse);

app.put('/update', main.updateHouse);

app.get('/api/favoritesid', main.getFavoritesId);
app.get('/api/properties', main.getAllHouses);
app.get('/house/:id', main.getHouse);
app.get('/listed', main.getListed);

app.delete('/api/favorites/:id', main.unfavorite);
app.delete('/listing/:id', main.delete);
app.delete('/logout', main.logout);
