import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { updateFileContent } from '../store/slices/editorSlice'

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
`

const EditorHeader = styled.div`
  height: 35px;
  background: #2d2d30;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  color: #cccccc;
`

const EditorWrapper = styled.div`
  flex: 1;
  position: relative;
`

const CodeEditor = () => {
  const editorRef = useRef(null)
  const dispatch = useDispatch()
  const { files, activeFile } = useSelector(state => state.editor)
  
  const currentFile = files.find(file => file.id === activeFile)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure Monaco Editor themes and settings
    monaco.editor.defineTheme('vibecode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#aeafad',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41'
      }
    })
    monaco.editor.setTheme('vibecode-dark')
  }

  const handleEditorChange = (value) => {
    if (currentFile) {
      dispatch(updateFileContent({
        fileId: currentFile.id,
        content: value
      }))
    }
  }

  const getLanguage = (filename) => {
    const ext = filename.split('.').pop()
    const langMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown'
    }
    return langMap[ext] || 'plaintext'
  }

  return (
    <EditorContainer>
      <EditorHeader>
        {currentFile ? currentFile.name : 'No file selected'}
      </EditorHeader>
      <EditorWrapper>
        <Editor
          height="100%"
          language={currentFile ? getLanguage(currentFile.name) : 'javascript'}
          value={currentFile?.content || '// Select a file to start coding'}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: 'Fira Code, Monaco, Consolas, monospace',
            fontLigatures: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            tabSize: 2,
            insertSpaces: true
          }}
        />
      </EditorWrapper>
    </EditorContainer>
  )
}

export default CodeEditor
