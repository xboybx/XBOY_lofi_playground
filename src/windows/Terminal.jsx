import { WindowControls } from '#components'
import WindowWrapper from '#hoc/WindowWrapper'
import React, { useState, useEffect, useRef } from 'react'
import { Info, Trash2 } from 'lucide-react/dist/esm/icons'

const Terminal = () => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', content: 'xboybx@macbook ~ % ./lofi_focus.sh' },
    { type: 'system', content: 'Lo-Fi Focus Terminal v2.1.0' },
    { type: 'system', content: 'Type "help" to see available commands.' },
  ])
  const [timeLeft, setTimeLeft] = useState(null)
  const historyEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setHistory(prev => [...prev, { type: 'system', content: '[SYSTEM] ✨ Focus session complete! Time for a break.' }]);
      setTimeLeft(null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const args = cmd.split(' ');
    const newHistory = [...history, { type: 'user', content: `xboybx@macbook ~ % ${input}` }];

    switch (args[0]) {
      case 'help':
        newHistory.push({ type: 'system', content: 'Available commands:\n  timer <min> - Start a focus timer (e.g. timer 25)\n  stop        - Stop the current timer\n  zen         - Get a lo-fi quote\n  clear       - Clear the console\n  date        - Show current date/time' });
        break;
      case 'timer':
        const mins = parseInt(args[1]);
        if (isNaN(mins) || mins <= 0) {
          newHistory.push({ type: 'error', content: 'Error: Please specify valid minutes (e.g., timer 25)' });
        } else {
          setTimeLeft(mins * 60);
          newHistory.push({ type: 'system', content: `[SYSTEM] ⏱️ Timer started for ${mins} minutes. Focus mode: ENGAGED.` });
        }
        break;
      case 'stop':
        setTimeLeft(null);
        newHistory.push({ type: 'system', content: '[SYSTEM] ⏹️ Timer stopped.' });
        break;
      case 'zen':
        const quotes = [
          "Be here now.",
          "Progress over perfection.",
          "Softly, slowly, surely.",
          "The only way out is through.",
          "Rest is productive.",
          "Your pace is fine."
        ];
        newHistory.push({ type: 'zen', content: `[ZEN] ✨ ${quotes[Math.floor(Math.random() * quotes.length)]}` });
        break;
      case 'date':
        newHistory.push({ type: 'system', content: new Date().toLocaleString() });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({ type: 'error', content: `zsh: command not found: ${args[0]}` });
    }

    setHistory(newHistory);
    setInput('');
  }

  const handleClear = () => {
    setHistory([]);
    setInput('');
  };

  const handleHelp = () => {
    setHistory(prev => [...prev, 
      { type: 'user', content: `xboybx@macbook ~ % help` },
      { type: 'system', content: 'Available commands:\n  timer <min> - Start a focus timer (e.g. timer 25)\n  stop        - Stop the current timer\n  zen         - Get a lo-fi quote\n  clear       - Clear the console\n  date        - Show current date/time' }
    ]);
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#1c1c1e] text-[#4ade80] font-mono text-sm md:text-[15px] selection:bg-[#4ade80]/30"
      onClick={() => inputRef.current?.focus()}
    >
      <div id='window-header' className='window-drag-handle border-b border-gray-800 bg-[#2d2d2d] flex flex-row items-center justify-between'>
        <div className="w-[80px]">
          <WindowControls target='terminal' />
        </div>
        <h2 className="flex-1 text-center text-gray-400 font-bold text-xs pb-1">
          xboybx@macbook ~ zsh
        </h2>
        <div className="w-[80px] flex justify-end gap-3 pr-4 items-center">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); handleHelp(); }}
            className="text-gray-400 hover:text-white transition-colors"
            title="Commands Info"
          >
            <Info size={14} />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-1.5 scroll-smooth custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'error' ? 'text-red-400' : line.type === 'zen' ? 'text-cyan-400 italic' : line.type === 'user' ? 'text-white' : 'text-[#4ade80]'}>
            <pre className="whitespace-pre-wrap font-inherit leading-relaxed">{line.content}</pre>
          </div>
        ))}
        
        {timeLeft !== null && (
          <div className="text-yellow-400 animate-pulse my-4 py-2 border-y border-yellow-400/20 font-bold">
            [ACTIVE FOCUS TIMER: {formatTime(timeLeft)}]
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-white font-bold whitespace-nowrap">xboybx@macbook ~ %</span>
          <form onSubmit={handleCommand} className="flex-1">
            <input
              ref={inputRef}
              autoFocus
              className="w-full bg-transparent border-none outline-none text-[#4ade80] font-mono focus:ring-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck="false"
              autoComplete="off"
            />
          </form>
        </div>
        <div ref={historyEndRef} />
      </div>
    </div>
  )
}

const TerminalWindow = WindowWrapper(Terminal, 'terminal')

export default TerminalWindow;