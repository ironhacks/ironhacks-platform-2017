const User = require("./User");
const Session = require("./Session");

exports.get = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.data = {
        email: "",
        password: ""
    };
    cb();
};

exports.post = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    User.auth(lien.data, (err, user) => {
        if (err) {
            return cb(null, {
                error: err
            });
        }
        lien.startSession({
            user: user
        });
        lien.redirect("/");
    });
};
