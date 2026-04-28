import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonCard, LoadingOverlay } from '../components/Skeleton'

const NODE_POSITIONS = {
  SHP001: { x: 280, y: 200 },
  SHP002: { x: 160, y: 120 },
  SHP003: { x: 360, y: 300 },
  SHP004: { x: 480, y: 200 },
  SHP005: { x: 200, y: 300 },
  SHP006: { x: 100, y: 280 },
  SHP007: { x: 340, y: 120 },
  SHP008: { x: 460, y: 340 },
  SHP009: { x: 400, y: 380 }
}

const getRiskColor = (score) => {
  if (score >= 80) return '#ff4444'
  if (score >= 50) return '#f59e0b'
  return '#00c896'
}

export default function Simulate() {
  const navigate = useNavigate()
  const [shipments, setShipments] = useState([])
  const [selected, setSelected] = useState(null)
  const [cascadeData, setCascadeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animatedNodes, setAnimatedNodes] = useState(new Set())
  const [animatedEdges, setAnimatedEdges] = useState([])
  const animRef = useRef(null)

  useEffect(() => {
    fetch('/api/shipments')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setShipments(d.data)
          setError(null)
        } else {
          setError('Failed to load shipments')
        }
        setPageLoading(false)
      })
      .catch(err => {
        console.error('Error fetching shipments:', err)
        setError('Error loading shipments')
        setPageLoading(false)
      })
  }, [])

  const runSimulation = async (shipment) => {
    setSelected(shipment)
    setCascadeData(null)
    setAnimatedNodes(new Set())
    setAnimatedEdges([])
    setLoading(true)

    if (animRef.current) clearTimeout(animRef.current)

    try {
      const res = await fetch(`/api/cascade/${shipment.id}`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCascadeData(data.data)
        // Animate cascade
        animateNodes(shipment.id, data.data.cascadeChain)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const animateNodes = (rootId, chain) => {
    setAnimatedNodes(new Set([rootId]))
    chain.forEach((step, i) => {
      animRef.current = setTimeout(() => {
        setAnimatedNodes(prev => new Set([...prev, step.to]))
        setAnimatedEdges(prev => [...prev, `${step.from}-${step.to}`])
      }, (i + 1) * 600)
    })
  }

  const isNodeAffected = (id) => {
    if (!cascadeData) return false
    if (id === selected?.id) return true
    return cascadeData.cascadeChain.some(c => c.to === id)
  }

  const isEdgeAnimated = (from, to) => animatedEdges.includes(`${from}-${to}`)

  const allEdges = shipments.flatMap(s =>
    (s.affectedNodes || []).map(n => ({ from: s.id, to: n }))
  )

  return (
    <div style={{ padding: '24px 32px', minHeight: 'calc(100vh - 60px)' }}>
      {pageLoading && <LoadingOverlay />}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(15, 157, 138, 0.1)',
            border: '1px solid rgba(15, 157, 138, 0.2)',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            color: '#0F9D8A',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(5,150,105,0.15)'
            e.target.style.borderColor = 'rgba(5,150,105,0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(5,150,105,0.1)'
            e.target.style.borderColor = 'rgba(5,150,105,0.2)'
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>⬢ Cascade Failure Simulator</h1>
      </div>
      <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>
        Select any shipment node to simulate how its failure cascades through the entire supply chain
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* SVG Graph */}
        <div className="card" style={{ padding: '20px', position: 'relative', minHeight: '500px' }}>
          {error && (
            <div style={{
              padding: '16px',
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              borderRadius: '8px',
              color: '#dc2626',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              ⚠️ {error}. Make sure the backend is running on http://https://nexus-b0mf.onrender.com
            </div>
          )}
          {shipments.length === 0 && !error && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#cbd5e1',
              fontSize: '14px'
            }}>
              Loading shipments...
            </div>
          )}
          {shipments.length > 0 && (
            <div>
              <div style={{ marginBottom: '14px', fontSize: '13px', color: '#cbd5e1' }}>
                Click any node to simulate cascade failure
              </div>
              <svg
                width="100%" viewBox="0 0 600 500"
                style={{ cursor: 'pointer', display: 'block' }}
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(5,150,105,0.07)" strokeWidth="1"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="600" height="500" fill="url(#grid)" rx="8"/>

            {/* Edges */}
            {allEdges.map((edge, i) => {
              const from = NODE_POSITIONS[edge.from]
              const to = NODE_POSITIONS[edge.to]
              if (!from || !to) return null
              const isActive = isEdgeAnimated(edge.from, edge.to)
              return (
                <line key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isActive ? '#dc2626' : 'rgba(5,150,105,0.2)'}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeDasharray={isActive ? '0' : '4,4'}
                  style={{ transition: 'all 0.5s ease' }}
                />
              )
            })}

            {/* Cascade pulse lines */}
            {cascadeData && animatedEdges.map((edgeKey, i) => {
              const [fromId, toId] = edgeKey.split('-')
              const from = NODE_POSITIONS[fromId]
              const to = NODE_POSITIONS[toId]
              if (!from || !to) return null
              return (
                <line key={`pulse-${i}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="#ff4444" strokeWidth="3" opacity="0.6"
                  strokeDasharray="8,4"
                >
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.8s" fill="freeze"/>
                </line>
              )
            })}

            {/* Nodes */}
            {shipments.map(s => {
              const pos = NODE_POSITIONS[s.id]
              if (!pos) return null
              const isRoot = selected?.id === s.id
              const isAffected = isNodeAffected(s.id)
              const isAnimated = animatedNodes.has(s.id)
              const color = isRoot ? '#ff4444' : isAffected ? '#f59e0b' : getRiskColor(s.riskScore)

              return (
                <g key={s.id} transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => runSimulation(s)}
                  style={{ cursor: 'pointer' }}>

                  {/* Pulse ring for affected nodes */}
                  {isAnimated && (
                    <circle r="28" fill="none" stroke={color} strokeWidth="2" opacity="0.4">
                      <animate attributeName="r" values="20;36;20" dur="1.5s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                  )}

                  <circle r="20"
                    fill={isAnimated ? `${color}22` : 'rgba(255,255,255,0.95)'}
                    stroke={color}
                    strokeWidth={isRoot ? 3 : 2}
                    filter={isRoot ? 'url(#glow)' : ''}
                    style={{ transition: 'all 0.4s ease' }}
                  />

                  <text textAnchor="middle" dy="4" fill={color}
                    fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                    {s.id.replace('SHP', '')}
                  </text>

                  <text textAnchor="middle" dy="34" fill="#0F1419"
                    fontSize="9" fontFamily="Space Grotesk">
                    {s.origin.city}
                  </text>
                </g>
              )
            })}
              </svg>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                {[
                  ['#00c896', 'Low Risk'],
                  ['#f59e0b', 'Medium Risk / Cascaded'],
                  ['#ff4444', 'High Risk / Root Node'],
                ].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }}></div>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cascade results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!selected && (
            <div className="card" style={{
              padding: '40px 24px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px'
            }}>
              <div style={{ fontSize: '48px' }}>⬢</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>Select a node to simulate</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
                Click any shipment node on the graph to see how a single failure cascades
                through the entire supply chain network
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', animation: 'pulse 0.8s infinite' }}>⬢</div>
              <div style={{ marginTop: '12px', color: '#cbd5e1' }}>Simulating cascade...</div>
            </div>
          )}

          {cascadeData && !loading && (
            <>
              {/* Root node */}
              <div className="card" style={{
                padding: '18px',
                borderColor: 'rgba(255,68,68,0.3)'
              }}>
                <div className="badge badge-red" style={{ marginBottom: '10px' }}>ROOT FAILURE NODE</div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{cascadeData.root.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '4px' }}>
                  {cascadeData.root.origin.city} → {cascadeData.root.destination.city}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff4444', fontFamily: 'var(--mono)' }}>
                      {cascadeData.totalAffected}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>nodes affected</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--mono)' }}>
                      {cascadeData.totalDelayHours}h
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>total delay propagation</div>
                  </div>
                </div>
              </div>

              {/* Cascade chain */}
              {cascadeData.cascadeChain.length > 0 ? (
                <div className="card" style={{ padding: '18px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>
                    🌊 Cascade Chain
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cascadeData.cascadeChain.map((step, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        animation: `slideIn 0.3s ease ${i * 0.1}s both`
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          background: `rgba(255,${255 - step.depth * 60},68,0.15)`,
                          border: `1px solid rgba(255,68,68,${0.4 + step.depth * 0.1})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 700, color: '#ff4444',
                          fontFamily: 'var(--mono)'
                        }}>{step.depth}</div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>
                            {step.from} → {step.to}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text2)' }}>
                            {step.shipment.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#f59e0b', fontFamily: 'var(--mono)' }}>
                            {step.estimatedDelay}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)' }}>
                    No Cascade Risk
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '6px' }}>
                    This shipment has no downstream dependencies
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
