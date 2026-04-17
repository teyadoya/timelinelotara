import { useState, useMemo, useCallback } from 'react'
import { DOCS, CAT_LABELS, categorize, parseDateKey, getYear } from './docs.js'

// ── Login Gate ────────────────────────────────────────────────────────────────
const CRED = { user: '616', pass: 'lotara' }

function LoginPage({ onLogin }) {
  const [user, setUser]   = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (user.trim() === CRED.user && pass === CRED.pass) {
        sessionStorage.setItem('kl_auth', '1')
        onLogin()
      } else {
        setError('Username atau password salah.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--paper)', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 14, padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,.08)'
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
          Kronologi Lotara
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 28, fontWeight: 300 }}>
          Masuk untuk melanjutkan
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              value={user}
              onChange={e => { setUser(e.target.value); setError('') }}
              placeholder="Username"
              autoComplete="username"
              style={{
                width: '100%', padding: '10px 12px',
                border: `1px solid ${error ? '#e05050' : 'var(--line2)'}`,
                borderRadius: 8, background: 'var(--paper)', color: 'var(--ink)',
                fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError('') }}
              placeholder="Password"
              autoComplete="current-password"
              style={{
                width: '100%', padding: '10px 12px',
                border: `1px solid ${error ? '#e05050' : 'var(--line2)'}`,
                borderRadius: 8, background: 'var(--paper)', color: 'var(--ink)',
                fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#c03030', marginBottom: 14, padding: '8px 12px', background: 'rgba(192,48,48,.08)', borderRadius: 6 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px', background: 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 600, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity .15s'
            }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}


