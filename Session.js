const Bloggify = require("bloggify");

class Session {
    static isAuthenticated (lien) {
        return Session.getUser(lien);
    }
    static getUser (lien) {
        return lien.getSessionData("user");
    }
    static isAdmin (user) {
        if (!user.username) {
            user = Session.getUser(user);
        }
        return !!(user && (user.role === "admin" || user.username === process.env.ADMIN_USERNAME));
    }
    static loginUser (user, lien) {
        lien.setSessionData({
            user: user.toObject()
        });
        const returnTo = lien.getSessionData("return_to");
        if (returnTo) {
            return lien.redirect(returnTo);
        }
        lien.redirect("/");
    }
};

Bloggify.controllers = Bloggify.controllers || {};
Bloggify.controllers.Session = Session;

module.exports = Session;
