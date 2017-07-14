const Bloggify = require("bloggify")
    , forEach = require("iterate-object")
    , Settings = require("./Settings")
    , User = require("./User")
    , schedule = require("node-schedule")
    ;

const HACK_TYPES = {
    // Gold
    purdue: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_brTBahMpVU9CFYV"
      , label: "Purdue"
      , hackatons: [ {} ]
      , start_date: null
      , subforums_count: 0
    }

    // Black
  , bogota: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_2b1fTpmPhtyMRAV"
      , label: "Bogota"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
      , subforums_count: 0
    }

    // Green
  , platzi: {
        survey: "https://purdue.qualtrics.com/jfe/form/SV_4ZoALAMqPjrTUlT"
      , label: "Platzi"
      , hackatons: [ {}, {}, {} ]
      , start_date: null
      , subforums_count: 0
    }
};

forEach(HACK_TYPES, (c, name) => {
    c.name = name;
});

const assignHackIdsToUsers = hType => {
    const usersCursor = User.model.find({
        "profile.hack_id": null,
        "profile.hack_type": hType.name
    }).cursor();

    usersCursor.on("data", cDoc => {
        usersCursor.pause();
        hType.getHackId(uHackId => {
            User.update({
                _id: cDoc._id
            }, {
                profile: {
                    hack_id: uHackId
                }
            }, (err, data) => {
                if (err) { Bloggify.log(err); }
                usersCursor.resume();
            });
        });
    });

    usersCursor.on("error", err => {
        Bloggify.log(err);
    });

    usersCursor.on("end", cDoc => {
        Bloggify.log(`Grouped the studends from ${hType.name}.`);
    });
};

const update = cb => {
    Settings.get((err, doc) => {
        if (err) {
            return Bloggify.log(err);
        }
        if (!err && !doc) {
            Bloggify.log("Settings not found. Trying again in a second.");
            return setTimeout(update, 1000);
        }
        forEach(doc.settings.hack_types, (hType, name) => {
            let thisHackType = HACK_TYPES[name];
            thisHackType.start_date = hType.start_date;
            thisHackType.hack_start_date = hType.hack_start_date;
            thisHackType.next_phase_date = hType.next_phase_date;
            thisHackType.subforums_count = hType.subforums_count;
            if (new Date() > thisHackType.start_date) {
                if (thisHackType.startSchedule) {
                    thisHackType.startSchedule.cancel();
                }
                assignHackIdsToUsers(thisHackType);
            } else {
                setScheduleForHackType(thisHackType);
            }
        });
    });
    cb && cb();
};

const setScheduleForHackType = name => {
    if (name.name) {
        name = name.name;
    }

    let hackTypeObj = HACK_TYPES[name];
    if (hackTypeObj.startSchedule) {
        hackTypeObj.startSchedule.cancel();
    }

    hackTypeObj.startSchedule = schedule.scheduleJob(hackTypeObj.start_date, () => {
        assignHackIdsToUsers(hackTypeObj);
    });
};

Settings.model.addHook("post", "save", update);
update();

function generateGetHackId(hType, name) {
    return cb => {
        User.model.aggregate([{
            $match: {
                "profile.hack_id": { $ne: null },
                "profile.hack_type": name
            }
        }, {
            $group: {
                _id: "$profile.hack_id",
                total: { $sum: 1 }
            }
        }], (err, docs) => {
            if (err) { return cb(0); }
            const ids = Array(hType.subforums_count + 1).fill(0);
            docs.forEach(c => {
                ids[c._id] = c.total;
            });
            let minId = 0;
            let min = ids[minId];
            ids.forEach((count, index) => {
                if (count < min) {
                    minId = index;
                    min = ids[minId];
                }
            });
            cb(minId);
        });
    };
}

forEach(HACK_TYPES, (c, name) => {
    c.getHackId = generateGetHackId(c, name);
});

module.exports = HACK_TYPES;
