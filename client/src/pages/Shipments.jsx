import { useState, useEffect } from 'react'
import { SkeletonShipment } from '../components/Skeleton'
import socket from '../socket'

const getRiskColor = (score) => {
  if (score >= 80) return '#ff4444'
  if (score >= 50) return '#f59e0b'
  return '#00c896'
}

const statusBadge = (status) => {
  const map = {
    delayed: { cls: 'badge-red', label: 'DELAYED' },
    in_transit: { cls: 'badge-yellow', label: 'IN TRANSIT' },
    on_time: { cls: 'badge-green', label: 'ON TIME' }
  }
  return map[status] || { cls: 'badge-blue', label: status.toUpperCase() }
}

export default function Shipments() {
  const [shipments, setShipments] = useState([])
  const [selected, setSelected] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/shipments').then(r => r.json()).then(d => { 
      if (d.success) {
        setShipments(d.data)
        setPageLoading(false)
      }
    })
    socket.on('initial_data', ({ shipments: s }) => {
      setShipments(s)
      setPageLoading(false)
    })
    socket.on('shipment_update', ({ shipment }) => {
      setShipments(prev => prev.map(s => s.id === shipment.id ? shipment : s))
    })
    return () => { socket.off('initial_data'); socket.off('shipment_update') }
  }, [])

  const handleReroute = async (shipment) => {
    setSelected(shipment); setRoutes(null); setLoading(true)
    try {
      const res = await fetch(`/api/reroute/${shipment.id}`, { method: 'POST' })
      const data = await res.json()
      if (data.success) setRoutes(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filtered = filter === 'all' ? shipments : shipments.filter(s => s.status === filter)

  return (
    <div style={{ padding: '24px 32px', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>◈ Active Shipments</h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>
            {shipments.length} shipments tracked · Click "AI Reroute" on any delayed shipment
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'delayed', 'in_transit', 'on_time'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              fontFamily: 'var(--mono)',
              background: filter === f ? 'rgba(15, 157, 138, 0.15)' : 'transparent',
              color: filter === f ? '#0F9D8A' : '#cbd5e1',
              border: filter === f ? '1px solid rgba(15, 157, 138, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: '24px' }}>
        {/* Shipments table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pageLoading ? (
            Array(5).fill(0).map((_, i) => <SkeletonShipment key={i} />)
          ) : (
            filtered.map(s => {
              const badge = statusBadge(s.status)
              return (
                <div key={s.id} className="card" style={{
                  padding: '18px 20px',
                  borderColor: s.status === 'delayed' ? 'rgba(255,68,68,0.25)' : 'var(--border)',
                  animation: 'slideIn 0.3s ease'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#64748b' }}>{s.id}</span>
                      <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      {s.delay > 0 && (
                        <span style={{ fontSize: '12px', color: '#ff4444', fontFamily: 'var(--mono)' }}>
                          +{s.delay}h delay
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#f1f5f9' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#cbd5e1' }}>
                      <span>📍 {s.origin.city} → {s.destination.city}</span>
                      <span>📦 {s.cargo}</span>
                      <span>🕐 ETA: {s.estimatedArrival}</span>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Risk Score</span>
                      <div style={{ flex: 1, maxWidth: '200px' }}>
                        <div className="risk-bar">
                          <div className="risk-fill" style={{
                            width: `${s.riskScore}%`,
                            background: `linear-gradient(90deg, ${getRiskColor(s.riskScore)}, ${getRiskColor(s.riskScore)}88)`
                          }} />
                        </div>
                      </div>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: '13px',
                        color: getRiskColor(s.riskScore), fontWeight: 600
                      }}>
                        {Math.round(s.riskScore)}/100
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px', flexShrink: 0 }}>
                    {(s.affectedNodes || []).length > 0 && (
                      <span style={{
                        fontSize: '11px', color: '#f59e0b',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: '6px', padding: '4px 8px'
                      }}>
                        ⬢ {(s.affectedNodes || []).length} cascade risks
                      </span>
                    )}
                    <button
                      className="btn btn-outline"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                      onClick={() => handleReroute(s)}
                    >
                      🛣️ AI Reroute
                    </button>
                  </div>
                </div>
              </div>
            )
            })
          )}
        </div>

        {/* AI Reroute Panel */}
        {selected && (
          <div style={{ position: 'sticky', top: '80px', height: 'fit-content' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#f1f5f9' }}>🛣️ AI Reroute Options</span>
                <button onClick={() => { setSelected(null); setRoutes(null) }}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>

              <div style={{
                padding: '12px', borderRadius: '8px',
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.2)',
                marginBottom: '16px', fontSize: '13px', color: '#f1f5f9'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: '#f1f5f9' }}>{selected.name}</div>
                <div style={{ color: '#cbd5e1' }}>{selected.origin.city} → {selected.destination.city}</div>
                <div style={{ color: '#ff4444', marginTop: '4px' }}>Risk: {Math.round(selected.riskScore)}/100</div>
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#cbd5e1' }}>
                  <div style={{ fontSize: '28px', animation: 'pulse 1s infinite' }}>🤖</div>
                  <div style={{ marginTop: '8px', fontSize: '14px' }}>Gemini AI analyzing routes...</div>
                </div>
              )}

              {routes && routes.map((r, i) => (
                <div key={i} style={{
                  padding: '14px', borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: i === 0 ? 'rgba(0,200,150,0.05)' : 'var(--card)',
                  marginBottom: '10px'
                }}>
                  {i === 0 && (
                    <div className="badge badge-green" style={{ marginBottom: '8px', fontSize: '10px' }}>
                      ✓ RECOMMENDED
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{r.route}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>via {r.via}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    {[
                      ['⏱', r.timeImpact, r.timeImpact.includes('+') ? '#f59e0b' : '#00c896'],
                      ['💰', r.costImpact, '#f59e0b'],
                      ['🛡', r.riskReduction + ' safer', '#00c896'],
                    ].map(([icon, val, color], j) => (
                      <div key={j} style={{
                        textAlign: 'center', padding: '6px',
                        background: 'var(--bg3)', borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '14px' }}>{icon}</div>
                        <div style={{ fontSize: '11px', color, fontFamily: 'var(--mono)', marginTop: '2px' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{r.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
