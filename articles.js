/* útfæra greina virkni */
const express = require('express');
const fs = require('fs');
const fm = require('front-matter');
const marked = require('marked');
const util = require('util');
const dateFormat = require('dateformat');

const router = express.Router();
const dir = './articles/';
const readDirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

// *** UTILS *** //

function removeFromArray(element, array) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

function sortArrayByDate(arr) {
  arr.sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date));
  return arr;
}

function formatDates(articles) {
  const formattedArticles = articles;
  for (let i = 0; i < formattedArticles.length; i += 1) {
    formattedArticles[i].attributes.date = dateFormat(formattedArticles[i].attributes.date, 'dd.mm.yyyy');
  }
  return formattedArticles;
}

function getArticleFromSlug(slug, arr, next) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].attributes.slug === slug) {
      return arr[i];
    }
  }
  next();
  return undefined;
}

function getTitleAndMarkdown(article) {
  if (article) {
    return [article.attributes.title, marked(article.body)];
  }
  return undefined;
}

/* ASYNC FUNCTIONS */

async function getFiles(dirName) {
  const files = await readDirAsync(dirName);
  removeFromArray('img', files);
  return files;
}

async function getArticles(files) {
  const articles = files.map(async (f) => {
    const data = await readFileAsync(dir + f, 'utf8');
    const article = fm(data);
    return article;
  });
  return Promise.all(articles);
}

async function getContent() {
  const files = await getFiles(dir);
  const articles = await getArticles(files);
  return articles;
}

// *** ROUTE HANDLERS *** //

router.get('/', (req, res) => {
  getContent()
    .then(data => sortArrayByDate(data))
    .then(data => formatDates(data))
    .then(data => res.render('pages/index', { title: 'Greinasafnið', data }))
    .catch(err => console.error(err));
});

router.get('/:slug', (req, res, next) => {
  if (req.params.slug !== 'favicon.ico') {
    getContent()
      .then(data => getArticleFromSlug(req.params.slug, data, next))
      .then(data => getTitleAndMarkdown(data))
      .then((data) => {
        if (data) res.render('pages/article', { title: data[0], data: data[1] });
      })
      .catch(err => console.error(err));
  }
});

// ** ERROR HANDLERS ** \\

router.use((req, res) => {
  res.status(400);
  res.render('pages/errorpage', { title: 'Fannst ekki', data: 'Ó nei, síðan fannst ekki' });
});

// Handle 500
router.use((error, req, res) => {
  res.status(500);
  res.render('pages, errorpage', { title: 'Villa kom upp', data: '' });
});

module.exports = router;
