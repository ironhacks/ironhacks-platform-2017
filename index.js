const Topic = require("../../Topic");
const Session = require("../../Session");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        lien.setSessionData({
            return_to: lien.pathname
        });
        return lien.redirect("/login");
    }

    const filters = {
        _id: lien.params.topicId
    };

    if (!Session.isAdmin(user)) {
        filters["metadata.hack_type"] = user.profile.hack_type;
        filters["metadata.hack_id"] = user.profile.hack_id;
    }

    Topic.get(filters, (err, topic) => {
       if (err && err.name === "CastError") {
           err = null;
           topic = null;
       }
       if (!topic) {
            return lien.next();
       }
       if (topic.slug !== lien.params.slug) {
           return lien.redirect(Topic.getUrl(topic));
       }
       Topic.populate(topic.toObject()).then(topic => {
           cb(null, {
               topic: topic
           });
       }).catch(e => cb(e));
   });
};
