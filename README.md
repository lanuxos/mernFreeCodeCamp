# mernFreeCodeCamp
# [MERN Free Code Camp](https://www.youtube.com/watch?v=F9gB5b4jgOI&ab_channel=freeCodeCamp.org)

# backend
## set-up
```bash
mkdir backend
cd backend
npm init -y
npm install express@4.13.2 nodemon
touch server.js
```
- server.js
```js
import express from "express" // type = module
// const express = require("express"); // type = commonjs

const app = express();

app.get("/api/notes", (req, res) => {
    res.status(200).send("You got 5 notes");
});

app.listen(5001, () => {
    console.log("SERVER STARTED ON PORT 5001");
});
```
- package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

```

## route
- server.js
```js
import express from "express" // type = module
// const express = require("express"); // type = commonjs

const app = express();

app.get("/api/notes", (req, res) => {
    res.status(200).send("You got 5 notes");
});

app.post("/api/notes", (req, res) => {
    res.status(201).json({ message: "Note created" });
});

app.put("/api/notes/:id", (req, res) => {
    res.status(200).json({ message: "Note updated" });
});

app.delete("/api/notes/:id", (req, res) => {
    res.status(200).json({ message: "Note deleted" });
});


app.listen(5001, () => {
    console.log("SERVER STARTED ON PORT 5001");
});
```

## optimize/re-struct directory
### directory structure
- backend
  - src
    - controllers
      - notesController.js
    - models
      - Note.js
    - routes
      - notesRoutes.js
    - server.js

### routes
- notesRoutes.js
```js
import express from "express"
import { createNote, deleteNote, getAllNotes, updateNote } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

```
- noteController.js
```js
export function getAllNotes(req, res) {
    res.status(200).send("You got 9 notes");
}

export function createNote(req, res) {
    res.status(201).json({ message: "Note created" });
}

export function updateNote(req, res) {
    res.status(200).json({ message: "Note updated" });
}

export function deleteNote(req, res) {
    res.status(200).json({ message: "Note deleted" });
}
```
- server.js
```js
import express from "express" // type = module
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

app.use("/api/notes", notesRoutes);

app.listen(5001, () => {
    console.log("SERVER STARTED ON PORT 5001");
});
```
## database
```bash
npm install mongoose@8.14.3
npm install dotenv@16.5.0
```
- db.js
```js
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1); // 1 - exit with failure; 0 - success
    }

}
```
- .env
```
MONGO_URI=MONGO_DB_URI
PORT=5001
```
- server.js
```js
// const express = require("express"); // type = commonjs
import express from "express" // type = module
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotent from "dotenv";

dotent.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
    console.log("SERVER STARTED ON PORT", PORT);
});

```
- Note.js
```js
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
```
## controller
- notesController.js
```js
import Note from "../models/Note.js"

export async function getAllNotes(_, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (error) {
        console.error("Error in getNoteById");
        res.json({ message: "Error in getNoteById" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content });
        
        const savedNote = await note.save()
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Error in createNote controller" });
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, {new: true});
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote");
        res.status(200).json({ message: "Note failed to updated" });
    }
}

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note deleted" });
    } catch (error) {
        console.error("Error in deleteNote");
        res.status(200).json({ message: "Note failed to deleted" });
    }
}
```
- notesRoutes.js
```js
import express from "express"
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

```
- server.js
```js
// const express = require("express"); // type = commonjs
import express from "express" // type = module
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotent from "dotenv";

dotent.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// middleware
app.use(express.json());

app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
    console.log("SERVER STARTED ON PORT", PORT);
});

```

## middle ware
```bash
npm install @upstash/ratelimit@2.0.5 @upstash/redis@1.34.9
```
- .env
```
MONGO_URI=URI
PORT=5001

UPSTASH_REDIS_REST_URL=END-POINT
UPSTASH_REDIS_REST_TOKEN=TOKEN
```
- server.js
```js
// const express = require("express"); // type = commonjs
import express from "express" // type = module
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotent from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotent.config();

const app = express();
const PORT = process.env.PORT || 5001;



// middleware
app.use(express.json()); // parse json
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("SERVER STARTED ON PORT", PORT);
    });
});

```
- upstash.js
```js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export default ratelimit
```
- rateLimiter.js
```js
import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-limit-key");

        if (!success) {
            return res.status(429).json({
                message: "Too many request, please try again later"
            });
        }

        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
}

