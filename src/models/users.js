import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("attendee", "organizer"),
            allowNull: false,
            defaultValue: "attendee"
        }
    },
        {
            tableName: "users",
            timestamps: true
        });

    User.associate = (db) => {
        User.belongsToMany(db.Event, {
            through: db.EventParticipant,
            as: "events",
            foreignKey: "userId"
        });
        User.hasMany(db.EventParticipant, { foreignKey: "userId" });
    };

    return User;
};
