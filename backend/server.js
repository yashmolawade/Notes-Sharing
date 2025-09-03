const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectTODB = require('./src/config/db');
const authRouter = require('./src/routes/user.route');
const notesRouter = require('./src/routes/note.route');
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// DB Connection
connectTODB()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/test',(req,res)=>{
    res.send("Test Route")
})

// Auth Router
app.use('/api/auth',authRouter)

// Notes router
app.use('/api/notes',notesRouter)

app.use((req,res)=>res.status(404).json({message:"404 Not Found"}))

app.listen(PORT,()=>console.log(`Server started at port ${PORT}`))