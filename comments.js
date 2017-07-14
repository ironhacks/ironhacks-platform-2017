const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.get = lien => {
    lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
};

exports.post = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) { return lien.next(); }

    // Delete comment
    if (lien.data.delete_comment_id) {

        const filters = {
            _id: lien.data.delete_comment_id
        }

        if (!Session.isAdmin(user)) {
            filters.author = user._id;
        }

        Topic.deleteComment(filters, (err, data) => {
            if (err) {
                return lien.apiError(err);
            }
            Topic.emitTopicUpdated(lien.params.topicId);
            lien.apiMsg("success");
        });

        return;
    }

    // Update comment
    if (lien.data.update_comment_id) {

        const filters = {
            _id: lien.data.update_comment_id
        }

        if (!Session.isAdmin(user)) {
            filters.author = user._id;
        }

        Topic.updateComment(filters, lien.data.body, (err, data) => {
            if (err) {
                return cb(null, {
                    err: err
                });
            }
            lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
        });

        return;
    }

    // Toggle vote
    if (lien.data.toggleVote) {
        Topic.toggleCommentVote({
            user: user._id,
            comment: lien.data.comment
        }, (err, data) => {
            if (err) {
                return cb(null, {
                    err: err
                });
            }
            cb(null, {});
        });
        return;
    }

    // Post comment
    Topic.postComment({
        author: user._id,
        body: lien.data.body,
        topic: lien.params.topicId
    }, (err, data) => {
        if (err) {
            return cb(null, {
                err: err
            });
        }
        lien.redirect(lien.url.href.split("/").slice(0, -1).join("/"));
    });
};
