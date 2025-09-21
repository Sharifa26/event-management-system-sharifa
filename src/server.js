import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './config/db.js';
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });



const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB connected.');

        await sequelize.sync({ alter: true });

        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start:', err);
        process.exit(1);
    }
}

start();
