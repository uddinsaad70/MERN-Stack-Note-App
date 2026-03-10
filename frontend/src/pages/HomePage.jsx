import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../lib/axios'
import toast from 'react-hot-toast'

import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import NoteCard from '../components/NoteCard'
const HomePage = () => {
  const [isRateLimited, setRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error);
        if (error.response?.status === 429) { // error.response && error.response.status === 429
          setRateLimited(true);
        } 
        else{
          toast.error("An error occurred while fetching notes");
        } 
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [])
  return (
    <div className='min-h-screen'>
      <Navbar />
      {isRateLimited && <RateLimitedUI/>}
      <div className="p-4 mx-auto mt-6 max-w-7xl">
        {loading && <div className="py-10 text-center text-primary">Loading Notes...</div>}
        {notes.length !== 0 && !isRateLimited && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              notes.map((note) =>(
                <NoteCard key={note._id} note={note} />
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage