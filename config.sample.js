module.exports = {
    prod: {
        mysql: {
            host: 'localhost',
            port: 3336,
            user: 'innoscripta',
            password: '',
            database: 'pizzashop',
            prefix: 'inno_'
        }
    },
    dev: {
        mysql: {
            host: 'localhost',
            port: 3336,
            user: 'innoscripta',
            password: '',
            database: 'dev_pizzashop',
            prefix: 'inno_'
        }
    },
    test: {
        mysql: {
            host: 'localhost',
            port: 3336,
            user: 'innoscripta',
            password: '',
            database: 'test_pizzashop',
            prefix: 'inno_'
        }
    }
}