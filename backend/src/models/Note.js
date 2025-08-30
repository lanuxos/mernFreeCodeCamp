import mongoose from "mongoose"

// create a schema first
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
{ timestamps: true }
);

// then, create model based on above schema
const Note = mongoose.model("Note", noteSchema);

export default Note