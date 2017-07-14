const Bloggify = require("bloggify")
    , Session = require("./Session")
    , User = require("./User")
    , findValue = require("find-value")
    ;

// Define the quizzes list
const quizzes = [
    ["HTML & CSS", "https://purdue.qualtrics.com/jfe/form/SV_do6Sc9VJsAMmOih", "html_css"]
  , ["JavaScript & jQuery", "https://purdue.qualtrics.com/jfe/form/SV_b8zyxX8wozQfNul", "javascript_jquery"]
  , ["d3.js", "https://purdue.qualtrics.com/jfe/form/SV_71xEzp5vQ7rC817", "d3"]
];

// Map the quizzes labels to the data
const validQuizzes = {};
quizzes.forEach(c => {
    validQuizzes[c[2]] = c;
});

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) { return lien.redirect("/"); }

    // Set the quiz complete
    const completed = lien.query.markComplete;
    if (completed && validQuizzes[completed]) {
        return User.update({
            _id: user._id
        }, {
            profile: {
                surveys: {
                    [completed]: {
                        ended_at: new Date()
                    }
                }
            }
        }, (err, _user) => {
            lien.redirect("/quizzes");
        })
    }

    // Generate the redirect links
    const completedSurveys = findValue(user, "profile.surveys") || {};
    const userQuizzes = quizzes.map(c => {
        const redirectTo =  encodeURIComponent(`${Bloggify.options.metadata.domain}/quizzes?markComplete=${c[2]}`);
        return {
            label: c[0]
          , url: `${c[1]}?redirect_to=${redirectTo}&user_email=${user.email}&user_id=${user._id}`
          , is_complete: !!completedSurveys[c[2]]
        };
    });

    // Send the quizzes array to the view
    cb(null, {
        quizzes: userQuizzes
    });
};
