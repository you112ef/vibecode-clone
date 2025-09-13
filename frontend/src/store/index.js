import { configureStore } from '@reduxjs/toolkit'
import editorSlice from './slices/editorSlice'
import terminalSlice from './slices/terminalSlice'
import settingsSlice from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    editor: editorSlice,
    terminal: terminalSlice,
    settings: settingsSlice
  }
})
