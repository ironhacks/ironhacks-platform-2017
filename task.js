const Session = require("./Session");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    cb();
};
