const mongoose = require('mongoose')

const connectTODB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Error connecting in DB")
        console.log(error)
    }
}

module.exports = connectTODB