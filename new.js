const User = require("./User");
const Session = require("./Session");
const Topic = require("./Topic");
const HackTypes = require("./HackTypes");
const mapO = require("map-o");

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.data = {
        body: "",
        title: ""
    };

    const hackTypes = mapO(HackTypes, val => {
        return {
            subforums: val.subforums_count
        };
    }, true);

    cb(null, {
        hack_types: hackTypes
    });
};

exports.post = (lien, cb) => {
    const user = Session.isAuthenticated(lien);
    if (!user) {
        return lien.redirect("/");
    }

    lien.data.author = user._id;
    lien.data.created_at = new Date();
    lien.data.votes = [];

    let hackTypeSlug = user.profile.hack_type
      , hackId = user.profile.hack_id
      ;

    if (Session.isAdmin(user)) {
        if (lien.data.hackId) {
            hackId = lien.data.hackId;
        }
        if (lien.data.hack_type) {
            hackTypeSlug = lien.data.hack_type;
        }
    } else {
        delete lien.data.sticky;
    }

    lien.data.metadata = {
        hack_type: hackTypeSlug,
        hack_id: +hackId
    };

    User.createTopic(lien.data, (err, topic) => {
        if (err) {
            return cb(null, {
                err: err
              , post_data: lien.data
            });
        }
        lien.redirect(Topic.getUrl(topic));
    });
};
