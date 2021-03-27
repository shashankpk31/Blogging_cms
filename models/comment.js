var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {type: Date, default: Date.now}
},
{
  timestamps: true
});

module.exports =  mongoose.model("Comment", commentSchema);