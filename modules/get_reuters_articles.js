const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const url = "https://www.reuters.com";

const articles = [];

const data = async (url) => {
  let data;

  await axios.get(url)
    .then(response => {
      data = response.data;
    });
  return data;
}

exports.getArticleText = async () => {
  let $ = cheerio.load(await data(url));

  $('a').each((index, tag) => {
    const link = $(tag).attr('href');
    const date = link.substring(link.length-11, link.length-1)

    if (date.match(/\d{4}-\d{2}-\d{2}/)) {
      articles.push(url + link);
    }
  });

  //$ = cheerio.load(await data(articles[0]));
  $ = cheerio.load(await data("https://www.reuters.com/world/china/buttressing-greenland-bailout-chinas-distressed-property-sector-2022-03-15/"));

  let text = "";

  $("article").find("p").each((index, p) => {
    if (/caption/.test($(p).attr().class) || /footer/.test($(p).parent().attr().class) || /Our Standards/.test($(p).text())) return;

    text += $(p).text();
  });

  return text
}
