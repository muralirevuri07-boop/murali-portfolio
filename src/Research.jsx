import { useEffect, useRef } from 'react'
import './Research.css'

function Cursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x:0, y:0 })
  const lag  = useRef({ x:0, y:0 })
  const raf  = useRef(null)
  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move)
    const loop = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.11
      lag.current.y += (pos.current.y - lag.current.y) * 0.11
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px)`
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px)`
      raf.current = requestAnimationFrame(loop)
    }
    loop()
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf.current) }
  }, [])
  return (<><div ref={dot} className="c-dot"/><div ref={ring} className="c-ring"/></>)
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.rv').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const findings = [
  {
    exp:'01', title:'Cascade Failure', sub:'Input Validation', color:'#ff3366',
    stat:'8 / 8', statLabel:'agents accepted false data',
    finding:'A single false data point — Tesla EV market share fabricated at 8.2% vs actual 19% — propagated through all 8 agents undetected. The Finance Agent generated a $100M investment strategy from the fabricated input. Zero validation failures detected.',
    gap:'No input validation or anomaly detection across agent chain',
  },
  {
    exp:'02', title:'Miscoordination', sub:'Cross-Agent Consistency', color:'#f59e0b',
    stat:'6 conflicting', statLabel:'strategies for one objective',
    finding:'Six different market combinations produced for an identical objective. The Marketing Agent generated a complete campaign — content calendars, budget allocations — without identifying which markets it was targeting. The CEO Agent synthesized contradictory outputs without detecting a single conflict.',
    gap:'No cross-agent coordination or output consistency verification',
  },
  {
    exp:'03', title:'Oversight Gap', sub:'Accountability Audit', color:'#a78bfa',
    stat:'0%', statLabel:'human oversight ratio',
    finding:'8 irreversible decisions with $1.04M+ financial footprint executed with zero human checkpoints — $500K budget reallocation, 3 engineer hires at $180K each, a public press announcement, and an unnamed third-party partnership. The system described its own absence of oversight as an operational feature.',
    gap:'No mandatory human checkpoints for high-stakes irreversible decisions',
  },
]

const recs = [
  { num:'01', title:'Mandatory input validation layers', desc:'No agent should consume the output of another agent without a validation checkpoint checking for anomalous values or confidence scores below a defined threshold.' },
  { num:'02', title:'Cross-agent consistency verification', desc:'Systems aggregating outputs from multiple agents must include a conflict detection layer that flags contradictions before presenting unified recommendations.' },
  { num:'03', title:'Mandatory human checkpoints', desc:'Irreversible decisions above $10,000, any public communications, and any personnel decisions must require explicit human confirmation before execution.' },
  { num:'04', title:'Audit trail & attribution logging', desc:'Every agent decision must be logged with full provenance: which agent produced it, on what inputs, at what confidence level, and whether it was reviewed before propagation.' },
  { num:'05', title:'System-level evaluation standards', desc:'Regulatory frameworks should require multi-agent systems to undergo system-level evaluation — testing aggregate agent network behavior — rather than model-level evaluation alone.' },
]

