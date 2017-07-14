const User = require("./User");
const Session = require("./Session");

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    cb();
};

exports.post = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    lien.destroySession();
    lien.redirect("/");
};
