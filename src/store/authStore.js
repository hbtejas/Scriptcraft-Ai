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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        // Better error messages
        if (error.message.includes('already registered')) {
          return { data: null, error: { message: 'This email is already registered. Please sign in.' } }
        }
        if (error.message.includes('Password')) {
          return { data: null, error: { message: 'Password must be at least 6 characters' } }
        }
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('Sign up error:', err)
      return { data: null, error: { message: 'Failed to sign up. Please try again.' } }
    }
  },
  
  // Sign in with email
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Better error messages
        if (error.message.includes('Invalid login credentials')) {
          return { data: null, error: { message: 'Invalid email or password' } }
        }
        if (error.message.includes('Email not confirmed')) {
          return { data: null, error: { message: 'Please verify your email before signing in' } }
        }
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('Sign in error:', err)
      return { data: null, error: { message: 'Failed to sign in. Please check your connection.' } }
    }
  },
  
  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
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
