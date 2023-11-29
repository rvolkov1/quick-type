const express = require('express');
const fsp = require('fs').promises;
const fs = require('fs');
const ejs = require('ejs');
const path = require("path");
const axios = require("axios");
const reutersScraper = require("./modules/get_reuters_articles.js");
const csvParser = require("csv-parser");
const { execPath } = require('process');

const port = 8080;
const hamlet = "/texts/books/hamlet.txt";
const lorem5 = '/texts/books/lorem5.txt';

const reutersArticles = async () => {
  return await reutersScraper.getFrontPageArticles();
};

const readFile = (file) => new Promise((resolve, reject) => {
  const text = [];
  fs.createReadStream(__dirname + file, 'utf8')
    .on('data', (chunk) => {
      let words = chunk.split(/\s+/g);
      for (let i = 0; i < words.length - 1; i++) {
        text.push(words[i] + " ");
      }
      // add last element
      text.push(words[words.length-1])
    })
    .on('end', () => {
      resolve(text)
    })
})

const readCsv = file => new Promise((resolve, reject) => {
    const result = [];
    fs.createReadStream(file)
        .pipe(csvParser())
        .on("data", (data) => {
            result.push(data);
        })
        .on("end", () => {
            for (let i = result.length - 1 ; i >= 0; i--) {
                result[i] = splitText(result[i]["quote"])
                if (result[i.length > 10]) {
                    result.splice(i, 1);
                }
            }
            resolve(result[Math.floor(Math.random() * result.length)]);
        });
})

function splitText(text) {
  const splitText = [];
  let words = text.split(/\s+/g);

  for (let i = 0; i < words.length - 1; i++) {
    splitText.push(words[i] + " ")
  }
  // add last element
  splitText.push(words[words.length-1])
  return splitText;
}

function apiCall(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(
        (response) => {
          resolve(response.data);
      },
        (error) => {
          reject(erorr);
        }
    );
  })
}

const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'client/views'));
app.use(express.static(__dirname + '/client'));

app.get('/', async (req, res) => {
  //const split_text = await readFile(lorem5)

  /*
  const articles = await reutersArticles();
  const articleIndex = Math.floor(Math.random() * articles.length);
  const text = await reutersScraper.getArticleText(articles[articleIndex]);
  const split_text = splitText(text);
  */
  const split_text = await readCsv("texts/quotes.csv");
  res.render("index.ejs", {text: split_text});
});

app.listen(port, () => {
  console.log("server running on: " + port);
});
