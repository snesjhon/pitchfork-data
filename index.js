//https://medium.com/journocoders/nightmarishly-good-scraping-with-nightmare-js-and-async-await-b7b20a38438f
// https://stackoverflow.com/questions/34596811/dynamic-paging-with-nightmare-electron-page-scrape

const Nightmare = require("nightmare");
const cheerio = require("cheerio");

const nightmare = Nightmare({ show: true });
const url =
  "https://pitchfork.com/features/lists-and-guides/the-50-best-albums-of-2017/";

// We need to get a list of URLs that our nightmare instance will be hitting. And for each of
// these items we'll be iterating and then getting information from.

// nightmare.goto(url).wait(body).evaluate(()=>document.querySelector('body').innerHTML)
// .end()
// .then()

const startNightmare = url =>
  nightmare
    .goto(url)
    .wait("body")
    .evaluate(() => document.querySelector("body").innerHTML)
    .end();

const getPage = html => {
  let data = [];
  const $ = cheerio.load(html);
  $(".blocks-area.landing > .list-blurb.blurb-container > .row > .inner").each(
    (i, elm) => {
      data.push({
        artist: $(elm)
          .find(".artist-list.list-blurb__artists")
          .text(),
        album_title: $(elm)
          .find(".list-blurb__work-title")
          .text(),
        album_art: $(elm)
          .find(".list-blurb__artwork img")
          .attr("src")
        // blur: $(elm)
        //   .find(".blurb > .blurb-text")
        //   .text()
      });
    }
  );

  return data;
};

const getPagination = html => {
  const pagination = [];
  const $ = cheerio.load(html);
  $(".fts-pagination__list > li").each((e, elm) => {
    if ($(elm).hasClass("fts-pagination__list-item--active")) {
      return;
    } else {
      pagination.push(
        $(elm)
          .find(".fts-pagination__list-item__link")
          .attr("href")
      );
    }
  });
  return pagination;
};

// var urls = ['http://example1.com', 'http://example2.com', 'http://example3.com'];
// urls.reduce(function(accumulator, url) {
//   return accumulator.then(function(results) {
//     return nightmare.goto(url)
//       .wait('body')
//       .title()
//       .then(function(result){
//         results.push(result);
//         return results;
//       });
//   });
// }, Promise.resolve([])).then(function(results){
//     console.dir(results);
// });

let data = [];
nightmare
  .goto(url)
  .wait("body")
  .evaluate(() => document.querySelector("body").innerHTML)
  .end()
  .then(res => {
    data.push(getPage(res));
    const restofPages = getPagination(res);
    // console.log(restofPages);
    console.log(restofPages);
    return restofPages
      .reduce(function(accumulator, pgres) {
        return accumulator.then(function(results) {
          return nightmare
            .goto(pgres)
            .wait("body")
            .evaluate(() => document.querySelector("body").innerHTML)
            .title()
            .then(function(result) {
              results.push(result);
              return results;
            });
        });
      }, Promise.resolve([]))
      .then(function(results) {
        console.dir(results);
      });
    // return restofPages;
    // // return restofPages.forEach(url => {
    // //   startNightmare(`https://pitchfork.com${url}`).then(pgres => {
    // //     console.log(pgres);
    // //     data.push(getPage(pgres));
    // //   });
    // // });
  });
// .then(pages => {

// });
console.log(data);

// console.log(restofPages);

// return restofPages.forEach(url => {
//   return startNightmare(`https://pitchfork.com${url}`).then(pgres => {
//     data.push(getPage(pgres));
//     console.log(data);
//   });
// });

// console.log(data);

// return data;
// console.log(pitchforkData);

// console.log("jhon");

// Request making using nightmare
// nightmare
//   .goto(url)
//   .wait("body")
//   .evaluate(() => document.querySelector("body").innerHTML)
//   .end()
//   .then(response => {
//     console.log(getArtistName(response));
//   })
//   .catch(err => {
//     console.log(err);
//   });

// let getArtistName = html => {
//   data = [];
//   const $ = cheerio.load(html);
//   $(".blocks-area.landing > .list-blurb.blurb-container > .row > .inner").each(
//     (i, elm) => {
//       // const artistList = $(elm).find('.artist-list.list-blurb__artists');

//       // artistList.each((i, artist) => {

//       // })

//       data.push({
//         artist: $(elm)
//           .find(".artist-list.list-blurb__artists")
//           .text(),
//         album_title: $(elm)
//           .find(".list-blurb__work-title")
//           .text(),
//         album_art: $(elm)
//           .find(".list-blurb__artwork img")
//           .attr("src")
//         // blur: $(elm)
//         //   .find(".blurb > .blurb-text")
//         //   .text()
//       });
//     }
//   );

//   return data;
// };

// Parsing data using cheerio
// let getData = html => {
//   data = [];
//   const $ = cheerio.load(html);
//   // console.log("jhon");
//   $(".blocks-area.landing > .list-blurb.blurb-container > .row > .inner").each(
//     (i, elem) => {
//       $(elem).each((i, el) => {
//         console.log(el);
//       });

//       data.push("jhon");
//       // data.push({
//       //   title : $(elem).text(),
//       //   link : $(elem).find('a.storylink').attr('href')
//       // });
//     }
//   );
//   return data;
// };

// // import jp from "./main";

// const jhon = require("./main");
// // debugger;
// console.log("hellodasdasasddddserrdasds");
// console.log(jhon());
// // console.log('object');
