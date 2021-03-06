var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

    title: {
        type: String,
        unique: true,
        required: true
    },

    summary: {
        type: String,
        unique: true,
        required: true
    },

    link: {
        type: String,
        unique: true,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
