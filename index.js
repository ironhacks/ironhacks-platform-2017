module.exports = (lien, cb) => {
    cb(null, {
        title: "Home"
      , user: lien.getSessionData("user")
    });
};
