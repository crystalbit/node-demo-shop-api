const models = require("./db-models");

module.exports = {
    init: async function () {
        await models.init();
        //await models.sync();
    },
    close: models.close
}
