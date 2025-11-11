import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  
  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, loading: false })
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, loading: false })
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },
  
  // Sign up with email
  signUp: async (email, password, metadata = {}) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { 
          data: null, 
          error: { message: 'Email and password are required' } 
        }
      }

      if (password.length < 6) {
        return { 
          data: null, 
          error: { message: 'Password must be at least 6 characters long' } 
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          return { 
            data: null, 
            error: { message: 'This email is already registered. Please sign in.' } 
          }
        }
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Sign up error:', err)
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection and try again.' } 
      }
    }
  },
  
  // Sign in with email
  signIn: async (email, password) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { 
          data: null, 
          error: { message: 'Email and password are required' } 
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          return { 
            data: null, 
            error: { message: 'Invalid email or password' } 
          }
        }
        if (error.message.includes('Email not confirmed')) {
          return { 
            data: null, 
            error: { message: 'Please verify your email before signing in' } 
          }
        }
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Sign in error:', err)
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection and try again.' } 
      }
    }
  },
  
  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        console.error('Google sign in error:', error)
        return { 
          data: null, 
          error: { message: 'Failed to sign in with Google. Please try again.' } 
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Google OAuth error:', err)
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection and try again.' } 
      }
    }
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      set({ user: null, session: null })
    }
    return { error }
  },
  
  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },
  
  // Update password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  }
}))

export default useAuthStore
