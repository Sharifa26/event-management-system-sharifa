import dotenv from 'dotenv';
dotenv.config();

// Include the correct file extension
import app from './app.js';
import { sequelize } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB connected.');

        // sync for dev. In production, use migrations
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start:', err);
        process.exit(1);
    }
}

start();
