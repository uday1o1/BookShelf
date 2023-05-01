//define product model using Sequelize
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//define product model
const Product = sequelize.define("product", {
  prodId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE.UNSIGNED,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;