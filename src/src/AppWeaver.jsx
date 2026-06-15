import { useState } from 'react'

function AppWeaver() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateApp = () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    setTimeout(() => {
      let code = ''
      let componentName = ''
      
      if (prompt.toLowerCase().includes('todo')) {
        code = `import { useState } from 'react'

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input])
      setInput('')
    }
  }

  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>✅ Todo App</h1>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  )
}

export default TodoApp`
        componentName = 'TodoApp'
      } else if (prompt.toLowerCase().includes('counter')) {
        code = `import { useState } from 'react'

function CounterApp() {
  const [count, setCount] = useState(0)

  return (
    <div style={{textAlign: 'center', padding: '50px', fontFamily: 'Arial'}}>
      <h1>Counter App</h1>
      <h2 style={{fontSize: '48px'}}>{count}</h2>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

export default CounterApp`
        componentName = 'CounterApp'
      } else if (prompt.toLowerCase().includes('calculator')) {
        code = `import { useState } from 'react'

function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operation, setOperation] = useState(null)

  const handleNumber = (num) => {
    setDisplay(display === '0' ? num : display + num)
  }

  const handleOperation = (op) => {
    setPrevValue(parseFloat(display))
    setOperation(op)
    setDisplay('0')
  }

  const calculate = () => {
    if (!prevValue || !operation) return
    let result
    const current = parseFloat(display)
    switch(operation) {
      case '+': result = prevValue + current; break
      case '-': result = prevValue - current; break
      case '*': result = prevValue * current; break
      case '/': result = prevValue / current; break
      default: return
    }
    setDisplay(result.toString())
    setPrevValue(null)
    setOperation(null)
  }

  return (
    <div style={{padding: '20px', maxWidth: '300px', margin: '0 auto'}}>
      <h1>🧮 Calculator</h1>
      <div style={{background: '#222', padding: '20px', fontSize: '24px', textAlign: 'right', borderRadius: '8px'}}>
        {display}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px'}}>
        {[7,8,9,'+',4,5,6,'-',1,2,3,'*',0,'C','=','/'].map((btn) => (
          <button 
            key={btn}
            onClick={() => {
              if (btn === 'C') setDisplay('0')
              else if (btn === '=') calculate()
              else if (['+','-','*','/'].includes(btn)) handleOperation(btn)
              else handleNumber(btn.toString())
            }}
            style={{padding: '16px', fontSize: '18px'}}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CalculatorApp`
        componentName = 'CalculatorApp'
      } else {
        code = `import { useState } from 'react'

function CustomApp() {
  const [message, setMessage] = useState('Built by Murali AI Agent!')

  return (
    <div style={{textAlign: 'center', padding: '50px', fontFamily: 'Arial'}}>
      <h1>🤖 AI Generated App</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('Powered by AppWeaver')}>
        Click Me
      </button>
    </div>
  )
}

export default CustomApp`
        componentName = 'CustomApp'
      }

      setGeneratedCode({ code, component: componentName })
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div style={{
      background: 'rgba(10, 10, 20, 0.8)',
      backdropFilter: 'blur(16px)',
      borderRadius: '32px',
      padding: '2rem',
      margin: '2rem',
      border: '1px solid rgba(0,224,255,0.3)'
    }}>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <h2 style={{fontSize: '2rem', background: 'linear-gradient(135deg, #00e0ff, #ff3366)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>
          🤖 AppWeaver - AI Agent
        </h2>
        <p>Describe any app, and my agent builds it instantly</p>
      </div>
      
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: 'Build me a todo app' or 'Create a calculator' or 'Make a counter'"
          rows="3"
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '1rem',
            color: 'white',
            fontSize: '1rem',
            marginBottom: '1rem',
            fontFamily: 'monospace'
          }}
        />
        <button 
          onClick={generateApp} 
          disabled={isGenerating}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #00e0ff, #ff3366)',
            border: 'none',
            borderRadius: '40px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {isGenerating ? '⚡ Agent is building...' : '🚀 Generate App'}
        </button>
      </div>

      {generatedCode && (
        <div style={{marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', textAlign: 'center'}}>
          <h3 style={{marginBottom: '0.5rem'}}>✨ Your App is Ready</h3>
          <p style={{marginBottom: '1rem'}}>✅ Generated: {generatedCode.component}</p>
          <button 
            onClick={() => navigator.clipboard.writeText(generatedCode.code)}
            style={{
              padding: '8px 16px',
              background: '#00e0ff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📋 Copy Code to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default AppWeaver