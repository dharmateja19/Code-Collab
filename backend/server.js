import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/room.js'
import http from 'http';
import { Server } from 'socket.io'

dotenv.config()

const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : '*'
    }
})

const PORT = process.env.PORT || 3000
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hello from server...')
})

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})