export default rateLimiter;
```

# frontend [rafce]
## set-up
```bash
npm create vite@latest .
npm install
npm i react-router
npm i react-hot-toast
npm run dev

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

npm i -D daisyui@4.12.24
```
- main.jsx
```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
)

```
- App.jsx
```js
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'
import toast from 'react-hot-toast';

const App = () => {
  return (
    <div data-theme="coffee">
      <button className="btn">Button</button>
      <button className="btn btn-neutral">Neutral</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
      <button className="btn btn-accent">Accent</button>
      <button className="btn btn-ghost">Ghost</button>
      <button className="btn btn-link">Link</button>
      <Routes>
        <Route path="/" element={< HomePage />} />
        <Route path="/create" element={< CreatePage />} />
        <Route path="/note/:id" element={< NoteDetailPage />} />
      </Routes>
    </div>
  )
}

export default App
```
- HomePage.jsx
```js
import React from 'react'

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage
```
- [tailwind.config.js](https://v3.tailwindcss.com/docs/guides/vite)
```js
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["forest", "coffee"],
  },
}
```
- index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
## Home Page
```bash
npm i lucide-react
npm i axios
npm i cors # @ backend directory
```
- Navbar.jsx
```js
import React from 'react'
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
      <header className='bg-base-300 border-d border-base-content/10'>
          <div className='mx-auto max-w-6xl p4'>
              <div className='flex items-center justify-between'>
                  <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>
                      LaNote
                  </h1>
                  <div className='flex items-center gap-4'>
                      <Link to={"/create"} className='btn btn-primary'>
                          <PlusIcon className='size-5' />
                          <span>New Note</span>
                      </Link>
                  </div>
              </div>
          </div>
    </header>
  )
}

export default Navbar
```
- NoteCard.jsx
```js
import React from 'react'
import { Link } from "react-router";
import { Trash2Icon, PenSquareIcon } from "lucide-react";
import { formatDate } from '../lib/utils';

const NoteCard = ({ note}) => {
  return (
      <div>
          <Link to={`/note/${note._id}`} className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-brown'>
              <div className='card-body'>
                  <h3 className='card-title text-base-content'>{note.title}</h3>
                  <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
                  <div className='card-actions justify-between items-center mt-4'>
                      <span>
                          {formatDate(new Date(note.createdAt))}
                      </span>
                      <div className='flex items-center gap-1'>
                          <button className='flex items-center gap-1'>
                              <PenSquareIcon className='size-4'/>
                          </button>
                          <button className='btn btn-xs text-error'>
                              <Trash2Icon className="size-4" />
                          </button>
                      </div>
                  </div>
              </div>
          </Link>
    </div>
  )
}

export default NoteCard
```
- RateLimitedUI.jsx
```js
import React from 'react'
import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
      <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='bg-primary/10 border-primary/30 rounded-lg shadow-md'>
              <div className='flex flex-col md:flex-row items-center p-6'>
                  <div className='flex-shrink-0 bg-primary/20 p-4 rounded-full mb-4 md:md-0 md:mr-6'>
                      <ZapIcon className='size-10 text-primary'/>
                  </div>
                  <div className='flex-1 text-center md:text-left'>
                      <h3 className='text-xl font-bold mb-2'>
                          Rate Limit Reached
                      </h3>
                      <p className='text-base-content mb-1'>
                          You've made to many requests in a short period. Please wait a moment.
                      </p>
                      <p className='text-sm text-base-content/70'>
                          Try again in a few seconds for the best experience.
                      </p>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default RateLimitedUI
```
- utils.jsx
```js
export function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
```
- server.jsx
```js
// const express = require("express"); // type = commonjs
import express from "express" // type = module
import cors from "cors";
import dotent from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotent.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json()); // parse json
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("SERVER STARTED ON PORT", PORT);
    });
});

```
- HomePage.jsx
```js
import { useState } from 'react'
import { useEffect } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);

      } catch (error) {
        console.log("Error fetching notes", error);
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

        {notes.length > 0 && !isRateLimited && (
          <div div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div>
                <NoteCard key={note._id} note={note} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
```
- App.jsx
```js
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'
import toast from 'react-hot-toast';

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <div className='absolute inset-0 -z-10 h-full w-full items-center px-5 py24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]' />
      <Routes>
        <Route path="/" element={< HomePage />} />
        <Route path="/create" element={< CreatePage />} />
        <Route path="/note/:id" element={< NoteDetailPage />} />
      </Routes>
    </div>
  )
}

export default App
```
## Create Page
- axios.js
```js
import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5001/api"
})

