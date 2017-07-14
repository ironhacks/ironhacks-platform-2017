const User = require("./User");
const Session = require("./Session");
const qs = require("querystring");
const HACK_TYPES = require("./HackTypes");
const Bloggify = require("bloggify");

const HACK_TYPE_OPTIONS = Object.keys(HACK_TYPES).map(c => {
    let hType = HACK_TYPES[c];
    return {
        value: c
      , label: hType.label
      , survey: hType.survey
    };
});

exports.get = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }

    const user = lien.getSessionData("new_user");
    if (user) {
        const userId = user.password;
        const qsuid = lien.query.uid;

        if (userId === qsuid) {
            const hType = HACK_TYPES[user.profile.hack_types];
            return User.create(user, (err, newUser) => {
                if (err) { return lien.redirect("/"); }
                Bloggify.emit("user:registered", newUser);
                lien.setSessionData({
                    new_user: null
                  , surveyLink: null
                });
                Session.loginUser(newUser, lien);
            });
        }

        const surveyLink = lien.getSessionData("surveyLink");
        if (user.username && surveyLink) {
            const redirectTo =  `${Bloggify.options.metadata.domain}/register?uid=${user.password}`;
            if (process.argv.includes("--bypass-survey")) {
                return lien.redirect(redirectTo);
            }
            const qsParams = qs.stringify({
                redirect_to: redirectTo
              , user_email: user.email
              , user_id: user._id
            });

            lien.redirect(
                `${surveyLink}?${qsParams}`
            );
            return;
        }
    }

    cb(null, {
        hTypeOptions: HACK_TYPE_OPTIONS
    });
};

exports.post = (lien, cb) => {
    if (Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }

    const user = lien.getSessionData("new_user");

    let hackType = lien.data.hack_type;
    if (!hackType) {
        return cb(null, {
            err: "Please select an option."
          , hTypeOptions: HACK_TYPE_OPTIONS
        });
    }

    let selectedHackType = HACK_TYPES[hackType];
    if (!selectedHackType) {
        return cb(null, {
            err: "Please select a valid option."
          , hTypeOptions: HACK_TYPE_OPTIONS
        });
    }


    let surveyLink = selectedHackType.survey;
    lien.setSessionData({
        new_user: {
            profile: {
                hack_type: hackType
            }
        }
      , surveyLink: surveyLink
    });

    lien.redirect("/login");
};
