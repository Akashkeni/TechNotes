const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const cors  = require("cors")
const corsOptions = require("./config/corsOptions")

const {logger} = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")

const PORT = process.env.PORT || 3500

// console.log(__dirname)
// C:\Users\Asus\Programming_Projects\MyPractProjects\TechNotes\backend


app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/",express.static(path.join(__dirname,"public")))

app.use("/",require("./routes/root"))

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

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

