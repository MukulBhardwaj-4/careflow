import dotenv from 'dotenv'
import { app } from "./app.js";
import connectDB from "./config/db.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT}`)

    app.on("error",(error) => {
        console.log("connectDB error",error);
        throw error;
    })
    })
})
.catch((err) => {
  console.log(`MONGODB connection failed`, err)
})