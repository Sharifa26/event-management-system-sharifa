<h1 align="center">Event Management System API</h1>
<p align="center"> <a href="#features">Features</a> • <a href="#installation">Installation</a> • <a href="#dependencies">Dependencies</a> • <a href="#routes">API Endpoints</a> • <a href="#testing">Testing</a> </p>

A Node.js and Express-based virtual event management platform that allows users to register, manage, and participate in events. It features secure authentication, event creation and scheduling, participant registration with capacity checks and notifications, and a comprehensive testing suite.

<h2 id="features">📂 Features</h2>

- 🔐 User Registration & Authentication (JWT-based)

- 📝 Event creation, updating, and deletion (organizers only)

- 👥 Register for events

- 📋 Fetch all events and individual event details

- ✅ Comprehensive automated tests 

<h2 id="installation">⚙️ Installation</h2>

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sharifa26/event-management-system-sharifa.git
cd event-management-system-sharifa26

``` 
### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Environment Setup
Create a `.env` file in the root directory:

```ini
PORT=3000

# JWT
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=7d

# MySQL
DB_HOST=Your_DB_Host
DB_PORT=Your_DB_Port
DB_NAME=Your_DB_Name
DB_USER=Your_DB_User
DB_PASS=Your_DB_Pass

# NODE CACHE TTL (in seconds)
CACHE_TTL=60

# Nodemailer SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Your_Username
SMTP_PASS=Your_Password
EMAIL_FROM="Event Platform <no-reply@example.com>"
```

### 4️⃣ Run the server
```bash
node server.js

npm run dev
```

---

<h2 id="dependencies">📦 Dependencies</h2>

| Package          | Purpose                     |
| ---------------- | --------------------------- |
| **express**      | Web framework               |
| **sequelize**    | ORM for database operations |
| **mysql2**       | MySQL driver                |
| **bcrypt**       | Password hashing            |
| **jsonwebtoken** | JWT authentication          |
| **dotenv**       | Environment config          |
| **cors**         | Cross-Origin support        |


### Dev Dependencies
- **tap** – Test runner  
- **supertest** – API endpoint testing  
- **nodemon** – Development auto-restart  
- **cross-env** – Cross-platform env vars   
- **nodemailer** – Sending emails  

<h2 id="routes">🚀 API Endpoints</h2>

### 🔑 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login user and get JWT |

<details>
<summary>📌 Example: Register User</summary>

**Request**
```json
curl --location --request POST 'http://localhost:3000/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "sharifa",
    "email": "sharifasheriff26@gmail.com",
    "password": "123456"
}'
```

**Response**
```bash
{
  "status": "success",
  "message": "Registered User Successfully",
  "user": {
    "name": "sharifa",
    "email": "sharifasheriff26@gmail.com",
    "role": "attendee"
  }
}
```
</details>

<details>
<summary>📌 Example: Login User</summary>

```bash
curl --location --request POST 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "sharifasheriff26@gmail.com",
    "password": "123456"
}

```

**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "sharifa",
    "email": "sharifasheriff26@gmail.com",
    "role": "attendee"
  }
}

```
</details>

### 📝 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/events` | Create a new event |
| `GET` | `/events` | List all events |
| `GET` | `/events/:id` | Get event details |
| `PUT` | `/events/:id` | Update event details |
| `DELETE` | `/events/:id` | Delete event |
| `POST` | `/events/:id/register` | Register for event |

<details>
<summary>📌 Example: Create Event</summary>

**Request**
```bash
curl --location --request POST 'http://localhost:3000/events' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1' \
--data-raw '{
    "title": "Tech Conference",
    "description": "Learn cool stuff",
    "date": "2025-12-01",
    "time": "10:00",
    "location": "Online",
    "capacity": 100
}
```
**Response**
```json
{
  "status": "success",
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "title": "Tech Conference",
    "description": "Learn cool stuff",
    "date": "2025-12-01",
    "time": "10:00",
    "location": "Online",
    "capacity": 100,
    "organizerId": 1,
    "participants": []
  }
}

```
</details>

<details>
<summary>📌 Example: List Events</summary>

