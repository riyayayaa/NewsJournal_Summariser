import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ExternalLink } from 'lucide-react'

const CATEGORIES = ['general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment']

export default function News() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('general')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingUrl, setAddingUrl] = useState(null)
  const [added, setAdded] = useState(new Set())

  useEffect(() => { fetchNews() }, [category])

  async function fetchNews(q) {
    setLoading(true)
    const params = q ? `?q=${encodeURIComponent(q)}` : `?category=${category}`
    const res = await fetch('/api/news' + params)
    const data = await res.json()
    setArticles(data)
    setLoading(false)
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchNews(search)
  }

  async function addToJournal(article) {
    setAddingUrl(article.url)
    const content = [
      article.description,
      `Source: ${article.source}`,
      `Published: ${article.publishedAt?.slice(0, 10)}`,
      `URL: ${article.url}`
    ].filter(Boolean).join('\n\n')
    await fetch('/api/entries/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: article.title, content })
    })
    setAddingUrl(null)
    setAdded(s => new Set([...s, article.url]))
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '.6rem' }}>
            <em style={{ color: 'var(--accent2)' }}>Live</em> News Feed
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '.97rem' }}>
            Browse headlines and save any article to your journal instantly.
          </p>
        </motion.div>

        {/* Search */}
        <motion.form onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          style={{ display: 'flex', gap: '.6rem', maxWidth: '560px', margin: '0 auto 1.75rem' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search any topic..."
            style={{ fontSize: '1rem', padding: '.8rem 1.1rem' }} />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Search size={15} /> Search
          </button>
        </motion.form>

        {/* Category pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setCategory(cat); setSearch('') }}
              style={{
                padding: '.38rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
                fontSize: '.82rem', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                background: category === cat
                  ? 'linear-gradient(135deg, var(--accent), #9b8dff)'
                  : 'var(--surface)',
                color: category === cat ? '#fff' : 'var(--muted)',
                boxShadow: category === cat ? '0 4px 12px rgba(124,109,250,0.3)' : 'var(--shadow)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s'
              }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Articles grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              Loading headlines...
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
              {articles.map((a, i) => (
                <motion.div key={i} className="card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35, ease: [0.22,1,0.36,1] }}
                  style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '.55rem' }}
                >
                  <h3 style={{ fontSize: '.92rem', lineHeight: 1.45, fontStyle: 'italic' }}>
                    <a href={a.url} target="_blank" rel="noreferrer" style={{
                      color: 'var(--text)', textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text)'}>
                      {a.title}
                    </a>
                  </h3>

                  {a.description && (
                    <p style={{ color: 'var(--muted)', fontSize: '.81rem', lineHeight: 1.55 }}>
                      {a.description.slice(0, 110)}{a.description.length > 110 ? '…' : ''}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: 'var(--muted)', marginTop: 'auto' }}>
                    <span style={{ fontWeight: 500 }}>{a.source}</span>
                    <span>{a.publishedAt?.slice(0, 10)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '.5rem', paddingTop: '.4rem', borderTop: '1px solid var(--border)' }}>
                    <a href={a.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      <ExternalLink size={12} /> Read
                    </a>
                    <button className={`btn btn-sm ${added.has(a.url) ? 'btn-classify' : 'btn-ai'}`}
                      onClick={() => addToJournal(a)}
                      disabled={addingUrl === a.url || added.has(a.url)}
                      style={{ flex: 1, justifyContent: 'center' }}>
                      <Plus size={12} />
                      {addingUrl === a.url ? 'Adding…' : added.has(a.url) ? 'Saved ✓' : 'Save'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
