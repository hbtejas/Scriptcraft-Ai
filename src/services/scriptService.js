import { supabase, TABLES } from '../lib/supabase'

// Fetch all scripts for the current user
export const fetchUserScripts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PODCAST_SCRIPTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching scripts:', error)
    return { data: null, error }
  }
}

// Fetch a single script by ID
export const fetchScriptById = async (scriptId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PODCAST_SCRIPTS)
      .select('*')
      .eq('id', scriptId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching script:', error)
    return { data: null, error }
  }
}

// Create a new script
export const createScript = async (scriptData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PODCAST_SCRIPTS)
      .insert([scriptData])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating script:', error)
    return { data: null, error }
  }
}

// Update an existing script
export const updateScript = async (scriptId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PODCAST_SCRIPTS)
      .update(updates)
      .eq('id', scriptId)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating script:', error)
    return { data: null, error }
  }
}

// Delete a script
export const deleteScript = async (scriptId) => {
  try {
    const { error } = await supabase
      .from(TABLES.PODCAST_SCRIPTS)
      .delete()
      .eq('id', scriptId)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting script:', error)
    return { error }
  }
}
