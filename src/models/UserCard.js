const {DataTypes} = require("sequelize");
const db = require("../config/db");

const UserCard = db.define("UserCard",{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    cargo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = UserCard;