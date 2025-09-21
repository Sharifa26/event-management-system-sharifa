import express from 'express';
import eventController from '../controllers/eventController.js';
import authenticate from '../middleware/authMiddleware.js';
import requireRole from '../middleware/roleMiddleware.js';
import { validateEvent } from '../middleware/validateEventMiddleware.js';

const router = express.Router();


router.get('/', authenticate, eventController.listEvents);
router.post('/', authenticate, validateEvent, requireRole('organizer'), eventController.createEvent);
router.get('/:id', authenticate, eventController.getEvent);
router.put('/:id', authenticate, requireRole('organizer'), eventController.updateEvent);
router.delete('/:id', authenticate, requireRole('organizer'), eventController.deleteEvent);

// register for event 
router.post('/:id/register', authenticate, requireRole('attendee'), eventController.registerForEvent);

export default router;
