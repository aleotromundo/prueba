
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgentRole, Message, DebateState, SavedDebate } from './types';
import * as gemini from './services/geminiService';
import AgentAvatar from './components/AgentAvatar';

const App: React.FC = () => {
  const [state, setState] = useState<DebateState>({
    id: Math.random().toString(36).substring(7),
    sourceText: '',
    fileName: null,
    history: [],
    // Fix: removed invalid 'boolean =' syntax in object literal property.
    isGenerating: false,
    hasConcluded: false,
  });

  const [savedDebates, setSavedDebates] = useState<SavedDebate[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('ai_arena_theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efecto para aplicar el tema al documento
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ai_arena_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ai_arena_theme', 'light');
    }
  }, [isDarkMode]);

  // Cargar debates guardados al inicio
  useEffect(() => {
    const stored = localStorage.getItem('ai_arena_debates');
    if (stored) {
      try {
        setSavedDebates(JSON.parse(stored));
      } catch (e) {
        console.error("Error cargando historial", e);
      }
    }
  }, []);

  // Guardar debate actual en el historial cada vez que cambia la historia
  useEffect(() => {
    if (state.history.length > 0) {
      const newSaved = [...savedDebates];
      const index = newSaved.findIndex(d => d.id === state.id);
      
      const debateData: SavedDebate = {
        id: state.id,
        title: state.fileName || (state.sourceText.substring(0, 30) + "..."),
        date: Date.now(),
        history: state.history,
        sourceText: state.sourceText
      };

      if (index > -1) {
        newSaved[index] = debateData;
      } else {
        newSaved.unshift(debateData);
      }
      
      setSavedDebates(newSaved);
      localStorage.setItem('ai_arena_debates', JSON.stringify(newSaved));
    }
  }, [state.history, state.id, state.fileName, state.sourceText]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.history, state.isGenerating]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const newId = Math.random().toString(36).substring(7);
      gemini.stopSpeech();
      setPlayingId(null);
      setIsAudioLoading(false);
      setState({
        id: newId,
        sourceText: text,
        fileName: file.name,
        history: [],
        hasConcluded: false,
        isGenerating: false
      });
      startDebateInternal(text, newId);
    };
    reader.readAsText(file);
  };

  const startDebateInternal = (textToUse: string, id: string) => {
    if (!textToUse) return;
    processTurn(AgentRole.ARCHITECT, textToUse, [], id);
  };

  const handleManualStart = () => {
    if (!inputVal) return;
    const newId = Math.random().toString(36).substring(7);
    gemini.stopSpeech();
    setPlayingId(null);
    setIsAudioLoading(false);
    setState({ 
      id: newId, 
      sourceText: inputVal, 
      fileName: null, 
      history: [], 
      hasConcluded: false, 
      isGenerating: false 
    });
    startDebateInternal(inputVal, newId);
  };

  const processTurn = async (role: AgentRole, source: string, currentHistory: Message[], activeId: string) => {
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await gemini.generateDebateTurn(role, source, currentHistory);
      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role,
        content: response,
        timestamp: Date.now()
      };
      
      setState(prev => {
        if (prev.id !== activeId) return prev;
        return {
          ...prev,
          history: [...prev.history, newMessage],
          isGenerating: false
        };
      });
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const nextTurn = () => {
    if (state.isGenerating || state.hasConcluded) return;
    const lastMessage = state.history[state.history.length - 1];
    const nextRole = lastMessage?.role === AgentRole.ARCHITECT ? AgentRole.SKEPTIC : AgentRole.ARCHITECT;
    processTurn(nextRole, state.sourceText, state.history, state.id);
  };

  const concludeDebate = async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await gemini.generateConclusion(state.sourceText, state.history);
      const conclusionMsg: Message = {
        id: 'conclusion',
        role: AgentRole.MODERATOR,
        content: response,
        timestamp: Date.now()
      };
      setState(prev => ({
        ...prev,
        history: [...prev.history, conclusionMsg],
        isGenerating: false,
        hasConcluded: true
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const loadDebate = (debate: SavedDebate) => {
    gemini.stopSpeech();
    setPlayingId(null);
    setIsAudioLoading(false);
    setState({
      id: debate.id,
      sourceText: debate.sourceText,
      fileName: debate.title,
      history: debate.history,
      isGenerating: false,
      hasConcluded: debate.history.some(m => m.role === AgentRole.MODERATOR)
    });
    setIsSidebarOpen(false);
  };

  const deleteDebate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedDebates.filter(d => d.id !== id);
    setSavedDebates(updated);
    localStorage.setItem('ai_arena_debates', JSON.stringify(updated));
    if (state.id === id) {
       gemini.stopSpeech();
       setPlayingId(null);
       setIsAudioLoading(false);
       setState({
        id: Math.random().toString(36).substring(7),
        sourceText: '',
        fileName: null,
        history: [],
        isGenerating: false,
        hasConcluded: false,
      });
    }
  };

  const exportToPDF = () => const exportToPDF = () => {
  const container = document.getElementById('pdf-export-container');
  if (!container) return;

  const content = `
    <div id="pdf-export-content" style="font-family: 'Inter', sans-serif; padding: 20px;">
      <h1 style="font-family: 'Playfair Display', serif; color: #1e293b; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; page-break-after: avoid;">Reporte de Debate IA</h1>
      <p style="text-align: right; font-size: 12px; color: #64748b; margin-bottom: 20px;">Fecha: ${new Date().toLocaleDateString()}</p>
      <div style="margin-bottom: 20px; page-break-after: avoid;">
        <h3 style="color: #475569; page-break-after: avoid;">Contexto: ${state.fileName || 'Texto ingresado'}</h3>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
      ${state.history.map(m => `
        <div style="
          margin-bottom: 24px; 
          padding: 15px; 
          border-radius: 10px; 
          background: ${m.role === AgentRole.ARCHITECT ? '#f5f7ff' : m.role === AgentRole.SKEPTIC ? '#fff5f5' : '#1e293b'}; 
          color: ${m.role === AgentRole.MODERATOR ? 'white' : 'black'};
          page-break-inside: avoid;
          break-inside: avoid;
        ">
          <b style="display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; page-break-after: avoid;">
            ${m.role === AgentRole.ARCHITECT ? 'EL ARQUITECTO' : m.role === AgentRole.SKEPTIC ? 'EL ESCÉPTICO' : 'CONCLUSIÓN DEL MODERADOR'}
          </b>
          <div style="line-height: 1.6; font-size: 15px; orphans: 3; widows: 3;">${m.content}</div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = content;
  container.style.display = 'block';

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5], // Márgenes más pequeños (en inches)
    filename: `Debate_${state.fileName || 'IA'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      avoid: ['div', 'b']
    }
  };

  // @ts-ignore
  window.html2pdf().set(opt).from(container).save().then(() => {
    container.style.display = 'none';
    container.innerHTML = '';
  });
};

{
    const container = document.getElementById('pdf-export-container');
    if (!container) return;

    const content = `
      <div id="pdf-export-content" style="font-family: 'Inter', sans-serif;">
        <h1 style="font-family: 'Playfair Display', serif; color: #1e293b; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Reporte de Debate IA</h1>
        <p style="text-align: right; font-size: 12px; color: #64748b;">Fecha: ${new Date().toLocaleDateString()}</p>
        <div style="margin-bottom: 20px;">
          <h3 style="color: #475569;">Contexto: ${state.fileName || 'Texto ingresado'}</h3>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
        ${state.history.map(m => `
          <div style="margin-bottom: 24px; padding: 15px; border-radius: 10px; background: ${m.role === AgentRole.ARCHITECT ? '#f5f7ff' : m.role === AgentRole.SKEPTIC ? '#fff5f5' : '#1e293b'}; color: ${m.role === AgentRole.MODERATOR ? 'white' : 'black'};">
            <b style="display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              ${m.role === AgentRole.ARCHITECT ? 'EL ARQUITECTO' : m.role === AgentRole.SKEPTIC ? 'EL ESCÉPTICO' : 'CONCLUSIÓN DEL MODERADOR'}
            </b>
            <div style="line-height: 1.6; font-size: 15px;">${m.content}</div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = content;
    container.style.display = 'block';

    const opt = {
      margin: 1,
      filename: `Debate_${state.fileName || 'IA'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(container).save().then(() => {
      container.style.display = 'none';
      container.innerHTML = '';
    });
  };

  const handleSpeakToggle = async (message: Message) => {
    if (playingId === message.id) {
      gemini.stopSpeech();
      setPlayingId(null);
      setIsAudioLoading(false);
    } else {
      setPlayingId(message.id);
      setIsAudioLoading(true);
      
      let voice: 'Kore' | 'Puck' | 'Charon' = 'Charon';
      if (message.role === AgentRole.ARCHITECT) voice = 'Kore';
      else if (message.role === AgentRole.SKEPTIC) voice = 'Puck';
      
      try {
        await gemini.speakText(message.content, voice, () => {
          setPlayingId(null);
          setIsAudioLoading(false);
        });
        setIsAudioLoading(false);
      } catch (e) {
        console.error("Error reproduciendo audio", e);
        setPlayingId(null);
        setIsAudioLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 pb-20 overflow-x-hidden transition-colors duration-300">
      {/* Sidebar de Historial */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold serif text-slate-800 dark:text-slate-100">Tu Historial</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {savedDebates.length === 0 ? (
              <p className="text-slate-400 text-sm text-center italic mt-10">No tenés debates guardados todavía, che.</p>
            ) : (
              savedDebates.map(debate => (
                <div 
                  key={debate.id}
                  onClick={() => loadDebate(debate)}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${state.id === debate.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate text-slate-700 dark:text-slate-200 uppercase tracking-tight">{debate.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(debate.date).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={(e) => deleteDebate(e, debate.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/60 backdrop-blur-sm z-[90]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
            title="Abrir historial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 uppercase italic serif">Arena IA</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.636 5.636l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {state.sourceText && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              En vivo: {state.fileName || 'Texto'}
            </div>
          )}
          {state.history.length > 0 && (
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {!state.sourceText && state.history.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 space-y-6 animate-in fade-in zoom-in duration-500 transition-colors">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 serif">¿Sobre qué debatimos hoy?</h2>
              <p className="text-slate-500 dark:text-slate-400">Cargá un archivo o pegá un texto y arrancamos el debate al toque.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group">
                <input type="file" className="hidden" accept=".txt,.pdf" onChange={handleFileUpload} />
                <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-5 rounded-full group-hover:scale-110 transition-transform shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-700 dark:text-slate-200">Subir Archivo</span>
                  <span className="text-xs text-slate-400">PDF o TXT</span>
                </div>
              </label>

              <div className="flex flex-col gap-4">
                <textarea 
                  className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 resize-none min-h-[180px] shadow-inner transition-all"
                  placeholder="Pegá tus ideas acá mismo..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <button 
                  onClick={handleManualStart}
                  disabled={!inputVal}
                  className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
                >
                  ARRANCAR DEBATE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4 md:px-12 py-4">
              <AgentAvatar role={AgentRole.ARCHITECT} isSpeaking={state.history[state.history.length-1]?.role === AgentRole.ARCHITECT && state.isGenerating} />
              <div className="flex-1 h-[2px] bg-gradient-to-r from-indigo-500 via-slate-200 dark:via-slate-700 to-rose-500 mx-6 opacity-60 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                  DUELO INTELECTUAL
                </div>
              </div>
              <AgentAvatar role={AgentRole.SKEPTIC} isSpeaking={state.history[state.history.length-1]?.role === AgentRole.SKEPTIC && state.isGenerating} />
            </div>

            <div 
              ref={scrollRef}
              className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[550px] max-h-[650px] overflow-y-auto p-6 md:p-12 space-y-10 scroll-smooth custom-scrollbar transition-colors"
            >
              {state.history.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === AgentRole.MODERATOR ? 'justify-center' : msg.role === AgentRole.ARCHITECT ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-6 duration-700`}
                >
                  <div className={`
                    max-w-[90%] md:max-w-[80%] p-7 rounded-[2rem] shadow-sm relative group transition-all hover:shadow-md
                    ${msg.role === AgentRole.ARCHITECT ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-950 dark:text-indigo-100 rounded-tl-none border border-indigo-100 dark:border-indigo-800/50' : ''}
                    ${msg.role === AgentRole.SKEPTIC ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-950 dark:text-rose-100 rounded-tr-none border border-rose-100 dark:border-rose-800/50' : ''}
                    ${msg.role === AgentRole.MODERATOR ? 'bg-slate-900 dark:bg-indigo-600 text-white text-center rounded-[2rem] border-4 border-slate-800 dark:border-indigo-500/30 mx-6' : ''}
                  `}>
                    <button 
                      onClick={() => handleSpeakToggle(msg)}
                      disabled={playingId !== null && playingId !== msg.id && isAudioLoading}
                      className={`absolute top-4 right-4 transition-all backdrop-blur p-2 rounded-full ${msg.role === AgentRole.MODERATOR ? 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20' : 'bg-white/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'} ${playingId === msg.id ? 'opacity-100 text-rose-500 shadow-inner scale-110' : 'opacity-0 group-hover:opacity-100'} disabled:cursor-not-allowed`}
                      title={playingId === msg.id ? "Detener audio" : "Escuchar argumento"}
                    >
                      {playingId === msg.id && isAudioLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : playingId === msg.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-lg font-medium tracking-tight">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {state.isGenerating && (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                  <div className="flex gap-2 mb-3">
                    <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs italic animate-pulse">
                    Pensando...
                  </span>
                </div>
              )}
            </div>

            {!state.hasConcluded && (
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-8 sticky bottom-4 z-10">
                <button 
                  onClick={nextTurn}
                  disabled={state.isGenerating || state.history.length === 0}
                  className="bg-indigo-600 text-white font-bold py-5 px-12 rounded-full hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-2xl shadow-indigo-500/30 flex items-center gap-3 group active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  SIGUIENTE ARGUMENTO
                </button>
                <button 
                  onClick={concludeDebate}
                  disabled={state.isGenerating || state.history.length < 2}
                  className="bg-slate-900 dark:bg-slate-800 text-white font-bold py-5 px-12 rounded-full hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  CERRAR CON CONCLUSIÓN
                </button>
                <button 
                  onClick={() => {
                    gemini.stopSpeech();
                    setPlayingId(null);
                    setIsAudioLoading(false);
                    setState({ id: Math.random().toString(36).substring(7), sourceText: '', fileName: null, history: [], isGenerating: false, hasConcluded: false });
                  }}
                  className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold px-6 transition-colors text-sm uppercase tracking-widest"
                >
                  Reiniciar
                </button>
              </div>
            )}

            {state.hasConcluded && (
               <div className="flex flex-col items-center gap-6 pt-10">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-2 rounded-full text-sm font-bold animate-bounce">
                  ¡Debate Finalizado!
                </div>
                <button 
                  onClick={() => {
                    gemini.stopSpeech();
                    setPlayingId(null);
                    setIsAudioLoading(false);
                    setState({ id: Math.random().toString(36).substring(7), sourceText: '', fileName: null, history: [], isGenerating: false, hasConcluded: false });
                  }}
                  className="bg-indigo-600 text-white font-black py-5 px-14 rounded-full hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40 scale-105 active:scale-100 uppercase tracking-widest"
                >
                  NUEVO DEBATE
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default App;
