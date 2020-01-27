const bcrypt = require('bcrypt');

module.exports = {
    hash: (password, salt) => bcrypt.hashSync(password, salt, null),
    salt: () => bcrypt.genSaltSync(8)
}
