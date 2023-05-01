const Sequelize = require('sequelize');

const sequelize = new Sequelize('bookshelf', 'root', 'sqlServer_1o1', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;