export default api;
```
- CreatePage.jsx
```js
import {useState} from 'react'
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from '../lib/axios';

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note create successfully")
      navigate("/");
    } catch (error) {
      if (error.response.status === 429) {
        toast.error("slow down! you are creating notes too fast", {duration: 3000, icon: "XX",})
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className='btn btn-ghost mb-6'>
            <ArrowLeftIcon className='size-5'/>
              Back to Notes
          </Link>
          <div className='card bg-base-100'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className="label-text">Title</label>
                  <input type="text" placeholder='Note Title' className='input input-bordered' value={title} onChange={(e)=>setTitle(e.target.value)} />
                </div>
                <div className='form-control mb-4'>
                  <label className="label-text">Content</label>
                  <textarea type="text" placeholder='Note Content go here...' className='textarea textarea-bordered h-32' value={content} onChange={(e)=>setContent(e.target.value)} />
                </div>
                <div className="card-action justify-end">
                  <button type='submit' className='btn btn-primary' disabled={loading}>
                    { loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
```
- HomePage.jsx
```js
import { useState } from 'react'
import { useEffect } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import api from '../lib/axios';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);

      } catch (error) {
        console.log("Error fetching notes", error);
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

        {notes.length > 0 && !isRateLimited && (
          <div div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div>
                <NoteCard key={note._id} note={note} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
```
## Delete Functionality
- NoteCard.js
```js
import React from 'react'
import { Link } from "react-router";
import { Trash2Icon, PenSquareIcon } from "lucide-react";
import { formatDate } from '../lib/utils';
import toast from "react-hot-toast";
import api from "../lib/axios";

const NoteCard = ({ note, setNotes }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault(); // prevent navigation when click trash btn
        
        if (!window.confirm("are you sure deleting note")) return;

        try {
            await api.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter(note => note._id !== id));
            toast.success("Note deleted successfully");
        } catch (error) {
            toast.error("Failed to delete note", error);
        }

    }
  return (
      <div>
          <Link to={`/note/${note._id}`} className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-brown'>
              <div className='card-body'>
                  <h3 className='card-title text-base-content'>{note.title}</h3>
                  <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
                  <div className='card-actions justify-between items-center mt-4'>
                      <span>
                          {formatDate(new Date(note.createdAt))}
                      </span>
                      <div className='flex items-center gap-1'>
                          <button className='flex items-center gap-1'>
                              <PenSquareIcon className='size-4'/>
                          </button>
                          <button className='btn btn-xs text-error' onClick={(e)=>handleDelete(e, note._id)}>
                              <Trash2Icon className="size-4" />
                          </button>
                      </div>
                  </div>
              </div>
          </Link>
    </div>
  )
}

export default NoteCard
```
- HomePage.jsx
```js
import { useState } from 'react'
import { useEffect } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import api from '../lib/axios';
import NotesNotFound from '../components/NotesNotFound';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);

      } catch (error) {
        console.log("Error fetching notes", error);
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound/>}

        {notes.length > 0 && !isRateLimited && (
          <div div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div>
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
```
- NotesNotFound.js
```js
import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
          <div className="bg-primary/10 rounded-full p-8">
              <NotebookIcon className="size-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">No Notes yet</h3>
          <p className="text-base-content/70">
              Ready to organize your ideas? create your first note here
          </p>
          <Link to="/create" className="btn btn-primary">
          Create Your First Note
          </Link>
    </div>
  )
}

export default NotesNotFound
```

## Note Detail
- NoteDetailPage.jsx
```js
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router"; // Corrected import
import api from "../lib/axios";
import toast from "react-hot-toast";
import { LoaderIcon, ArrowLeftIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching note");
        // It's good practice to set loading to false even on error
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // conditionally render content based on loading state
  if (loading) {
    return <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <LoaderIcon className="animate-spin size-10" />
    </div>;
  }

  if (!note) {
    return <div>Note not found.</div>;
  }

  const handleDelete = async () => { 
    if (!window.confirm("Are you sure deleting note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete note");
    }
  };
  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("please add a title or content");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("failed to update note")
    } finally {
      setSaving(false);
    }
   };

  // build out the UI for displaying the note here
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button className="btn btn-error btn-outline" onClick={handleDelete}>
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input type="text" placeholder="Note Title" className="input input-bordered" value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea placeholder="write your note here..." className="textarea textarea-bordered h-32" value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} />
              </div>

              <div className="card-action justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
```

# Deployment
