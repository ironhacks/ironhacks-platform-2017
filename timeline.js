const Session = require("./Session");
const HackTypes = require("./HackTypes");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    cb(null, {
        user: user,
        hackType: HackTypes[user.profile.hack_type]
    });
};
