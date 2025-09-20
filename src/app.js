import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoute.js';
import eventRoutes from './routes/eventRoute.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// simple health
app.get('/', (req, res) => res.json({ message: 'Virtual Event Backend is running' }));

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

// error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
