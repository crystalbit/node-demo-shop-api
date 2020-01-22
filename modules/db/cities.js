const models = require("./db-models");

module.exports = {
    select: async function () {
        return models.cities.findAll();
    },
    add: async function (options) {
        const city = new models.cities(options);
        return city.save();
    },
}
