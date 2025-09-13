import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  output: [],
  isConnected: false,
  currentDirectory: '/',
  history: []
}

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addOutput: (state, action) => {
      state.output.push({
        id: Date.now(),
        content: action.payload,
        timestamp: new Date().toISOString()
      })
    },
    clearOutput: (state) => {
      state.output = []
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload
    },
    setCurrentDirectory: (state, action) => {
      state.currentDirectory = action.payload
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload)
      if (state.history.length > 100) {
        state.history = state.history.slice(-100)
      }
    }
  }
})

export const { 
  addOutput, 
  clearOutput, 
  setConnected, 
  setCurrentDirectory, 
  addToHistory 
} = terminalSlice.actions

export default terminalSlice.reducer
