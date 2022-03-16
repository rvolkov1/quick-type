const express = require('express');
const fsp = require('fs').promises;
const fs = require('fs');
const ejs = require('ejs');
const path = require("path");
const axios = require("axios");
const port = 8080;
const hamlet = "/texts/books/hamlet.txt";

const reutersScraper = require("./modules/get_reuters_articles.js");


/*
async function parseText(file) {
  const text = [];
  await fs.createReadStream(__dirname + file, 'utf8').on('data', (chunk) => {
    let words = chunk.split(/\s+/g);
    for (let i = 0; i < words.length - 1; i++) {
      text.push(words[i] + " ");
    }
    // add last element
    text.push(words[words.length-1])
    console.log("at push :" + text)
  });
  console.log("return :" + text)
  return text
}
*/

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
  //const apiText = await apiCall("https://www.folgerdigitaltexts.org/JC/monologue/");

  // doesn't work if name is splitText. Wierd
  //const split_text = splitText(apiText)
  //const split_text = await readFile(hamlet)
  //console.log("split text: " + split_text)

  const text = await reutersScraper.getArticleText();
  const split_text = splitText(text);
  console.log(split_text);

  res.render("index.ejs", {text: split_text});
});

app.listen(port, () => {
  console.log("server running on: " + port);
});
