import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hello from server...')
})

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})
