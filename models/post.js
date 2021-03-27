var mongoose = require("mongoose"),
  Comment = require("./comment");

const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

var postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    created: { type: Date, default: Date.now },
    Bookmark: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("validate", function (next) {
  if (this.content) {
    const data = dompurify.sanitize(marked(this.content));
    this.content = data;
  }

  next();
});

module.exports = mongoose.model("post", postSchema);
