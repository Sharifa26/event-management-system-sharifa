import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Event = sequelize.define("Event", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        capacity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        }
    },
        {
            tableName: "events",
            timestamps: true
        });

    Event.associate = (db) => {
        Event.belongsTo(db.User, {
            as: "organizer",
            foreignKey: "organizerId"
        });
        Event.belongsToMany(db.User, {
            through: db.EventParticipant,
            as: "participants",
            foreignKey: "eventId"
        });
        Event.hasMany(db.EventParticipant, { foreignKey: "eventId" });
    };

    return Event;
};
