const {DataTypes} = require('sequelize');
const db = require('../config/db');

const UserAuth = db.define("UserAuth", {
   email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{isEmail: true}
   },
   password:{
    type: DataTypes.STRING,
    allowNull: false
   }
});
module.exports = UserAuth;