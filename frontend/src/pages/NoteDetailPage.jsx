import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/axios'; 
import { ArrowLeftIcon, Trash2Icon, SaveIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoaderIcon } from 'lucide-react';


const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(()=>{
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`)
        setNote(res.data);
      } catch (error) {
        toast.error("Failed to fetch the note")
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  },[id])

  const handleDelete = async () => {
    if(!window.confirm('Are you sure you want to delete this note?')) { return; }
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted successfully!')
      navigate('/');
    } catch (error) {
      console.log("Error deleting the note", error);
      toast.error('Failed to delete the note. Please try again.')
    }
  }

  const handleSave = async () => {
    if(!note.title.trim() || !note.content.trim()) {
      toast.error('Please fill in all fields')
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      toast.success('Note saved successfully!')
      navigate('/');
    } catch (error) {
      console.log("Error saving the note", error);
      toast.error('Failed to save the note. Please try again.')
    } finally {
      setSaving(false);
    }
  }

  if(loading){
    return (
     <div className='flex items-center justify-center min-h-screen bg-base-200'>
      <LoaderIcon className='animate-spin size-10'/>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className='btn btn-ghost'>
              <ArrowLeftIcon className='w-5 h-5'/>
              Back to Notes
            </Link>
            <button onClick={handleDelete} className='btn btn-error btn-outline'>
              <Trash2Icon className='w-5 h-5'/>
              Delete Note
            </button>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="mb-4 form-control">
                <label className='label'>
                  <span className='label-text'>Title</span>
                </label>
                <input 
                type="text" 
                placeholder='Note title' 
                className='input input-bordered' 
                value={note?.title || ''} 
                onChange={(e) => setNote({...note, title: e.target.value})}
                />
              </div>
              <div className="mb-4 form-control">
                <label className='label'>
                  <span className='label-text'>Content</span>
                </label>
                <textarea 
                placeholder='Note content' 
                className='h-40 textarea textarea-bordered'
                value={note?.content || ''}
                onChange={(e) => setNote({...note, content: e.target.value})}
                />
              </div>
              <div className="justify-end card-actions">
                <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage