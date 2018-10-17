const mongoose = require(`mongoose`);

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    headline: {
        type: String,
        unique: true,
        required: true
    },
    summary: {
        type: String,
        unique: true,
        required: true
    } ,
    url: {
        type: String,
        unique: true,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: `Note`
    }
}); 

var article = mongoose.model(`Article`, articleSchema);

module.exports = article;