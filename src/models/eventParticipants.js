import { DataTypes } from "sequelize";

export default (sequelize) => {
    const EventParticipant = sequelize.define("EventParticipant", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM("registered", "cancelled"),
            defaultValue: "registered"
        }
    },
        {
            tableName: "event_participants",
            timestamps: true
        });

    EventParticipant.associate = (db) => {
        EventParticipant.belongsTo(db.User, { foreignKey: "userId" });
        EventParticipant.belongsTo(db.Event, { foreignKey: "eventId" });
    };

    return EventParticipant;
};
