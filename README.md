# Code-Collab  

**A real-time collaborative coding platform with live chat and persistent room state built using the MERN stack and Socket.IO.**

---

## Overview

**Code-Collab** allows multiple users to:

- Join a shared room  
- Edit code together in real time  
- Chat instantly  
- Automatically persist code to the database  

It simulates the core collaborative experience of modern online IDE platforms.

---

## Features

### Authentication

- User registration & login  
- JWT-based authentication  
- Protected routes  
- Secure middleware validation  

---

### Room Management

- Create room  
- Join room using unique Room ID  
- Live participants list  
- Automatic leave handling  
- Owner identification 

---

### Real-Time Code Collaboration

- Monaco Editor integration  
- Live code synchronization via Socket.IO  
- Room-based event broadcasting  
- Multi-language support  

---

### Real-Time Chat

- Room-based messaging system  
- Instant message broadcasting  
- Sender name display  
- Auto scroll handling  

---

### Code Persistence

- Code stored in MongoDB  
- Automatic code loading when users join  
- Persistent room state  
- No data loss on refresh  

---

## Tech Stack

### Frontend

- React (Vite)  
- Tailwind CSS  
- Monaco Editor  
- Axios  
- Socket.IO Client  

---

### Backend

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- Socket.IO  
- JWT Authentication  
- CORS  

---

### Deployment

- Frontend → Vercel  
- Backend → Render  

---

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/code-collab.git
```

### Navigate to the project directory

```bash
cd code-collab
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Setup Environment Variables

Create a `.env` file inside the **backend** folder and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file inside the **frontend** folder and add:

```
VITE_BACKEND_URL=http://localhost:5000
```

---

## ▶️ Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd ../frontend
npm run dev
```

---

## 🧑‍💻 Usage

- Register or Login  
- Create a new room or join an existing room  
- Collaborate in real time using the code editor  
- Chat instantly with participants  
- Code is automatically saved and restored  

---

## 🧠 Architecture

- REST APIs for authentication and room management  
- WebSockets for real-time code and chat synchronization  
- MongoDB for persistent room data  
- JWT for secure sessions  

---

## 👨‍💻 Author

**Dharma Teja Pamarthi**  
MERN Stack Developer

