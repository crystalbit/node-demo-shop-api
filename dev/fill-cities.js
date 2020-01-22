/**
 * Fill cities table in database from JSON
 * Shall be in .gitignore, but it is demo repository
 * call .process(true) to add cities silently in unit tests
 *
 * Заполним из JSON таблицу cities в БД
 * В реальном репозитории я бы это скрыл, но это демо
 * .process(true) - добавление городов в бд без логов, заюзать в тестах
 */

const cities = require('./cities.json');
const Cities = require('../modules/db/cities');

module.exports = {
  process: async (silent = false) => {
    const existingCities = await Cities.select();
    const existingCityNames = existingCities.map(it => it.name);
  
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      const name_local = city[1].content;
      const name = city[2].content;
      if (existingCityNames.includes(name)) {
        if (!silent) console.log(`${name} exists`);
      } else {
        await Cities.add({ name, name_local });
        if (!silent) console.log(`${name} added!`);
      }
    }
    if (!silent) console.log();
    if (!silent) console.log('that\'s all, folks');
  }
}
