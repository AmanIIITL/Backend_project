// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
// dotenv ko jaldi se jaldi import krna chahiye taki sare env variables available ho ske
import connectDB from './db/index.js';

dotenv.config(
    {
        path: './.env'
    }
) // Loads .env from root
connectDB()
.then(() => {
    app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
    })
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed!!!", err);
})


// import mongoose from 'mongoose';
// import {DB_NAME} from "./constants";
//database se jab bhi connect krne ka try kroge, humesha errors aa skti hai toh humesha try-catch ya fir promises use kro
//database is always in another continent, i.e db se interact krne me time lagega so use async await
// first approach to connect DB directly in the index.js file
// import express from "express"
// const app = express()

// ( async () => {
//     try{
//         await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}')
//         app.on("error", (error) => {
//             console.log("ERROR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log('App is listening on port ${process.env.PORT}');
//         })
//     } catch(error){
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()