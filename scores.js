const Session = require("./Session");
const User = require("./User");
const Settings = require("./Settings");

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }
    User.model.find({
        "profile.hack_type": user.profile.hack_type,
        "profile.hack_id": user.profile.hack_id
    }, (err, users) => {
        if (err) { return cb(err); }
        Settings.get((err, options) => {
            if (err) { return cb(err); }
            const phase = options.settings.hack_types[user.profile.hack_type].phase;
            users = users.map((u, i) => {
                u = u.toObject();
                u.username = `Hacker ${i + 1}`;
                const phaseObj = Object(u.profile[phase]);
                return {
                    _id: u._id,
                    username: u.username,
                    score_technical: phaseObj.score_technical,
                    score_info_viz: phaseObj.score_info_viz,
                    score_novelty: phaseObj.score_novelty,
                    score_total: phaseObj.score_total,
                    project_url: phaseObj.project_url,
                    github_repo_url: phaseObj.github_repo_url,
                    phase: phase
                };
            });

            shuffle(users);

            cb(null, {
                users: users,
                phase: phase
            });
        });
    });
};
