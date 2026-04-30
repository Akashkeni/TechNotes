const mongoose = require("mongoose");
const Autoincrement = require("mongoose-sequence")(mongoose)

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
  minlength: 3,
  maxlength: 100,
    },
    text: {
      type: String,
      required: true,
       trim: true,
  minlength: 3,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ user: 1, title: 1 }, { unique: true });


noteSchema.plugin(Autoincrement,{
    inc_field:"ticket",
    id:"ticketNums",
    start_seq:500
})

module.exports = mongoose.model("Note", noteSchema);
