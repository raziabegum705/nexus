import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const STATS = [
  { label: 'Active Shipments', value: 9, suffix: '' },
  { label: 'Disruptions Detected', value: 4, suffix: '' },
  { label: 'Avg Response Time', value: 6, suffix: 'min' },
  { label: 'Routes Optimized', value: 247, suffix: '+' },
]

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = target / 60
    const timer = setInterval(() => {
      setCount(c => {
        if (c >= target) { clearInterval(timer); return target }
        return Math.min(c + step, target)
      })
    }, 20)
    return () => clearInterval(timer)
  }, [target])
  return <>{Math.round(count)}{suffix}</>
}

export default function Landing() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(5,150,105,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(5,150,105,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Gradient orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(0,0,0,0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #059669, #2563eb)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '18px', color: '#fff'
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '3px', color: '#0f172a' }}>NEXUS</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', fontSize: '13px' }}>
          {time.toUTCString().replace('GMT', 'UTC')}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', textAlign: 'center',
        gap: '28px'
      }}>
        <div className="badge badge-green" style={{ fontSize: '12px', padding: '6px 16px' }}>
          <span className="live-dot" style={{ marginRight: '6px' }}></span>
          DISASTER LOGISTICS INTELLIGENCE PLATFORM
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 700, lineHeight: 1.1,
          letterSpacing: '-2px', maxWidth: '900px'
        }}>
          Predict. Route. Deliver.
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #059669, #2563eb)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Before It's Too Late.</span>
        </h1>

        <p style={{
          fontSize: '18px', color: 'var(--text2)',
          maxWidth: '580px', lineHeight: 1.7
        }}>
          AI-powered supply chain platform that detects disruptions 48 hours before they happen
          and auto-routes critical supplies to disaster zones.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}
            style={{ padding: '14px 32px', fontSize: '16px' }}>
            ⬡ Open Mission Control
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/simulate')}>
            ⬢ Try Cascade Simulator
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', marginTop: '20px', width: '100%', maxWidth: '800px'
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{
                fontSize: '36px', fontWeight: 700,
                fontFamily: 'var(--mono)',
                color: 'var(--green)'
              }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '6px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          {['⚡ 48hr Disruption Forecast', '🛣️ AI Auto-Rerouting', '📡 Live Socket Tracking',
            '🌊 Cascade Simulator', '🤖 Gemini-Powered'].map(f => (
            <div key={f} style={{
              padding: '8px 16px', borderRadius: '20px',
              border: '1px solid var(--border)',
              fontSize: '13px', color: 'var(--text2)',
              background: 'var(--card)'
            }}>{f}</div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          SDG 9 · SDG 11 · SDG 13 — Built for Google Solution Challenge
        </p>
      </div>
    </div>
  )
}
