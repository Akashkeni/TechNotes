const mongoose = require("mongoose")
const Note = require("../models/Note")
const User = require("../models/User")
const asyncHandler = require("express-async-handler")

// @desc Get all notes
// @route GET /notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find()
        .populate("user", "username")
        .lean()

    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" })
    }

    res.json(notes)
})
// @desc Create new note
// @route POST /notes
// @access private

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" })
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ message: "Invalid user ID" })
    }

    const cleanTitle = title.trim()
    const cleanText = text.trim()

    // Check user exists
    const userExists = await User.findById(user).lean().exec()
    if (!userExists) {
        return res.status(400).json({ message: "User not found" })
    }

    // Check duplicate title (per user)
    const duplicate = await Note.findOne({ user, title: cleanTitle }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate note title" })
    }

    const note = await Note.create({
        user,
        title: cleanTitle,
        text: cleanText
    })

    res.status(201).json(note)
})
// @desc Update note
// @route PATCH /notes
// @access private


const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fields are required" })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }

    // Check user exists
    const userExists = await User.findById(user).lean().exec()
    if (!userExists) {
        return res.status(400).json({ message: "User not found" })
    }

    const cleanTitle = title.trim()
    const cleanText = text.trim()

    // Check duplicate (per user)
    const duplicate = await Note.findOne({ user, title: cleanTitle }).lean().exec()

    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate Note title" })
    }

    note.user = user
    note.title = cleanTitle
    note.text = cleanText
    note.completed = completed

    const updatedNote = await note.save()

    res.json({
        message: `${updatedNote.title} updated`,
        note: updatedNote
    })
})
// @desc Delete note
// @route DELETE /notes
// @access private

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: "Note ID required" })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid note ID" })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(404).json({ message: "Note not found" })
    }

    const title = note.title
    const idToDelete = note._id

    await note.deleteOne()

    res.json({
        message: `Note ${title} deleted`,
        id: idToDelete
    })
})

module.exports={
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}