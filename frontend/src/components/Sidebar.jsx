import React, { useState } from 'react'
import styled from 'styled-components'
import { FiFile, FiFolder, FiSettings, FiPlay, FiTerminal } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveFile, createFile, deleteFile } from '../store/slices/editorSlice'

const SidebarContainer = styled.div`
  width: 250px;
  background: #252526;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #333;
  font-weight: bold;
  color: #cccccc;
`

const FileExplorer = styled.div`
  flex: 1;
  padding: 8px;
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px 0;
  background: ${props => props.active ? '#094771' : 'transparent'};
  
  &:hover {
    background: #2a2d2e;
  }
  
  svg {
    margin-right: 8px;
  }
`

const ActionButtons = styled.div`
  padding: 12px;
  border-top: 1px solid #333;
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  background: #0e639c;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  
  &:hover {
    background: #1177bb;
  }
`

const Sidebar = () => {
  const dispatch = useDispatch()
  const { files, activeFile } = useSelector(state => state.editor)
  const [newFileName, setNewFileName] = useState('')

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:')
    if (fileName) {
      dispatch(createFile({ name: fileName, content: '' }))
    }
  }

  const handleRunCode = () => {
    // Implement code execution
    console.log('Running code...')
  }

  return (
    <SidebarContainer>
      <SidebarHeader>
        VibeCode Explorer
      </SidebarHeader>
      
      <FileExplorer>
        {files.map(file => (
          <FileItem 
            key={file.id}
            active={file.id === activeFile}
            onClick={() => dispatch(setActiveFile(file.id))}
          >
            <FiFile size={16} />
            {file.name}
          </FileItem>
        ))}
      </FileExplorer>
      
      <ActionButtons>
        <ActionButton onClick={handleCreateFile}>
          <FiFile size={14} />
          New
        </ActionButton>
        <ActionButton onClick={handleRunCode}>
          <FiPlay size={14} />
          Run
        </ActionButton>
      </ActionButtons>
    </SidebarContainer>
  )
}

export default Sidebar
