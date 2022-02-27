const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();

// TEMPLATE ENGINES
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));

//ROUTE
app.get('/', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index');
});

app.get('/about', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('about');
});

app.get('/add', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('add');
});

const port = 3000;

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
