var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    joined: {type: Date, default: Date.now},
    email:{type:String},
    Age:{type:String},
    entity:{type:String},
    image:{type:String},
},
{
  timestamps: true
});

userSchema.plugin(passportLocalMongoose)

module.exports =  mongoose.model("user", userSchema);