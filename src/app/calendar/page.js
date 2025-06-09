'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'

export default function Calendar() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateCheckins, setSelectedDateCheckins] = useState([])
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchCheckins()
    }
  }, [user])

  const fetchCheckins = async () => {
    try {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
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

  const getMoodColor = (mood) => {
    const colors = {
      'great': 'bg-green-500',
      'good': 'bg-blue-500',
      'okay': 'bg-yellow-500',
      'concerning': 'bg-orange-500',
      'difficult': 'bg-red-500'
    }
    return colors[mood] || 'bg-gray-500'
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getCheckinsForDate = (day) => {
    if (!day) return []
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const targetDate = new Date(year, month, day)
    
    return checkins.filter(checkin => {
      const checkinDate = new Date(checkin.created_at)
      return checkinDate.toDateString() === targetDate.toDateString()
    })
  }

  const handleDateClick = (day) => {
    if (!day) return
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const clickedDate = new Date(year, month, day)
    
    setSelectedDate(clickedDate)
    setSelectedDateCheckins(getCheckinsForDate(day))
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading calendar...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Check-in Calendar</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <div className="flex space-x-2">
                <Link 
                  href="/"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Check-in
                </Link>
                <Link 
                  href="/history"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  View History
                </Link>
                <button 
                  onClick={signOut}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={previousMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={nextMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const dayCheckins = getCheckinsForDate(day)
              return (
                <div 
                  key={index}
                  className={`p-2 h-16 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    day ? 'bg-white' : 'bg-gray-100'
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div className="font-medium">{day}</div>
                      <div className="flex space-x-1 mt-1">
                        {dayCheckins.slice(0, 3).map((checkin, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full ${getMoodColor(checkin.mood)}`}
                            title={`${checkin.parent_name} - ${checkin.mood}`}
                          />
                        ))}
                        {dayCheckins.length > 3 && (
                          <div className="text-xs text-gray-500">+{dayCheckins.length - 3}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">
                Check-ins for {formatDate(selectedDate)}
              </h3>
              {selectedDateCheckins.length === 0 ? (
                <p className="text-gray-600">No check-ins recorded for this date.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDateCheckins.map((checkin) => (
                    <div key={checkin.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{checkin.parent_name}</h4>
                          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            checkin.mood === 'great' ? 'bg-green-100 text-green-800' :
                            checkin.mood === 'good' ? 'bg-blue-100 text-blue-800' :
                            checkin.mood === 'okay' ? 'bg-yellow-100 text-yellow-800' :
                            checkin.mood === 'concerning' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {checkin.mood.charAt(0).toUpperCase() + checkin.mood.slice(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(checkin.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {checkin.notes && (
                        <p className="mt-2 text-gray-700">{checkin.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}