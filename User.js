"use strict";

const Bloggify = require("bloggify")
    , ul = require("ul")
    , regexEscape = require("regex-escape")
    , deffy = require("deffy")
    ;

class User {

    static getProfileUrl (user) {
        return `/users/${user.username}`;
    }

    static auth (data, cb) {
        User.get(data, (err, user) => {
            if (err) { return cb(err); }
            if (!user) { return cb(new Error("User not found.")); }
            // TODO HASH
            if (user.password !== data.password) {
                cb(new Error("Incorrect password."));
            } else {
                cb(null, user);
            }
        });
    }

    static get (data, cb) {
        if (data.filters) {
            return User.model.findOne(data.filters, data.fields, cb);
        }
        const $or = [];
        if (data.email) {
            $or.push({ email: data.email });
        }
        if (data.username) {
            $or.push({ username: new RegExp("^" + regexEscape(data.username) + "$", "i") });
        }
        return User.model.findOne({
            $or: $or
        }, cb);
    }

    static create (data, cb) {
        User.model.count({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        }, (err, exists) => {
            if (err) { return cb(err); }
            if (exists) {
                return cb(new Error("Email/username is already registered."));
            }

            const HACK_TYPES = require("./HackTypes")
                , now = new Date()
                , hType = HACK_TYPES[data.profile.hack_type]
                , create = () => new User.model(data).save(cb)
                ;

            if (now > hType.start_date) {
                hType.getHackId(id => {
                    data.profile.hack_id = id;
                    create();
                });
            } else {
                data.profile.hack_id = null;
                create();
            }
        });
    }

    static update (filters, data, cb) {
        return User.model.findOne(filters).then(user => {
            if (!user) {
                throw new Error("User not found.");
            }
            let update = ul.deepMerge(data, user.toObject());
            delete update._id;
            user.set(update);
            return user.save(cb);
        });
    }

    static createTopic (data, cb) {
        const Topic = require("./Topic");
        Topic.create(data, cb);
    }

    static remove (userId, cb) {
        userId = deffy(userId, "");
        if (!userId) { return cb(new Error("Invalid user id.")); }

        // Delete user
        User.model.remove({
            _id: userId
        }, err => {
            if (err) { return Bloggify.log(err); }

            // Delete comments
            Bloggify.models.Topic.remove({
                author: userId
            }, err => {
                if (err) { return Bloggify.log(err); }

                // Delete posts
                Bloggify.models.Comment.remove({
                    author: userId
                }, err => {
                    if (err) { return Bloggify.log(err); }
                    cb();
                });
            })
        });
    }
}

User.model = Bloggify.models.User
User.model.addHook("pre", "save", function (next) {
    const phases = ["phase1", "phase2", "phase3", "phase4"];
    phases.forEach(cPhase => {
        const phaseObj = Object(this.profile[cPhase]);
        this.set(`profile.${cPhase}.project_url`, deffy(phaseObj.project_url, ""));
        this.set(`profile.${cPhase}.github_repo_url`, deffy(phaseObj.github_repo_url, ""));
        this.set(`profile.${cPhase}.score_technical`, deffy(phaseObj.score_technical, 0));
        this.set(`profile.${cPhase}.score_info_viz`, deffy(phaseObj.score_info_viz, 0));
        this.set(`profile.${cPhase}.score_novelty`, deffy(phaseObj.score_novelty, 0));
        this.set(`profile.${cPhase}.score_total`, deffy(phaseObj.score_total, 0));
    });
    next();
});

module.exports = User;