**Request**
```bash
curl --location --request GET 'http://localhost:3000/events' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1'
```

**Response**
```json
{
  "message": "Events listed",
  "events": [
    {
      "id": 1,
      "title": "UI/UX Design Bootcamp",
      "description": "Learn practical UI/UX skills in an intensive virtual bootcamp.",
      "date": "2025-12-10",
      "time": "13:00:00",
      "location": "Online - Microsoft Teams",
      "capacity": 5,
      "organizer": {
        "id": 3,
        "name": "Ismail",
        "email": "ismailsheriff2001@gmail.com"
      },
      "participants": [
        {
          "id": 5,
          "name": "User1",
          "email": "User1@gmail.com",
          "EventParticipant": { "status": "registered" }
        }
      ]
    }
  ]
}
```
</details>

<details>
<summary>📌 Example: Get Event</summary>

**Request**
```bash
curl --location --request GET 'http://localhost:3000/events/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1'
```

**Response**
```json
{
  "event": {
    "id": 1,
    "title": "UI/UX Design Bootcamp",
    "description": "Learn practical UI/UX skills in an intensive virtual bootcamp.",
    "date": "2025-12-10",
    "time": "13:00:00",
    "location": "Online - Microsoft Teams",
    "capacity": 5,
    "organizer": {
      "id": 3,
      "name": "Ismail",
      "email": "ismailsheriff2001@gmail.com"
    },
    "participants": [
      {
        "id": 5,
        "name": "User1",
        "email": "User1@gmail.com",
        "EventParticipant": { "status": "registered" }
      }
    ]
  }
}
```
</details>

<details>
<summary>📌 Example: Update Event</summary>

**Request**
```bash
curl --location --request PUT 'http://localhost:3000/events/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1' \
--data-raw '{
    "title": "UI/UX Design Bootcamp",
    "description": "Learn practical UI/UX skills in an intensive virtual bootcamp.",
    "date": "2025-12-10",
    "time": "13:00:00",
    "location": "Online - Microsoft Teams",
    "capacity": 5
}'
```

**Response**
```json
{
  "status": "success",
  "message": "Event updated successfully by Ismail"
}
```
</details>

<details>
<summary>📌 Example: Delete Event</summary>

**Request**
```bash
curl --location --request DELETE 'http://localhost:3000/events/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1'
```

**Response**
```json
{
  "status": "success",
  "message": "Event deleted by organizer: Ismail"
}
```
</details>

<details>
<summary>📌 Example: Register for Event</summary>

**Request**
```bash
curl --location --request POST 'http://localhost:3000/events/1/register' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjM0IiwiaWF0IjoxNjI5NjQ5Mzk5fQ.1-4-1-0-0-0-0-0-0-0-1'
```

**Response**
```json
{
  "status": "success",
  "message": "Registered Event Successfully",
  "eventId": 1,
  "userId": 5
}
```
</details>

---

<h2 id="testing">🧪 Running Tests</h2>

### Environment Setup for Testing
Create a `.env.test` file in the root directory:
```ini
PORT=3001

# JWT
JWT_SECRET=YOUR_JWT_SECRET_FOR_TESTING
JWT_EXPIRES_IN=7d

# MySQL
DB_HOST=Your_DB_Host
DB_PORT=Your_DB_Port
DB_NAME=Your_DB_Name
DB_USER=Your_DB_User
DB_PASS=Your_DB_Pass

# NODE CACHE TTL (in seconds)
CACHE_TTL=60

# Nodemailer SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Your_Username
SMTP_PASS=Your_Password
EMAIL_FROM="Event Platform <no-reply@example.com>"

```

### Run all tests
```bash
npm test
```

### Test Coverage ✅
- ✔️ Register user (success & fail)  
- ✔️ Login (success & invalid credentials)  
- ✔️ Update & fetch preferences  
- ✔️ Unauthorized access handling  
- ✔️ Fetch news by preferences  
- ✔️ Mark article as read & fetch read list  

---

<h2 id="postman">👩‍💻 Author</h2>

**Sharifa** ✨
📧 Contact: [sharifasheriff26@gmail.com](mailto:sharifasheriff26@gmail.com)

