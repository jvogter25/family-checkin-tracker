'use client'

import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setMessage(error.message)
        } else {
          router.push('/')
        }
      } else {
        const { error } = await signUp(email, password)
        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Account created successfully! You can now sign in.')
          setIsLogin(true)
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Family Check-In Tracker
        </h1>
        
        <div className="flex mb-6">
          <button
            onClick={() => {
              setIsLogin(true)
              setMessage('')
            }}
            className={`flex-1 py-2 px-4 rounded-l-md ${
              isLogin 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setMessage('')
            }}
            className={`flex-1 py-2 px-4 rounded-r-md ${
              !isLogin 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="At least 6 characters"
            />
          </div>

          {message && (
            <div className={`p-3 rounded ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 font-medium disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sign in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}