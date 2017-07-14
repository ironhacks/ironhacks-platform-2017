const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

const getTopic = require("./index");

exports.get = (lien, cb) => {
    const user = Session.isAuthenticated(lien);
    if (!user) {
        return lien.next();
    }
    getTopic(lien, (err, data) => {
        if (err) { return cb(err); }
        if (data.topic.author._id.toString() === user._id || Session.isAdmin(user)) {
            return cb(null, data);
        }
        lien.next();
    });
};

exports.post = (lien, cb) => {
   const user = Session.getUser(lien);
   if (!user) { return lien.next(); }
   const filters = {
      _id: lien.params.topicId
   };

   if (!Session.isAdmin(user)) {
        filters.author = user._id;
        delete lien.data.sticky;
   } else {
        lien.data.sticky = !!lien.data.sticky;
   }

   Topic.update(filters, lien.data, (err, topic) => {
       if (err) {
           return cb(null, {
               err: err
             , topic: lien.data
           });
       }
       lien.redirect(Topic.getUrl(topic));
   });
};
