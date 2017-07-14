const Bloggify = require("bloggify")
    , csv = require("./api")
    , moment = require("moment")
    , Session = require("../../controllers/Session")
    ;

const DATE_FORMAT = "YYYY-MM-DD-hh-mm";

exports.init = () => {
    // Download topics
    Bloggify.server.addPage("/admin/csv/topics", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }
        lien.header({
            "Content-Disposition": `attachment; filename=${moment().format(DATE_FORMAT)}-topics.csv`,
            "Content-Type": "text/csv"
        });
        csv.topics().pipe(lien.res);
    });

    // Download scores
    Bloggify.server.addPage("/admin/csv/scores", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }
        lien.header({
            "Content-Disposition": `attachment; filename=${moment().format(DATE_FORMAT)}-scores.csv`,
            "Content-Type": "text/csv"
        });
        csv.scores().pipe(lien.res);
    });

    // Download scores
    Bloggify.server.addPage("/admin/csv/export-users", lien => {
        if (!Session.isAdmin(lien)) {
            return lien.redirect("/");
        }

        const hackType = lien.query.hackType
            , hackId = lien.query.hackId
            ;

        lien.header({
            "Content-Disposition": `attachment; filename=users-${moment().format(DATE_FORMAT)}${hackType ? "-" + hackType : ""}${hackId ? "-" + hackId : hackId}.csv`,
            "Content-Type": "text/csv"
        });

        csv.users({
            hackType: hackType
          , hackId: +hackId
        }, lien.query.exportType).pipe(lien.res);
    });
};
