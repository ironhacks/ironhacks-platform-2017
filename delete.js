const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.post = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.next();
    }

    const filters = {
        _id: lien.params.topicId
    };

    if (!Session.isAdmin(user)) {
         filters.author = user._id;
    }

    Topic.remove(filters, (err, count) => {
        if (err) { return lien.apiError(err); }
        lien.redirect("/");
    })
};
