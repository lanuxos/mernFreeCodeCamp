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