const expect = require("chai").expect;
const fs = require('fs');
const path = require('path');
const db = require('../modules/db');

// go tests
describe("Тест получения городов / Retrieving cities from db", function() {
    before(async function() {
        await db.init();
        const cityAdder = path.join(__dirname, '../dev/fill-cities.js');
        if (fs.existsSync(cityAdder)) {
            require(cityAdder).process(true);
        }
    });

    it(`проверяем наличие городов в базе / loading and checking cities in db`, async function() {
        const cities = await db.selectCities();
        expect(typeof cities).to.be.equal('object');
        expect(cities.length).to.be.at.least(1);
    });
});
