import React, { useState } from 'react'
import styled from 'styled-components'
import { FiSave, FiRefreshCw } from 'react-icons/fi'

const SettingsContainer = styled.div`
  padding: 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  height: 100vh;
  overflow-y: auto;
`

const SettingsHeader = styled.h1`
  color: #ffffff;
  margin-bottom: 30px;
  font-size: 24px;
`

const SettingsSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #252526;
  border-radius: 6px;
  border: 1px solid #333;
`

const SectionTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 18px;
`

const SettingItem = styled.div`
  margin-bottom: 15px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  color: #d4d4d4;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0e639c;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  color: #d4d4d4;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0e639c;
  }
`

const Button = styled.button`
  background: #0e639c;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 10px;
  font-size: 14px;
  
  &:hover {
    background: #1177bb;
  }
`

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: '14',
    fontFamily: 'Fira Code',
    tabSize: '2',
    wordWrap: 'on',
    minimap: true,
    lineNumbers: true,
    autoSave: true,
    formatOnSave: true,
    aiProvider: 'openai',
    apiKey: ''
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    localStorage.setItem('vibecode-settings', JSON.stringify(settings))
    console.log('Settings saved!')
  }

  const handleReset = () => {
    const defaultSettings = {
      theme: 'dark',
      fontSize: '14',
      fontFamily: 'Fira Code',
      tabSize: '2',
      wordWrap: 'on',
      minimap: true,
      lineNumbers: true,
      autoSave: true,
      formatOnSave: true,
      aiProvider: 'openai',
      apiKey: ''
    }
    setSettings(defaultSettings)
  }

  return (
    <SettingsContainer>
      <SettingsHeader>Settings</SettingsHeader>

      <SettingsSection>
        <SectionTitle>Editor</SectionTitle>
        
        <SettingItem>
          <Label>Theme</Label>
          <Select 
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="high-contrast">High Contrast</option>
          </Select>
        </SettingItem>

        <SettingItem>
          <Label>Font Size</Label>
          <Input 
            type="number"
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            min="8"
            max="32"
          />
        </SettingItem>

        <SettingItem>
          <Label>Font Family</Label>
          <Select 
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
          >
            <option value="Fira Code">Fira Code</option>
            <option value="Monaco">Monaco</option>
            <option value="Consolas">Consolas</option>
            <option value="JetBrains Mono">JetBrains Mono</option>
          </Select>
        </SettingItem>

        <SettingItem>
          <Label>Tab Size</Label>
          <Select 
            value={settings.tabSize}
            onChange={(e) => handleSettingChange('tabSize', e.target.value)}
          >
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
          </Select>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>AI Integration</SectionTitle>
        
        <SettingItem>
          <Label>AI Provider</Label>
          <Select 
            value={settings.aiProvider}
            onChange={(e) => handleSettingChange('aiProvider', e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="cohere">Cohere</option>
          </Select>
        </SettingItem>

        <SettingItem>
          <Label>API Key</Label>
          <Input 
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleSettingChange('apiKey', e.target.value)}
            placeholder="Enter your AI provider API key"
          />
        </SettingItem>
      </SettingsSection>

      <div>
        <Button onClick={handleSave}>
          <FiSave size={16} />
          Save Settings
        </Button>
        <Button onClick={handleReset}>
          <FiRefreshCw size={16} />
          Reset to Defaults
        </Button>
      </div>
    </SettingsContainer>
  )
}

export default Settings
