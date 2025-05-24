require("dotenv").config();
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    ssl:{
        required: true,
        rejectUnauthorized: false
    }
});
 
module.exports = sequelize;