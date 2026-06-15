import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'

/* ══════════════════════════════════════════════════════════════════════════════
   NOISE CANVAS — film grain overlay on entire page
══════════════════════════════════════════════════════════════════════════════ */
function Noise() {
  const cvs = useRef(null)
  useEffect(() => {
    const c = cvs.current, ctx = c.getContext('2d')
    c.width = 200; c.height = 200
    let raf
    const draw = () => {
      const img = ctx.createImageData(200, 200)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0
        img.data[i] = img.data[i+1] = img.data[i+2] = v
        img.data[i+3] = 18
      }
      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={cvs} className="noise" />
}

/* ══════════════════════════════════════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════════════════════════════════════ */
function Cursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x:0, y:0 })
  const lag  = useRef({ x:0, y:0 })
  const raf  = useRef(null)
  const big  = useRef(false)

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY } }
    const over = e => {
      if (e.target.closest('a,button,.mag')) {
        big.current = true
        ring.current?.classList.add('big')
      }
    }
    const out = () => { big.current = false; ring.current?.classList.remove('big') }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)

    const loop = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.11
      lag.current.y += (pos.current.y - lag.current.y) * 0.11
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px)`
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px)`
      raf.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="c-dot"  />
      <div ref={ring} className="c-ring" />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   LOADER — terminal boot sequence
