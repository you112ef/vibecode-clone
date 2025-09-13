import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'Fira Code',
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  autoSave: true,
  formatOnSave: true,
  aiProvider: 'openai',
  apiKey: ''
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action) => {
      const { key, value } = action.payload
      state[key] = value
    },
    updateSettings: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetSettings: (state) => {
      return initialState
    }
  }
})

export const { updateSetting, updateSettings, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer
