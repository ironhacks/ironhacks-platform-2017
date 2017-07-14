const Session = require("./Session")
    , Topic = require("./Topic")
    , Comment = require("./Comment")
    ;

module.exports = (lien, cb) => {

    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }

    const isAdmin = Session.isAdmin(user);

    // Perform the search query
    if (lien.query.search) {

        // Use the $text index to search
        const filters = {
            $text: {
                $search: lien.query.search
            }
        };
        let results = {};

        // Search in the topics and comments
        Promise.all([
            Topic.model.find(filters)
          , Comment.model.find(filters)
        ]).then(data => {
            results.topics = data[0];
            results.comments = data[1].map(c => c.toObject());
            return Promise.all(results.comments.map(cComment => {
                return Topic.model.findOne({ _id: cComment.topic });
            }));
        }).then(topics => {
            let uniqueTopics = {};
            results.topics.concat(topics).forEach(c => {
                if (!c) { return; }

                // Let the admin see all the posts/comments in all the forums
                if (!isAdmin) {
                    if (c.metadata.hack_type !== user.profile.hack_type ||
                        c.metadata.hack_id !== user.profile.hack_id) {
                        return;
                    }
                }
                uniqueTopics[c._id] = c;
                c.url = Topic.getUrl(c);
            });

            cb(null, { results: Object.keys(uniqueTopics).map(k => uniqueTopics[k]) });
        }).catch(e => {
            cb(e);
        });
    } else {
        cb();
    }
};