async function exportPDF(docs) {
  const { jsPDF } = await import('jspdf')
  await import('jspdf-autotable')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFont('helvetica')
  doc.setFontSize(14)
  doc.text('Kronologi Lotara', 14, 14)
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text('Proyek KPBU Desalinasi Air Laut — Gili Matra, Kabupaten Lombok Utara', 14, 20)
  doc.text(
    `Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} | ${docs.length} dokumen`,
    14, 25
  )
  doc.setTextColor(0)
  const rows = docs.map((d, i) => [
    i + 1,
    d.tanggal || '—',
    d.nomor_surat && d.nomor_surat !== '-' ? d.nomor_surat : '—',
    d.perihal || '—',
    d.pengirim || '—',
    (d.ringkasan || '').substring(0, 220) + ((d.ringkasan?.length ?? 0) > 220 ? '...' : ''),
  ])
  doc.autoTable({
    startY: 30,
    head: [['No', 'Tanggal', 'Nomor Surat', 'Perihal', 'Pengirim', 'Ringkasan']],
    body: rows,
    styles: { fontSize: 6.5, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [20, 20, 20], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 7 }, 1: { cellWidth: 25 }, 2: { cellWidth: 33 },
      3: { cellWidth: 38 }, 4: { cellWidth: 40 }, 5: { cellWidth: 'auto' },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  })
  doc.save(`kronologi_lotara_${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ doc, onClose }) {
  const cat = categorize(doc.perihal)
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="dp">
        <button className="dp-close" onClick={onClose}>✕</button>
        <div className="dp-num">
          {doc.nomor_surat && doc.nomor_surat !== '-' ? doc.nomor_surat : '— Tanpa Nomor Surat —'}
        </div>
        <div className="dp-title">{doc.perihal || '—'}</div>
        <div className="dp-meta">
          <span className="dp-lbl">Tanggal</span>
          <span className="dp-val">{doc.tanggal || '—'}</span>
          <span className="dp-lbl">Pengirim</span>
          <span className="dp-val">{doc.pengirim || '—'}</span>
          <span className="dp-lbl">Kategori</span>
          <span className="dp-val">
            <span className={`cat-tag cat-${cat}`}>{CAT_LABELS[cat] ?? cat}</span>
          </span>
        </div>
        <div className="dp-div" />
        <div className="dp-rlbl">Ringkasan</div>
        <div className="dp-ring">{doc.ringkasan || '—'}</div>
      </div>
    </>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('kl_auth') === '1')
  const [search, setSearch]       = useState('')
  const [activeYear, setActiveYear] = useState(null)
  const [activeCat, setActiveCat]  = useState(null)
  const [selected, setSelected]    = useState(null)

  // Year counts
  const yearCounts = useMemo(() => {
    const c = {}
    DOCS.forEach(d => { const y = getYear(d.tanggal); if (y) c[y] = (c[y] ?? 0) + 1 })
    return c
  }, [])
  const years = useMemo(() => Object.keys(yearCounts).map(Number).sort((a, b) => a - b), [yearCounts])

  // Category counts
  const catCounts = useMemo(() => {
    const c = {}
    DOCS.forEach(d => { const cat = categorize(d.perihal); c[cat] = (c[cat] ?? 0) + 1 })
    return c
  }, [])

  // Filtered + sorted docs
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return DOCS
      .filter(d => {
        const yOk = activeYear === null || getYear(d.tanggal) === activeYear
        const cOk = activeCat  === null || categorize(d.perihal) === activeCat
        const sOk = !q || [d.perihal, d.nomor_surat, d.pengirim, d.tanggal, d.ringkasan]
          .some(v => (v ?? '').toLowerCase().includes(q))
        return yOk && cOk && sOk
      })
      .sort((a, b) => parseDateKey(a.tanggal) - parseDateKey(b.tanggal))
  }, [search, activeYear, activeCat])

  // Group by year
  const grouped = useMemo(() => {
    const groups = []
    let curYear = undefined
    filtered.forEach(d => {
      const y = getYear(d.tanggal)
      if (y !== curYear) { curYear = y; groups.push({ year: y, docs: [d] }) }
      else groups[groups.length - 1].docs.push(d)
    })
    return groups
  }, [filtered])

  const handleExport = useCallback(() => exportPDF(filtered), [filtered])

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />

  return (
    <div className="app">
      {/* Header */}
      <div className="hdr">
        <div className="hdr-top">
          <div>
            <div className="title">Kronologi Lotara</div>
            <div className="meta">Proyek KPBU Desalinasi Air Laut &middot; Gili Matra, Kabupaten Lombok Utara</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="s-icon">⌕</span>
          <input
            type="text"
            placeholder="Cari perihal, nomor surat, pengirim..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-accent" onClick={handleExport}>↓ Export PDF</button>
        <span className="count">{filtered.length}/{DOCS.length} dok</span>
      </div>

      {/* Filter panel */}
      <div className="filter-panel">
        <div className="filter-row">
          <span className="filter-lbl">Tahun</span>
          <div className="filter-pills">
            <button
              className={`yp${activeYear === null ? ' active' : ''}`}
              onClick={() => setActiveYear(null)}
            >
              Semua
            </button>
            {years.map(y => (
              <button
                key={y}
                className={`yp${activeYear === y ? ' active' : ''}`}
                onClick={() => setActiveYear(activeYear === y ? null : y)}
              >
                {y} <span style={{ opacity: 0.5, fontSize: 9, marginLeft: 2 }}>{yearCounts[y]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-sep" />

        <div className="filter-row">
          <span className="filter-lbl">Kategori</span>
          <div className="filter-pills">
            <button
              className={`cp${activeCat === null ? ' active' : ''}`}
              onClick={() => setActiveCat(null)}
            >
              Semua
            </button>
            {Object.entries(CAT_LABELS)
              .filter(([k]) => catCounts[k])
              .map(([k, label]) => (
                <button
                  key={k}
                  className={`cp${activeCat === k ? ' active' : ''}`}
                  onClick={() => setActiveCat(activeCat === k ? null : k)}
                >
                  {label} <span style={{ opacity: 0.5, fontSize: 9, marginLeft: 2 }}>{catCounts[k] ?? 0}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {filtered.length === 0 ? (
          <div className="no-results">Tidak ada dokumen yang cocok.</div>
        ) : (
          grouped.map(({ year, docs }) => (
            <div key={year ?? 'unknown'}>
              {year && (
                <div className="yr-marker">
                  <span className="yr-txt">{year}</span>
                </div>
              )}
              {docs.map((d, i) => {
                const cat = categorize(d.perihal)
                const isSel = selected?.id === d.id
                return (
                  <div
                    key={d.id}
                    className={`doc-item${isSel ? ' sel' : ''}`}
                    style={{ animationDelay: `${(i % 15) * 15}ms` }}
                  >
                    <div className="doc-dot" />
                    <div
                      className={`doc-card${isSel ? ' active' : ''}`}
                      onClick={() => setSelected(isSel ? null : d)}
                    >
                      <div className="dc-top">
                        <div className="dc-perihal">{d.perihal || '—'}</div>
                        <div className="dc-right">
                          <div className="dc-date">{d.tanggal || '—'}</div>
                          <span className={`cat-tag cat-${cat}`}>
                            {CAT_LABELS[cat] ?? cat}
                          </span>
                        </div>
                      </div>
                      {d.nomor_surat && d.nomor_surat !== '-' && (
                        <div className="dc-nomor">{d.nomor_surat}</div>
                      )}
                      <div className="dc-sender">
                        {(d.pengirim ?? '').length > 80
                          ? d.pengirim.substring(0, 80) + '...'
                          : d.pengirim}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel doc={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
