import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const PreviewContainer = styled.div`
  flex: 1;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
`

const PreviewHeader = styled.div`
  height: 30px;
  background: #2d2d30;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  color: #cccccc;
  justify-content: space-between;
`

const PreviewFrame = styled.iframe`
  flex: 1;
  border: none;
  background: white;
  width: 100%;
`

const RefreshButton = styled.button`
  background: #0e639c;
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  
  &:hover {
    background: #1177bb;
  }
`

const LivePreview = () => {
  const [previewContent, setPreviewContent] = useState('')
  const { files } = useSelector(state => state.editor)

  useEffect(() => {
    generatePreview()
  }, [files])

  const generatePreview = () => {
    const htmlFile = files.find(file => file.name.endsWith('.html'))
    const cssFile = files.find(file => file.name.endsWith('.css'))
    const jsFile = files.find(file => file.name.endsWith('.js'))

    let html = htmlFile?.content || '<h1>No HTML file found</h1>'
    const css = cssFile?.content || ''
    const js = jsFile?.content || ''

    // Inject CSS and JS into HTML
    if (css) {
      html = html.replace('</head>', `<style>${css}</style></head>`)
    }
    if (js) {
      html = html.replace('</body>', `<script>${js}</script></body>`)
    }

    // If no proper HTML structure, wrap in basic HTML
    if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
      html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
        </html>
      `
    }

    setPreviewContent(html)
  }

  const handleRefresh = () => {
    generatePreview()
  }

  return (
    <PreviewContainer>
      <PreviewHeader>
        Live Preview
        <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton>
      </PreviewHeader>
      <PreviewFrame
        srcDoc={previewContent}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </PreviewContainer>
  )
}

export default LivePreview
