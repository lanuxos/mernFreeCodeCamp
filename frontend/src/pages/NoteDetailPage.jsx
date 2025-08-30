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