const Bloggify = require("bloggify");

class Stats {
    static record (data, cb) {
        data.created_at = new Date();
        return Stats.model(data).save(cb);
    }
};

Stats.model = Bloggify.models.Stats;
module.exports = Stats;
