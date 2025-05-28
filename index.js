import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./utils/db.js"
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser())


app.use(cors({
    origin : process.env.BASE_URL, // replace with your frontend URL
    methods : ["GET" , "POST" , "PUT" , "DELETE"],
    credentials : true, 
    allowedHeaders : ["Authorization" , "content-type"]
}));

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('cohort')
}) 

console.log(process.env.PORT || 4000)

app.get('/gaurav', (req, res) => {  
    res.send('gaurav')
  })

  app.get('/thorat', (req, res) => {
    res.send('thorat')
  })

  db()
  app.use("/api/user", userRoutes);
app.listen(port, () => {   
  console.log(`Example app listening on port ${port}`)
})        