const express = require('express');
const router = require('./articles');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('articles'));

app.use('/', router);

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