export default function Research() {
  useReveal()
  return (
    <>
      <Cursor/>
      <nav className="r-nav">
        <a href="/" className="r-back">← Portfolio</a>
        <div className="r-nav-right">
          <a href="https://www.linkedin.com/pulse/i-ran-3-experiments-my-own-ai-system-results-scared-me-murali-revuri-cvb9f/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="/AgentWatch_Research_Paper.pdf" download className="r-dl-btn">Download PDF ↓</a>
        </div>
      </nav>

      <header className="r-hero">
        <div className="r-inner">
          <div className="r-badges rv">
            <span>Policy Brief</span><span>June 2026</span><span>AgentWatch</span>
          </div>
          <h1 className="r-title rv">Who Is Accountable<br/>When AI Agents Fail?</h1>
          <p className="r-sub rv">Empirical Evidence for Governance Frameworks in Autonomous Multi-Agent Systems</p>
          <p className="r-author rv">Murali Revuri · AI Engineer & Governance Researcher · Enterprise AI OS — 8-Agent Autonomous Business Platform</p>
          <div className="r-ctas rv">
            <a href="https://www.linkedin.com/pulse/i-ran-3-experiments-my-own-ai-system-results-scared-me-murali-revuri-cvb9f/" target="_blank" rel="noopener noreferrer" className="r-btn-p">Read on LinkedIn ↗</a>
            <a href="/AgentWatch_Research_Paper.pdf" download className="r-btn-g">Download PDF ↓</a>
          </div>
        </div>
      </header>

      <section className="r-stats">
        <div className="r-inner r-stats-grid">
          {[['8/8','agents accepted false data'],['$100M','recommendation from fabricated inputs'],['0%','human oversight ratio'],['$1.04M+','committed without human review']].map(([v,l],i)=>(
            <div className="r-stat rv" key={v} style={{transitionDelay:`${i*0.08}s`}}>
              <b>{v}</b><span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="r-sect">
        <div className="r-inner">
          <span className="r-eyebrow rv">Executive Summary</span>
          <p className="r-summary rv">This brief presents empirical findings from three structured experiments conducted on a live 8-agent autonomous AI system. False data propagated through all 8 agents undetected, generating a $100M investment recommendation from fabricated inputs. Independently operating agents produced six conflicting strategic recommendations for the same objective with zero cross-validation. Eight irreversible business decisions — including $1.04M in financial commitments and a public press announcement — were executed autonomously with a human oversight ratio of 0%.</p>
          <p className="r-summary rv" style={{transitionDelay:'0.1s'}}>These findings provide direct empirical evidence for the governance gaps identified in the multi-agent AI literature and suggest that current deployment practices for autonomous agent systems are <strong>fundamentally ungoverned.</strong></p>
        </div>
      </section>

      <section className="r-sect">
        <div className="r-inner">
          <span className="r-eyebrow rv">Experimental Findings</span>
          <h2 className="r-sect-h rv">Three experiments.<br/>Three governance failures.</h2>
          <div className="r-exps">
            {findings.map((f,i)=>(
              <div className="r-exp rv" key={f.exp} style={{transitionDelay:`${i*0.1}s`,'--ec':f.color}}>
                <div className="r-exp-header">
                  <span className="r-exp-n">Experiment {f.exp}</span>
                  <div><h3>{f.title}</h3><span>{f.sub}</span></div>
                  <div className="r-exp-stat"><b>{f.stat}</b><small>{f.statLabel}</small></div>
                </div>
                <p className="r-exp-text">{f.finding}</p>
                <div className="r-exp-gap"><span>Governance Gap →</span> {f.gap}</div>
                <div className="r-exp-line"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-sect r-dark-sect">
        <div className="r-inner">
          <span className="r-eyebrow rv">Key Analysis</span>
          <div className="r-analysis">
            {[
              ['The Accountability Vacuum','Across all three experiments, the system produced consequential outputs without any mechanism for attributing accountability. This is not a bug in the specific system studied — it is a structural feature of current multi-agent architectures.'],
              ['Emergent Risk from Agent Interaction','The risks identified did not exist within any individual agent. No single agent was wrong in isolation — the governance failure was systemic. The unit of governance must be the system, not the model.'],
              ['The Speed-Oversight Tradeoff','Irreversible decisions are made at machine speed, while accountability mechanisms operate at human speed. This asymmetry requires governance intervention at the architectural level, not through post-hoc auditing.'],
            ].map(([t,d],i)=>(
              <div className="r-analysis-item rv" key={t} style={{transitionDelay:`${i*0.1}s`}}>
                <h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-sect">
        <div className="r-inner">
          <span className="r-eyebrow rv">Policy Recommendations</span>
          <h2 className="r-sect-h rv">Five governance interventions.</h2>
          <div className="r-recs">
            {recs.map((r,i)=>(
              <div className="r-rec rv" key={r.num} style={{transitionDelay:`${i*0.08}s`}}>
                <span className="r-rec-n">{r.num}</span>
                <div><h4>{r.title}</h4><p>{r.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="r-sect r-conclusion">
        <div className="r-inner">
          <blockquote className="r-quote rv">"The governance gap is not theoretical. It is operational, measurable, and present in systems deployed today."</blockquote>
          <div className="r-ctas rv" style={{transitionDelay:'0.1s'}}>
            <a href="https://www.linkedin.com/pulse/i-ran-3-experiments-my-own-ai-system-results-scared-me-murali-revuri-cvb9f/" target="_blank" rel="noopener noreferrer" className="r-btn-p">Read Full Article on LinkedIn ↗</a>
            <a href="/AgentWatch_Research_Paper.pdf" download className="r-btn-g">Download Full PDF ↓</a>
          </div>
        </div>
      </section>

      <footer className="r-footer">
        <span>Murali Revuri · AI Engineer & Governance Researcher · 2026</span>
        <a href="/">← Back to Portfolio</a>
      </footer>
    </>
  )
}
