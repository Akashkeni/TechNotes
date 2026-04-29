const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")

const User = require("../models/User")
const Note = require("../models/Note")


// @desc Get all Users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find().select("-password").lean()
    if(!users?.length){
        return res.status(400).json({message:"No Users Found"})
    }
    res.json(users)
})

// @desc Create new User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req,res) => {
    const {username,password,roles} = req.body

    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message:"All fields are required"})
    }

    // Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
        // 409 = conflict
        return res.status(409).json({message:"Duplicate Username"})
    }

    // Hash the password
    const hashPwd = await bcrypt.hash(password,10) // salt rounds

    const userObject = {username , "password":hashPwd,roles}

    // Create and Store new user
    const user = await User.create(userObject)


    if(user){
        res.status(201).json({message: `New User ${username} created`})
    }else {
        res.status(400).json({message:'Invalid user data received'})
    }

})

// @desc Update a User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req,res) => {

    const {id,username,roles,active,password}= req.body

    // Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length  || typeof(active) !== "boolean"){
        return res.status(400).json({message:"All fields are required"})
    }

    const user = await User.findById(id).exec()
    
    if(!user){
        return res.status(404).json({message:"User not found"})
    }

    // Check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()

    // Allow updates to original user
    if(duplicate && duplicate._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    user.username=username
    user.roles = roles
    user.active = active

    if(password){
        // Hash Password
        user.password = await bcrypt.hash(password,10)
    }

    const updatedUser = await user.save()

    res.json({message:`${updatedUser.username} updated`})



})

// @desc Delete a User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req,res) => {
    const {id}= req.body

    if(!id){
        return res.status(400).json({message:"User ID Required"})
    }
    
    const note = await Note.findOne({user:id})
    if(note){
        return res.status(400).json({message:"User has assigned Notes"})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:"User not Found"})
    }

    const result = await user.deleteOne()

// manually add required fields
result.username = user.username
result.id = user._id.toString()

const reply = `Username ${result.username} with ID ${result.id} deleted`

res.json(reply)

})

module.exports ={
    getAllUsers,createNewUser,updateUser,deleteUser
}