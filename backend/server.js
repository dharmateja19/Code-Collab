import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/room.js'
import http from 'http';
import { Server } from 'socket.io'
import cors from 'cors'
import { roomSocket } from './sockets/roomSocket.js';

dotenv.config()

const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : '*'
    }
})

roomSocket(io);
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('Hello from server...')
})

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

server.listen(PORT, () => {
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})
