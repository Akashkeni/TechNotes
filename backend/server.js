// dotenv imports
require("dotenv").config()

// built-in / npm modules import 
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors  = require("cors")

const app = express()
const PORT = process.env.PORT || 3500

// functions import
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const {logEvents,logger} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")


// console.log(__dirname)
// C:\Users\Asus\Programming_Projects\MyPractProjects\TechNotes\backend

// MongoDB Connection function
connectDB()

// Custom middleware that logs requests 
app.use(logger)

// CORS config
app.use(cors(corsOptions))

// Middleware to parse json data
app.use(express.json())

// Middleware for cookies
app.use(cookieParser())

// Provides Static files for the application
app.use("/",express.static(path.join(__dirname,"public")))

// Routes for the application
app.use("/",require("./routes/root"))

app.use("/users",require("./routes/userRoutes"))

app.use("/notes",require("./routes/noteRoutes"))

// 404 not Found page handler , that runs only when no requests matches the actual application url path 
app.use((req,res)=>{
    res.status(404)
    if(req.accepts("html")){
        return res.sendFile(path.join(__dirname,"views","404.html"))
    }else if(req.accepts("json")){
        return res.json({message:"404 Not Found"})
    }else{
        return res.type("txt").send("404 not found")
    }
})

// function that logs requests for Error messages or not found pages
app.use(errorHandler)

// Once mongodb connection is successful only then app is started
mongoose.connection.once("open",()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})

// Else error message is shown in the error log
mongoose.connection.on("error",err=>{
    console.log(err)
    logEvents(`${err.no} : ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
})

