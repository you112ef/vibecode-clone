import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'
import { socket } from '../services/socket'

const TerminalContainer = styled.div`
  height: 300px;
  background: #1e1e1e;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
`

const TerminalHeader = styled.div`
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

const TerminalWrapper = styled.div`
  flex: 1;
  padding: 8px;
`

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    color: #ffffff;
  }
`

const TerminalComponent = () => {
  const terminalRef = useRef(null)
  const terminal = useRef(null)
  const fitAddon = useRef(null)

  useEffect(() => {
    if (terminalRef.current && !terminal.current) {
      // Initialize terminal
      terminal.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Monaco, Consolas, monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#aeafad',
          selection: '#264f78'
        }
      })

      fitAddon.current = new FitAddon()
      terminal.current.loadAddon(fitAddon.current)
      terminal.current.loadAddon(new WebLinksAddon())

      terminal.current.open(terminalRef.current)
      fitAddon.current.fit()

      terminal.current.writeln('VibeCode Terminal v1.0.0')
      terminal.current.writeln('Type "help" for available commands\r\n')
      terminal.current.write('$ ')

      // Handle terminal input
      let currentLine = ''
      terminal.current.onData(data => {
        if (data === '\r') {
          terminal.current.writeln('')
          handleCommand(currentLine.trim())
          currentLine = ''
          terminal.current.write('$ ')
        } else if (data === '\b' || data === '\x7f') {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            terminal.current.write('\b \b')
          }
        } else {
          currentLine += data
          terminal.current.write(data)
        }
      })

      // Socket events
      socket.on('terminal-output', (data) => {
        terminal.current.write(data)
      })

      // Resize handler
      const handleResize = () => {
        if (fitAddon.current) {
          fitAddon.current.fit()
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (terminal.current) {
          terminal.current.dispose()
        }
      }
    }
  }, [])

  const handleCommand = (command) => {
    switch (command) {
      case 'help':
        terminal.current.writeln('Available commands:')
        terminal.current.writeln('  help    - Show this help message')
        terminal.current.writeln('  clear   - Clear terminal')
        terminal.current.writeln('  ls      - List files')
        terminal.current.writeln('  run     - Execute current file')
        break
      case 'clear':
        terminal.current.clear()
        break
      case 'ls':
        terminal.current.writeln('index.html  style.css  script.js')
        break
      case 'run':
        terminal.current.writeln('Executing code...')
        socket.emit('run-code', { code: 'console.log("Hello World!")' })
        break
      default:
        if (command) {
          terminal.current.writeln(`Command not found: ${command}`)
        }
    }
  }

  const handleClear = () => {
    if (terminal.current) {
      terminal.current.clear()
      terminal.current.write('$ ')
    }
  }

  return (
    <TerminalContainer>
      <TerminalHeader>
        Terminal
        <ClearButton onClick={handleClear}>Clear</ClearButton>
      </TerminalHeader>
      <TerminalWrapper>
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
      </TerminalWrapper>
    </TerminalContainer>
  )
}

export default TerminalComponent
