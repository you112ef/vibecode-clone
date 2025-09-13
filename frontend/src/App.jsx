import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import styled from 'styled-components'
import { store } from './store'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Terminal from './components/Terminal'
import LivePreview from './components/LivePreview'
import Settings from './components/Settings'
import { initializeSocket } from './services/socket'

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #1e1e1e;
  color: #ffffff;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const EditorArea = styled.div`
  flex: 1;
  display: flex;
`

const RightPanel = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #333;
`

function App() {
  useEffect(() => {
    initializeSocket()
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <AppContainer>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={
                <EditorArea>
                  <Editor />
                  <RightPanel>
                    <LivePreview />
                    <Terminal />
                  </RightPanel>
                </EditorArea>
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </Provider>
  )
}

export default App
