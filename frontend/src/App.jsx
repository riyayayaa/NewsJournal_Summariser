import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ChatPopup from './components/ChatPopup'
import Journal from './pages/Journal'
import News from './pages/News'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <Navbar theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <Routes>
        <Route path="/" element={<Journal />} />
        <Route path="/news" element={<News />} />
      </Routes>
      <ChatPopup open={chatOpen} onToggle={() => setChatOpen(o => !o)} />
    </>
  )
}
