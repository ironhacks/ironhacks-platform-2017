const Session = require("./Session");
const User = require("./User");
const Settings = require("./Settings");
const forEach = require("iterate-object");

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);

    if (!user) {
        return lien.redirect("/");
    }

    const dbUser = user;
    if (dbUser.role !== "admin" && dbUser.username !== process.env.ADMIN_USERNAME) {
        return lien.redirect("/");
    }

    if (lien.method === "post") {
        const deleteUserId = lien.data["delete-user-id"];
        if (deleteUserId) {
            User.remove(deleteUserId, err => {
                lien.redirect("/admin");
            });
            return;
        }
        if (!lien.data.hack_types) {
            return lien.redirect("/admin");
        }

        let foundInvalidDate = false;
        forEach(lien.data.hack_types, hType => {
            hType.start_date = new Date(hType.start_date);
            hType.hack_start_date = new Date(hType.hack_start_date);
            hType.next_phase_date = new Date(hType.next_phase_date);
            if (isNaN(hType.start_date) || isNaN(hType.hack_start_date) || isNaN(hType.next_phase_date)) {
                foundInvalidDate = true;
            }
        });

        if (foundInvalidDate) {
            return lien.apiError("Invalid date. Make sure the format is correct.");
        }

        Settings.set({
            hack_types: lien.data.hack_types
        });

        Promise.all(lien.data.users.map(c => {
            const roleValue = c.update.role;
            delete lien.data.role;
            return User.update({
                _id: c._id
            }, {
                role: roleValue,
                profile: {
                    [lien.data.hack_types[c.hack_type].phase]: {
                        "project_url": c.update.project_url
                      , "github_repo_url": c.update.github_repo_url
                      , "score_technical": +c.update.score_technical || 0
                      , "score_info_viz": +c.update.score_info_viz || 0
                      , "score_novelty": +c.update.score_novelty || 0
                      , "score_custom": c.update.score_custom && +c.update.score_custom
                      , "score_total": +c.update.score_total || 0
                    }
                }
            });
        })).then(c => {
            lien.apiMsg({ success: true });
        }).catch(e => {
            lien.apiError(e);
        });
    } else {
        Settings.get((err, options) => {
            if (err) { return cb(err); }
            User.model.find({}, {
                password: 0
            }, (err, users) => {
                if (err) { return cb(err); }
                users = users.map(c => c.toObject());
                cb(null, {
                    users: users
                  , settings: options.settings
                });
            });
        });
    }
};
