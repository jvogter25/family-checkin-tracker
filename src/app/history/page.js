'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'

export default function History() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCheckins()
  }, [])

  const fetchCheckins = async () => {
    try {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching check-ins:', error)
        return
      }

      setCheckins(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMoodColor = (mood) => {
    const colors = {
      'great': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'okay': 'bg-yellow-100 text-yellow-800',
      'concerning': 'bg-orange-100 text-orange-800',
      'difficult': 'bg-red-100 text-red-800'
    }
    return colors[mood] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading check-ins...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Check-in History</h1>
            <div className="flex space-x-2">
              <Link 
                href="/"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Check-in
              </Link>
              <Link 
                href="/calendar"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                View Calendar
              </Link>
            </div>
          </div>

          {checkins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No check-ins recorded yet.</p>
              <Link 
                href="/"
                className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
              >
                Record your first check-in
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {checkins.map((checkin) => (
                <div key={checkin.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{checkin.parent_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(checkin.mood)}`}>
                      {checkin.mood.charAt(0).toUpperCase() + checkin.mood.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">
                    {formatDate(checkin.created_at)}
                  </p>
                  
                  {checkin.notes && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                      {checkin.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}