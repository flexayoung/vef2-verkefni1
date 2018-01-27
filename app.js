const express = require('express');
//Exportum router fyrir articles.js
const router = require('./articles');


const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/grein', router);

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



//const articles = require("./articles");

//


// const marked = require('marked');
// const fs = require('fs');
// const fm = require('front-matter');
