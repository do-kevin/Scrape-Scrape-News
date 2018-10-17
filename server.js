const express = require(`express`);
const logger = require(`morgan`);
const mongoose = require(`mongoose`);
const axios = require(`axios`);
const cheerio = require(`cheerio`);

var PORT = process.env.PORT || 3000;

const db = require(`./models`);

var app = express();

app.use(logger(`dev`));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));

const exphbs = require(`express-handlebars`);

app.engine(`handlebars`, exphbs({defaultLayout: `main`}));
app.set(`view engine`, `handlebars`);

app.get(`/`, function (req, res) {
    res.render(`index`, {layout: false});
});

mongoose.connect(`mongodb://localhost/scrape-scrape-news`, {useNewUrlParser: true});

app.get(`/scrape`, function(req, res) {
    // let scrapeUrl = `http://www.gamasutra.com/`;
    let scrapeUrl = `http://www.echojs.com/`;
    axios.get(scrapeUrl).then(function(response) {
        const $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
        // $(`story_title`).each(function() {
            let result = {};

            result.headline = $(this)
                .children(`a`)
                .text();
            result.url = $(this)
                .children(`a`)
                .attr(`href`)

        db.article.create(result)
            .then(function(articleDb) {
                console.log(articleDb);
            }).catch(function(err) {
                returnes.json(err);
            });
        });
        res.send(`Scrape successful`);
    });
});

app.get(`/articles`, function(req, res) {
    db.article.find({})
        .then(function(articleDb) {
            res.json(articleDb);
        }).catch(function(err) {
            res.json(err);
        });
});

app.get(`/articles/:id`, function(req, res) {
    db.article.findOne({_id:req.params.id})
        .populate(`note`)
        .then(function (articleDb) {
            res.json(articleDb);
        }).catch(function(err) {
            res.json(err);
        });
});

app.post(`/articles/:id`, function(req, res) {
    db.note.create(req.body)
        .then(function(noteDb) {
            return db.article.findOneAndUpdate(
                { _id: req.params.id },
                { note: noteDb._id },
                { new: true }
            );
        }).then(function(articleDb) {
            res.json(articleDb);
        }).catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log(`http://localhost:${PORT}`);
});

