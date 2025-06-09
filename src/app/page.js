'use client'

import { useState } from 'react'
import { supabase } from './supabase'
import Link from 'next/link'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const [parentName, setParentName] = useState('')
  const [mood, setMood] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Save to Supabase with user_id
      const { data, error } = await supabase
        .from('checkins')
        .insert([
          {
            parent_name: parentName,
            mood: mood,
            notes: notes,
            user_id: user.id
          }
        ])

      if (error) {
        console.error('Error saving check-in:', error)
        alert('Error saving check-in. Please try again.')
        return
      }

      // Show success message
      setSubmitted(true)
      console.log('Check-in saved successfully:', data)
      
      // Reset form
      setParentName('')
      setMood('')
      setNotes('')
      
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving check-in. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Check-in Recorded!</h1>
          <p className="text-gray-600 mb-4">Thanks for checking in on {parentName}</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Add Another Check-in
          </button>
          <div className="mt-4">
            <Link 
              href="/history"
              className="text-blue-500 hover:text-blue-700 underline mr-4"
            >
              View History
            </Link>
            <Link 
              href="/calendar"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Family Check-In Tracker
        </h1>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          <button 
            onClick={signOut}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Name
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Mom, Dad, Grandma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How were they today?
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select mood...</option>
              <option value="great">Great - energetic and happy</option>
              <option value="good">Good - normal day</option>
              <option value="okay">Okay - a bit tired</option>
              <option value="concerning">Concerning - not themselves</option>
              <option value="difficult">Difficult day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any specific details, concerns, or highlights from today..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 font-medium"
          >
            Record Check-in
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <div>
            <Link 
              href="/history"
              className="text-blue-500 hover:text-blue-700 underline mr-4"
            >
              View History
            </Link>
            <Link 
              href="/calendar"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}