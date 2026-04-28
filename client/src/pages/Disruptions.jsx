import { useState, useEffect } from 'react'
import { SkeletonDisruption } from '../components/Skeleton'
import socket from '../socket'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const SEVERITY_COLOR = { critical: '#ff4444', high: '#ff6b35', medium: '#f59e0b', low: '#00c896' }
const TYPE_ICON = { weather: '🌧️', traffic: '🚧', operational: '⚙️', default: '⚠️' }

export default function Disruptions() {
  const [disruptions, setDisruptions] = useState([])
  const [liveAlerts, setLiveAlerts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/disruptions`).then(r => r.json()).then(d => { 
      if (d.success) {
        setDisruptions(d.data)
        setLoading(false)
      }
    })
    socket.on('initial_data', ({ disruptions: d }) => {
      setDisruptions(d)
      setLoading(false)
    })
    socket.on('disruption_alert', (alert) => {
      setLiveAlerts(prev => [{ ...alert, isNew: true }, ...prev].slice(0, 10))
    })
    return () => { socket.off('initial_data'); socket.off('disruption_alert') }
  }, [])

  const filtered = filter === 'all'
    ? disruptions
    : disruptions.filter(d => d.status === filter || d.severity === filter)

  return (
    <div style={{ padding: '24px 32px', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>◉ Disruption Intelligence</h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>
            Live disruption feed + AI-predicted threats
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'active', 'resolved', 'critical', 'high', 'medium'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontSize: '11px', fontWeight: 600,
              fontFamily: 'var(--mono)',
              background: filter === f ? 'rgba(15, 157, 138, 0.15)' : 'transparent',
              color: filter === f ? '#0F9D8A' : '#cbd5e1',
              border: filter === f ? '1px solid rgba(15, 157, 138, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            }}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* Disruptions list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonDisruption key={i} />)
          ) : (
            filtered.map(d => {
              const sColor = SEVERITY_COLOR[d.severity] || '#7ba8c4'
              const icon = TYPE_ICON[d.type] || TYPE_ICON.default
              return (
                <div key={d.id} className="card" style={{
                  padding: '20px',
                  borderLeft: `3px solid ${sColor}`,
                  borderColor: `${sColor}44`,
                  borderLeftColor: sColor,
                  animation: 'slideIn 0.3s ease'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{icon}</span>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px',
                        background: `${sColor}22`, color: sColor,
                        border: `1px solid ${sColor}44`,
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'
                      }}>{d.severity}</span>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px',
                        background: d.status === 'active' ? 'rgba(255,68,68,0.1)' : 'rgba(0,200,150,0.1)',
                        color: d.status === 'active' ? '#ff4444' : '#00c896',
                        border: `1px solid ${d.status === 'active' ? 'rgba(255,68,68,0.2)' : 'rgba(0,200,150,0.2)'}`,
                        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'
                      }}>{d.status}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{d.id}</span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px', color: '#f1f5f9' }}>{d.location}</div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px' }}>{d.description}</div>

                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#64748b' }}>
                      <span>⏰ Detected: {d.detectedAt}</span>
                      <span>🔮 Predicted at: {d.predictedAt}</span>
                    </div>

                    {d.affectedShipments.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Affected shipments:</span>
                        {d.affectedShipments.map(sid => (
                          <span key={sid} style={{
                            padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(255,68,68,0.1)',
                            color: '#ff4444', fontSize: '11px',
                            fontFamily: 'var(--mono)', fontWeight: 600
                          }}>{sid}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginLeft: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>TYPE</div>
                    <div style={{ fontSize: '13px', textTransform: 'capitalize', color: 'var(--text2)' }}>{d.type}</div>
                  </div>
                </div>
              </div>
            )
            })
          )}
        </div>

        {/* Live feed sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>📡 Real-time Feed</span>
              <span className="live-dot"></span>
            </div>
            {liveAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '24px',
                color: 'var(--text3)', fontSize: '13px'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📡</div>
                Monitoring all active routes...<br />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>Updates every 15 seconds</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {liveAlerts.map((a, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: '8px',
                    background: `${SEVERITY_COLOR[a.severity] || '#f59e0b'}11`,
                    border: `1px solid ${SEVERITY_COLOR[a.severity] || '#f59e0b'}22`,
                    animation: 'slideIn 0.3s ease'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: SEVERITY_COLOR[a.severity] || '#f59e0b', marginBottom: '3px' }}>
                      {TYPE_ICON[a.type]} {a.type.toUpperCase()} · {a.location}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{a.description}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px', fontFamily: 'var(--mono)' }}>
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>📊 Disruption Summary</div>
            {[
              ['Critical', disruptions.filter(d => d.severity === 'critical').length, '#ff4444'],
              ['High', disruptions.filter(d => d.severity === 'high').length, '#ff6b35'],
              ['Medium', disruptions.filter(d => d.severity === 'medium').length, '#f59e0b'],
              ['Resolved', disruptions.filter(d => d.status === 'resolved').length, '#00c896'],
            ].map(([label, count, color]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid var(--border2)'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{label}</span>
                <span style={{
                  fontFamily: 'var(--mono)', fontWeight: 700,
                  color, fontSize: '16px'
                }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