══════════════════════════════════════════════════════════════════════════════ */
function Loader({ onDone }) {
  const [lines, setLines] = useState([])
  const [done, setDone]   = useState(false)

  const sequence = [
    { text: '> initialising murali.ai ...', delay: 0 },
    { text: '> loading agent frameworks ... [OK]', delay: 400 },
    { text: '> connecting LangGraph orchestrator ... [OK]', delay: 800 },
    { text: '> RAG memory online ... 1247 embeddings loaded', delay: 1200 },
    { text: '> Groq inference engine ... 3ms latency', delay: 1600 },
    { text: '> 3 production systems online', delay: 2000 },
    { text: '> 11 global markets monitored', delay: 2300 },
    { text: '> all agents operational ✓', delay: 2700 },
    { text: '> launching portfolio ...', delay: 3100 },
  ]

  useEffect(() => {
    sequence.forEach(({ text, delay }) => {
      setTimeout(() => setLines(l => [...l, text]), delay)
    })
    setTimeout(() => setDone(true), 3800)
    setTimeout(onDone, 4400)
  }, [])

  return (
    <div className={`loader${done ? ' loader-out' : ''}`}>
      <div className="loader-inner">
        <div className="loader-logo">M://</div>
        {lines.map((l, i) => (
          <div key={i} className="loader-line">{l}</div>
        ))}
        {!done && <div className="loader-cursor">█</div>}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   ORB CANVAS
══════════════════════════════════════════════════════════════════════════════ */
function OrbCanvas() {
  const cvs   = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const raf   = useRef(null)

  useEffect(() => {
    const c = cvs.current, ctx = c.getContext('2d')
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    const pts = Array.from({ length: 280 }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi:   Math.acos(2 * Math.random() - 1),
      spd:   0.001 + Math.random() * 0.004,
      sz:    0.5 + Math.random() * 2,
      op:    0.1 + Math.random() * 0.9,
    }))

    const eyes = [{ ox: -0.25, oy: -0.09 }, { ox: 0.25, oy: -0.09 }]
    let t = 0

    const draw = () => {
      t += 0.005
      const W = c.width, H = c.height
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2, cy = H / 2
      const R  = Math.min(W, H) * 0.38
      const mx = mouse.current.x - c.getBoundingClientRect().left
      const my = mouse.current.y - c.getBoundingClientRect().top
      const dst = Math.hypot(mx - cx, my - cy)
      const lit = Math.max(0.02, 1 - dst / (R * 7))
      const dx = mx - cx, dy = my - cy
      const ang = Math.atan2(dy, dx)
      const lf  = Math.max(0, Math.cos(ang))

      // spotlight
      const spot = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(R * 3, dst * 1.5))
      spot.addColorStop(0,   `rgba(210,230,255,${0.18 * lit})`)
      spot.addColorStop(0.5, `rgba(90,150,255,${0.06 * lit})`)
      spot.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = spot; ctx.fillRect(0, 0, W, H)

      // halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.8)
      halo.addColorStop(0, 'rgba(15,50,180,0.20)')
      halo.addColorStop(0.5, 'rgba(5,15,80,0.08)')
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 2.8, 0, Math.PI * 2); ctx.fill()

      // sphere
      const sg = ctx.createRadialGradient(cx + dx * 0.32, cy + dy * 0.32, R * 0.02, cx, cy, R)
      sg.addColorStop(0,    `rgba(140,195,255,${0.42 + lf * 0.44})`)
      sg.addColorStop(0.28, `rgba(48,100,220,${0.46 + lf * 0.24})`)
      sg.addColorStop(0.68, 'rgba(8,22,90,0.80)')
      sg.addColorStop(1,    'rgba(2,4,22,0.98)')
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill()

      // rim light
      const rl = ctx.createRadialGradient(cx + Math.cos(ang)*R*0.82, cy + Math.sin(ang)*R*0.82, 0, cx, cy, R)
      rl.addColorStop(0,   `rgba(175,220,255,${0.62 * lit})`)
      rl.addColorStop(0.45, `rgba(55,138,255,${0.15 * lit})`)
      rl.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = rl; ctx.fill()

      // outer rings
      for (let i = 0; i < 3; i++) {
        const rr = R * (1.15 + i * 0.18)
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(60,130,255,${0.06 - i * 0.015})`
        ctx.lineWidth = 1; ctx.stroke()
      }

      // edge
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(80,148,255,${0.22 + lit * 0.3})`
      ctx.lineWidth = 1.5; ctx.stroke()

      // particles
      for (const p of pts) {
        p.theta += p.spd
        const sp = Math.sin(p.phi)
        const px = cx + R * sp * Math.cos(p.theta)
        const py = cy + R * sp * Math.sin(p.theta) * 0.48 + R * Math.cos(p.phi) * 0.28
        const pz = sp * Math.cos(p.theta)
        if (pz < -0.05) continue
        const pd = Math.hypot(px - mx, py - my)
        const pl = Math.max(0, 1 - pd / (R * 3.2))
        const al = p.op * (0.2 + pl * 0.8) * (0.38 + pz * 0.62)
        ctx.beginPath(); ctx.arc(px, py, p.sz * (0.4 + pz * 0.6), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(185,220,255,${al})`; ctx.fill()
      }

      // eyes
      for (const e of eyes) {
        const ex = cx + e.ox * R, ey = cy + e.oy * R, ER = R * 0.10
        const edx = mx - ex, edy = my - ey, ed = Math.hypot(edx, edy) || 1
        const px = ex + (edx/ed)*ER*0.35, py = ey + (edy/ed)*ER*0.35
        const ig = ctx.createRadialGradient(ex, ey, 0, ex, ey, ER)
        ig.addColorStop(0, 'rgba(175,218,255,0.96)')
        ig.addColorStop(0.5, 'rgba(55,115,240,0.80)')
        ig.addColorStop(1, 'rgba(5,28,130,0.55)')
        ctx.beginPath(); ctx.arc(ex, ey, ER, 0, Math.PI * 2); ctx.fillStyle = ig; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, ER*0.42, 0, Math.PI * 2); ctx.fillStyle = 'rgba(1,1,12,0.96)'; ctx.fill()
        ctx.beginPath(); ctx.arc(px - ER*0.1, py - ER*0.1, ER*0.1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.55+lit*0.35})`; ctx.fill()
      }

      // scan line
      const sy = cy - R + ((t * 65) % (R * 2))
      const sl = ctx.createLinearGradient(cx-R,0,cx+R,0)
      sl.addColorStop(0,'rgba(80,160,255,0)'); sl.addColorStop(0.5,'rgba(80,160,255,0.07)'); sl.addColorStop(1,'rgba(80,160,255,0)')
      ctx.fillStyle = sl; ctx.fillRect(cx-R, sy, R*2, 1.2)

      raf.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf.current); ro.disconnect(); window.removeEventListener('mousemove', onMove) }
  }, [])

  return <canvas ref={cvs} className="orb-canvas" />
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAGNETIC TEXT — runs away from cursor
══════════════════════════════════════════════════════════════════════════════ */
function MagText({ children, className }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width/2, cy = r.top + r.height/2
      const dx = e.clientX - cx, dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const maxD = 120
      if (dist < maxD) {
        const force = (maxD - dist) / maxD
        el.style.transform = `translate(${dx * force * 0.4}px,${dy * force * 0.4}px)`
      } else {
        el.style.transform = ''
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return <span ref={ref} className={`mag ${className||''}`} style={{display:'inline-block',transition:'transform 0.4s cubic-bezier(0.2,0.8,0.3,1)'}}>{children}</span>
}

/* ══════════════════════════════════════════════════════════════════════════════
   TICKER — horizontal scrolling tech stack
══════════════════════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = ['LangGraph','Groq Llama 3.3','FastAPI','React','TypeScript','ChromaDB','Tavily','RAG','LangChain','PostgreSQL','Three.js','LangSmith','Vercel','Render','Python 3.11','Docker','Pinecone','OpenAI','Mistral','Streamlit']
  const doubled = [...items, ...items]
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            {item} <span className="ticker-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   PROJECT CARD — expands on hover
══════════════════════════════════════════════════════════════════════════════ */
function Card({ num, name, desc, tech, link, accent }) {
  const [hov, setHov] = useState(false)
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"
      className={`card${hov?' hov':''}`} style={{'--a':accent}}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="card-num">{String(num).padStart(2,'0')}</div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-name">{name}</h3>
          <span className="card-arrow">↗</span>
        </div>
        <p className="card-desc">{desc}</p>
        <div className="card-pills">
          {tech.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
      <div className="card-line" />
    </a>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.rv').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ══════════════════════════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  useReveal()

  const projects = [
    {
      name: 'Enterprise AI OS',
      desc: '8 specialized agents running as an autonomous business OS. CEO agent delegates to Research, Sales, Finance, Marketing, Operations, Web Intelligence & Memory. Live Mission Control UI with SVG agent network graph.',
      tech: ['LangGraph','FastAPI','React','TypeScript','Three.js','PostgreSQL','Render','Vercel'],
      link: 'https://enterprise-ai-os-8mfz.vercel.app',
      accent: '#00e0ff',
    },
    {
      name: 'FinAgent Global',
      desc: 'AI Trading War Room across 11 global markets. 8-agent pipeline: News → RAG → Financial → Sentiment → Report → Fear & Greed → Comparison → Portfolio. BUY/HOLD/SELL in under 3 seconds.',
      tech: ['LangGraph','Groq Llama 3.3','ChromaDB','Tavily','Yahoo Finance','HuggingFace','Recharts'],
      link: 'https://finagent-ui.vercel.app',
      accent: '#ff3366',
    },
    {
      name: 'LexAI Legal',
      desc: '4-agent contract analyzer. Extractor → Risk Analyst → Negotiator → Summarizer. Scores clause risk, suggests alternatives, generates a full PDF report. Built end-to-end in 3 hours.',
      tech: ['LangChain','Groq','Streamlit','ReportLab','Python'],
      link: 'https://lexai-legal-negotiator.streamlit.app',
      accent: '#a78bfa',
    },
  ]

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Noise />
      <Cursor />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
     <div className="top-links">
  <a
    href="/Murali_Revuri_AI_Engineer.pdf"
    download
  >
    Download CV ↗
  </a>

  <a
    href="https://github.com/muralirevuri07-boop"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub ↗
  </a>

  <a
    href="https://linkedin.com/in/muralirevuri"
    target="_blank"
    rel="noopener noreferrer"
  >
    LinkedIn ↗
  </a>

  <a
    href="mailto:muralirevuri07@gmail.com"
  >
    Email ↗
  </a>
</div>
        <div className="hero-orb">
          <OrbCanvas />
        </div>
        <div className="hero-text">
          <p className="hero-eyebrow rv">AI Engineer · Multi-Agent Systems</p>
          <h1 className="hero-name">
            <MagText>Murali</MagText>
            {' '}
            <MagText>Revuri</MagText>
          </h1>
          <p className="hero-tagline rv" style={{transitionDelay:'0.15s'}}>
  I build agents that build systems.<br/>
  <span>Not demos. Production.</span>
</p>

<div className="hero-tech rv" style={{transitionDelay:'0.2s'}}>
  Python • LangGraph • FastAPI • React • RAG • PostgreSQL • OpenAI
</div>

<div className="hero-cta rv" style={{transitionDelay:'0.25s'}}>
  <a href="#work" className="btn-primary">View Work</a>
  <a href="mailto:muralirevuri07@gmail.com" className="btn-ghost">
    Hire Me
  </a>
</div>
</div>
        <div className="scroll-cue">
          <div className="scroll-line"/>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div className="ticker-section">
        <Ticker />
      </div>

      {/* ── WORK ─────────────────────────────────────────── */}
      <section className="s" id="work">
        <div className="s-head rv">
          <span className="eyebrow">Selected Work</span>
          <h2 className="s-title">Three systems.<br/>All deployed.<br/>All working.</h2>
        </div>
        <div className="cards">
          {projects.map((p,i) => (
            <div className="rv" key={p.name} style={{transitionDelay:`${i*0.1}s`}}>
              <Card num={i+1} {...p}/>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section className="s about-s">
        <div className="about-grid">
          <div className="about-left rv">
            <span className="eyebrow">About</span>
            <p>4 years in account management. Then I decided to build AI systems instead of managing accounts.</p>
            <p>No bootcamp. No CS degree. Just building, deploying, and shipping — one agent at a time.</p>
            <p>Based in Hyderabad. Looking for AI engineering roles in London. Visa sponsorship required.</p>
          </div>
          <div className="about-right rv" style={{transitionDelay:'0.12s'}}>
            <div className="tl">
              <div className="tl-item"><span>2020–2024</span><p>Account Management</p></div>
              <div className="tl-item"><span>Late 2024</span><p>Started building AI agents</p></div>
              <div className="tl-item"><span>2025</span><p>First multi-agent system deployed</p></div>
              <div className="tl-item active"><span>2026</span><p>3 production AI systems deployed</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="s contact-s">
        <h2 className="contact-head rv">
          Let's build<br/>
          <em>something</em><br/>
          remarkable.
        </h2>
        <div className="contact-links rv" style={{transitionDelay:'0.1s'}}>
          <a href="mailto:muralirevuri07@gmail.com" className="contact-email">
  muralirevuri07@gmail.com ↗
</a>
          <div className="contact-social">
            <a href="https://github.com/muralirevuri07-boop" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/muralirevuri" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      <footer>
        <span>Murali Revuri · AI Engineer · 2026</span>
        <span>London & Remote · Visa sponsorship required</span>
      </footer>
    </>
  )
}
