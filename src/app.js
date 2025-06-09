import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" //to interact with cookies of users browser with our server

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// to accept json data
app.use(express.json({
    limit: "16kb"
}))

// to accept url
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// to accpet files,folders, and store them in public asset
app.use(express.static("public"))

// to interact with cookies
app.use(cookieParser())

// routes 
import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter) //https://localhost:8000/api/v1/users 

export { app }