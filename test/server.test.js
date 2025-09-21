import tap from 'tap';
import supertest from 'supertest';
import dotenv from 'dotenv';
import db from '../src/models/index.js';
import app from '../src/app.js';

dotenv.config();

const server = supertest(app);

let organizerToken, attendeeToken, eventId;


tap.before(async () => {
    await db.sequelize.sync({ force: true });
});

//📝 Register Organizer
tap.test('POST /auth/register - register organizer', async (t) => {
    const res = await server.post('/auth/register').send({
        name: 'Admin',
        email: 'organizer@gmail.com',
        password: '123456',
        role: 'organizer'
    });

    t.equal(res.status, 201, 'Organizer registered successfully');
    t.end();
});

//📝 Register Attendee
tap.test('POST /auth/register - register attendee', async (t) => {
    const res = await server.post('/auth/register').send({
        name: 'User',
        email: 'attendee@gmail.com',
        password: '123456',
        role: 'attendee'
    });

    t.equal(res.status, 201, 'Attendee registered successfully');
    t.end();
});

//📝 Login Organizer
tap.test('POST /auth/login - login organizer', async (t) => {
    const res = await server.post('/auth/login').send({
        email: 'organizer@gmail.com',
        password: '123456'
    });

    t.equal(res.status, 200, 'Organizer logged in');
    organizerToken = res.body.token;
    t.type(organizerToken, 'string', 'Organizer token is a string');
    t.end();
});

//📝 Login Attendee
tap.test('POST /auth/login - login attendee', async (t) => {
    const res = await server.post('/auth/login').send({
        email: 'attendee@gmail.com',
        password: '123456'
    });

    t.equal(res.status, 200, 'Attendee logged in');
    attendeeToken = res.body.token;
    t.type(attendeeToken, 'string', 'Attendee token is a string');
    t.end();
});

//📝 Login Attendee - invalid email
tap.test('POST /auth/login - invalid email', async (t) => {
    const res = await server.post('/auth/login').send({
        email: 'nonexistent@test.com',
        password: '123456'
    });

    t.equal(res.status, 401, 'Login fails with invalid email');
});

//📝 Login Attendee - wrong password
tap.test('POST /auth/login - wrong password', async (t) => {
    const res = await server.post('/auth/login').send({
        email: 'org@test.com',
        password: 'wrongpassword'
    });

    t.equal(res.status, 401, 'Login fails with wrong password');
});


//🌃 Create Event by Organizer
tap.test('POST /events - create event by organizer', async (t) => {
    const res = await server.post('/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
            title: 'Tech Conference',
            description: 'Learn cool stuff',
            date: '2025-12-01',
            time: '10:00',
            location: 'Online',
            capacity: 100
        });
    t.equal(res.status, 201, 'Event created successfully');
    eventId = res.body.event.id;
    t.ok(eventId, 'Event ID is returned');
    t.end();
});

//🌃 Register Attendee for Event
tap.test('POST /events/:id/register - attendee registers for event', async (t) => {
    const res = await server.post(`/events/${eventId}/register`)
        .set('Authorization', `Bearer ${attendeeToken}`);

    t.equal(res.status, 200, 'Attendee registered successfully');
    t.same(res.body.message, 'Registered Event Successfully', 'Message matches');
    t.end();
});

//🌃 Update Event by Organizer
tap.test('PUT /events/:id - organizer updates event', async (t) => {
    const res = await server.put(`/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ title: 'Updated Conference' });

    t.equal(res.status, 200, 'Event updated successfully');
    t.equal(res.body.event.title, 'Updated Conference', 'Title updated');
    t.end();
});

//🌃 List Events
tap.test('GET /events - list events', async (t) => {
    const res = await server.get('/events')
        .set('Authorization', `Bearer ${attendeeToken}`);

    t.equal(res.status, 200, 'Events listed');
    t.ok(Array.isArray(res.body.events), 'Events is array');
    t.end();
});

//🌃 List Events - unauthorized
tap.test('GET /events - unauthorized', async (t) => {
    const res = await server.get('/events'); // no token

    t.equal(res.status, 401, 'Access denied without token');
});

//🌃 List Events - invalid token
tap.test('GET /events - invalid token', async (t) => {
    const res = await server.get('/events')
        .set('Authorization', 'Bearer invalidtoken');

    t.equal(res.status, 401, 'Access denied with invalid token');
    t.type(res.body.error, 'string', 'Error message is returned');
});


//🌃 Delete Event by Organizer
tap.test('DELETE /events/:id - organizer deletes event', async (t) => {
    const res = await server.delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`);

    t.equal(res.status, 200, 'Event deleted successfully');
    t.end();
});

tap.teardown(async () => {
    await db.sequelize.close();
});
