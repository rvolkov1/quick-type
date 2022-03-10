const cheerio = require('cheerio');
const axios = require('axios');

const url = "https://thoughtcatalog.com/koty-neelis/2015/06/31-of-the-most-beautiful-and-profound-passages-in-literature-youll-want-to-read-over-and-over-again/";

const data = async (url) => {
  let data;

  await axios.get(url)
    .then(response => {
      data = response.data;
    });
  return data;
}

(async () => {
  const $ = cheerio.load(await data(url));
  const variable = $('h4');
  for (const instance in variable) {
    console.log(cheerio.text($(instance)))
  }
})();
