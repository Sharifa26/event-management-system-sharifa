import db from '../models/index.js';
import sendMail from '../utils/mailer.js';
const { Event, EventParticipant, User } = db;


//List all events by All
const listEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [{
                model: User, as: 'organizer',
                attributes: ['id', 'name', 'email']
            },
            {
                model: User, as: 'participants',
                attributes: ['id', 'name', 'email'],
                through: { attributes: ['status'] }
            }]
        });
        return res.status(200).json({ message: 'Events listed', events });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//Create a new event by organizer
const createEvent = async (req, res) => {
    const { title, description, date, time, location, capacity } = req.body;
    try {
        const event = await Event.create({
            title, description, date, time, location, capacity, organizerId: req.user.id
        });
        return res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//Get a single event by All
const getEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findByPk(id,
            {
                include: [{
                    model: User, as: 'organizer',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User, as: 'participants',
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: ['status', 'createdAt'] }
                }]
            });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        return res.status(200).json({ event });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//Update a single event by organizer
const updateEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizerId !== req.user.id) return res.status(403).json({ message: 'Only the organizer can modify event' });

        const allowedFields = ["title", "description", "date", "time", "location", "capacity"];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        // Update the event
        const updated = await event.update(updates);
        return res.status(200).json({ message: `Event updated successfully by ${req.user.name}`, event: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//Delete a single event by organizer
const deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizerId !== req.user.id) return res.status(403).json({ message: 'Only the organizer can delete event' });

        await event.destroy();
        return res.status(200).json({ message: 'Event deleted by organizer: ' + req.user.name });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}


//Register for an event by attendee
const registerForEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    try {
        const event = await Event.findByPk(eventId, { include: [{ model: User, as: 'participants' }] });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // optional: check capacity
        if (event.capacity) {
            const count = await event.countParticipants({
                through: { where: { status: 'registered' } }
            });
            if (count >= event.capacity) return res.status(400).json({ message: 'Event is full' });
        }

        // check already registered
        const [participant, created] = await EventParticipant.findOrCreate({
            where: { eventId, userId },
            defaults: { status: 'registered' }
        });

        if (!created && participant.status === 'registered') {
            return res.status(200).json({ message: 'Already registered' });
        } else {
            if (!created) {
                participant.status = 'registered';
                await participant.save();
            }

            const user = req.user;
            sendMail({
                to: user.email,
                subject: `Registration confirmed: ${event.title}`,
                text: `Hi ${user.name},\n\nYou've been registered for "${event.title}" on ${event.date} at ${event.time}.`,
                html: `<p>Hi ${user.name},</p><p>You've been registered for "<strong>${event.title}</strong>" on ${event.date} at ${event.time}.</p>`
            }).catch(err => console.error('Failed to send registration mail:', err));

            return res.json({ message: 'Registered Event Successfully', eventId, userId });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

export default { listEvents, createEvent, getEvent, updateEvent, deleteEvent, registerForEvent };
