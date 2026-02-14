import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import verifyToken from './middlewares/verifyToken.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hello from server...')
})

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})
