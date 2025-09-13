import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  files: [
    {
      id: '1',
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VibeCode Demo</title>
</head>
<body>
    <h1>Welcome to VibeCode!</h1>
    <p>Start coding in the editor to see live preview.</p>
</body>
</html>`
    },
    {
      id: '2',
      name: 'style.css',
      content: `body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
    font-size: 18px;
    line-height: 1.6;
}`
    },
    {
      id: '3',
      name: 'script.js',
      content: `console.log('Welcome to VibeCode!');

document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.color = this.style.color === 'yellow' ? 'white' : 'yellow';
        });
    }
});
`
    }
  ],
  activeFile: '1'
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setActiveFile: (state, action) => {
      state.activeFile = action.payload
    },
    updateFileContent: (state, action) => {
      const { fileId, content } = action.payload
      const file = state.files.find(f => f.id === fileId)
      if (file) {
        file.content = content
      }
    },
    createFile: (state, action) => {
      const newFile = {
        id: Date.now().toString(),
        name: action.payload.name,
        content: action.payload.content || ''
      }
      state.files.push(newFile)
      state.activeFile = newFile.id
    },
    deleteFile: (state, action) => {
      const fileId = action.payload
      state.files = state.files.filter(f => f.id !== fileId)
      if (state.activeFile === fileId) {
        state.activeFile = state.files[0]?.id || null
      }
    }
  }
})

export const { setActiveFile, updateFileContent, createFile, deleteFile } = editorSlice.actions
export default editorSlice.reducer
