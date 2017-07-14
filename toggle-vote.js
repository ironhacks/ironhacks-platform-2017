const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.get = lien => {
    lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
};

exports.post = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) { return lien.next(); }
    Topic.toggleVote({
        user: user,
        topic: lien.params.topicId
    }, err => {
        if (err) {
            return cb(null, {
                err: err
            });
        }
        lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
    });
};
