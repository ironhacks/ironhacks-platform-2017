const Bloggify = require("bloggify")
    , slug = require("slug")
    , User = require("./User")
    , deffy = require("deffy")
    ;

class Comment {
    static create (data, cb) {
        data.body = deffy(data.body, "").trim();
        data.votes = [];
        if (!data.body.length) {
            return cb(new Error("Comment cannot be empty."));
        }
        return new Comment.model(data).save(cb);
    }
    static get (filters, cb) {
        return Comment.model.findOne(filters, cb);
    }
    static query (opts, cb) {
        opts = opts || {};
        let topics = [];
        return Comment.model.find(opts.filters, opts.fields).sort({
            created_at: 1
        }).exec(cb);
    }
};

Comment.model = Bloggify.models.Comment
Comment.model.addHook("pre", "save", function (next) {
    this.wasNew = this.isNew;
    next();
});

Comment.model.addHook("post", "save", function (next) {
    if (this.wasNew) {
        Bloggify.emit("comment:created", this);
    }
    next();
});

module.exports = Comment;
