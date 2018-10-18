var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');
var cheerio = require('cheerio');

var models = require('./models');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(express.static('public'));

let databaseUri = "mongodb://localhost/scrape-scrape-news";

if (process.env.MONGODB_URI) {
  mongoose.connect(
    process.env.MONGODB_URI
  );
} else {
  mongoose.connect(
    databaseUri
  );
};

var db = mongoose.connection;

db.on('error', function (err) {
    console.log(`Mongoose Error: ${err}`);
});

db.once('open', function() {
    console.log('Mongoose connection successful');
});

// app.get("/",function(req,res){
//     res.sendFile("index.html");
// });

app.get(`/scrape`, function(req, res) {
  let scrapeUrl = `https://www.npr.org/`;

  axios.get(scrapeUrl).then(function(response) {
    var $ = cheerio.load(response.data);

    $(`div.story-text`).each(function(i, element) {
      //  console.log($(element).children('a').find("p.teaser").text());
      var result = {};

      result.title = $(element)
        .children('a')
        .find('h3')
        .text();
      result.summary = $(element)
        .children('a')
        .find('p.teaser')
        .text();
      result.link = $(element)
        .children('a')
        .attr('href');

      console.log(result);

      models.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    res.send('Scrape Complete');
  });
});

app.get('/articles', function(req, res) {
  models.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get('/articles/:id', function(req, res) {
  models.Article.findOne({
    _id: req.params.id
  })
    .populate('note')
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post('/articles/:id', function(req, res) {
  models.Note.create(req.body)
    .then(function(dbNote) {
      console.log('HIT 1')
      console.log(dbNote);
      return db.Article.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          note: dbNote._id
        },
        {
          new: true
        }
      )
    })
    .then(function(dbArticle) {
      console.log('HIT 2');
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log(`http://localhost:${PORT}`);
});
