import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to db")
    })
    .catch((err) => {
        console.log("error in connecting to db", err)
    }) 
}

export default db;