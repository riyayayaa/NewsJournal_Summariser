import { NavLink } from 'react-router-dom'
import { Sun, Moon, BookOpen, Newspaper, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ theme, toggleTheme }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass"
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem', height: '62px',
      }}
    >
      {/* Logo */}
      <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={16} color="#fff" fill="#fff" />
        </div>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.15rem', fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.01em'
        }}>
          News<em style={{ color: 'var(--accent)' }}>Journal</em>
        </span>
      </NavLink>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
        <NavLink to="/" style={navStyle} end>
          {({ isActive }) => (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '.35rem',
              padding: '.4rem .85rem', borderRadius: '8px',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              fontSize: '.88rem', fontWeight: 500,
              transition: 'all 0.2s'
            }}>
              <BookOpen size={15} /> Journal
            </span>
          )}
        </NavLink>
        <NavLink to="/news" style={navStyle}>
          {({ isActive }) => (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '.35rem',
              padding: '.4rem .85rem', borderRadius: '8px',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              fontSize: '.88rem', fontWeight: 500,
              transition: 'all 0.2s'
            }}>
              <Newspaper size={15} /> News Feed
            </span>
          )}
        </NavLink>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 .5rem' }} />

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
          style={{
            width: '36px', height: '36px', borderRadius: '9px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', transition: 'all 0.2s'
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>
      </div>
    </motion.nav>
  )
}

const navStyle = { textDecoration: 'none' }
