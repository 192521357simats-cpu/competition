
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, Upload, Crosshair, 
  Lock, Youtube, Instagram, Settings, Heart, 
  Menu, Share2, Activity, Cpu, 
  Terminal, Target, Zap, Layers, RefreshCw, 
  Box, Hexagon, Fingerprint, Eye, Command,
  Wifi, Radio, AlertCircle, Info, ChevronRight,
  Database, HardDrive, Cpu as CpuIcon, Scan,
  Download, Filter, Binary, Signal
} from 'lucide-react';
import { analyzeMediaForensics } from './services/geminiService';
import { ScanResult, Platform } from './types';
import { ScannerOverlay } from './components/ScannerOverlay';

const MOCK_PLATFORM_FEED = [
  { id: 'post_1', author: 'VisualArtist_AI', content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', type: 'INSTAGRAM', caption: 'Exploring new worlds of abstract geometry.' },
  { id: 'post_2', author: 'NationalGeographic', content: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', type: 'INSTAGRAM', caption: 'The mountains are calling.' },
  { id: 'post_3', author: 'TechNews_Deep', content: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', type: 'YOUTUBE', caption: 'Breaking: New Sora Model Released.' },
  { id: 'post_4', author: 'Future_Design', content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800', type: 'INSTAGRAM', caption: 'Minimalist neon structures.' }
];

const HexStream: React.FC = () => {
  const [hex, setHex] = useState<string[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setHex(prev => [Math.random().toString(16).substring(2, 10).toUpperCase(), ...prev.slice(0, 15)]);
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col gap-1 opacity-20 select-none overflow-hidden h-32">
      {hex.map((h, i) => (
        <span key={i} className="text-[7px] font-mono leading-none tracking-tighter block">0x{h} [A{i*7}]</span>
      ))}
    </div>
  );
};

const NeuralLink: React.FC = () => {
  const hasKey = !!process.env.API_KEY;
  return (
    <div className="flex items-center gap-3 px-4 border-l border-[#00f2ff]/20 h-8">
      <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Neural_Link</span>
        <span className="text-[7px] font-mono text-[#00f2ff]">{hasKey ? 'CONNECTED_STABLE' : 'LINK_MISSING'}</span>
      </div>
    </div>
  );
};

const GlitchOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
    <div className="static-line" style={{ animationDelay: '0s' }} />
    <div className="static-line" style={{ animationDelay: '3s', opacity: 0.05 }} />
    <div className="absolute top-1/4 left-10 w-24 h-4 bg-[#00f2ff]/10 blur-xl animate-pulse" />
    <div className="absolute bottom-1/3 right-10 w-32 h-2 bg-[#ff0044]/5 blur-lg animate-pulse" />
  </div>
);

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'lab' | 'guardian'>('lab');
  const [permissionPhase, setPermissionPhase] = useState<'locked' | 'select_app' | 'live'>('locked');
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [isScanning, setIsScanning] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ScanResult>>({});
  const [labPreview, setLabPreview] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [logs, setLogs] = useState<string[]>(['SYS_BOOT_COMPLETE', 'SECURE_CHANNEL_READY']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 6)]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog(`DATA_INJECTED: ${file.name.toUpperCase()}`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target?.result as string;
        setLabPreview(previewUrl);
        triggerForensicScan('lab', previewUrl, 'STANDALONE');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerForensicScan = async (id: string, imageData: string, platform: Platform) => {
    if (isScanning[id]) return;
    setIsScanning(prev => ({ ...prev, [id]: true }));
    addLog(`INIT_DECRYPTION_SEQ: ${id.toUpperCase()}`);
    
    try {
      const base64 = imageData.includes('base64,') ? imageData.split('base64,')[1] : imageData;
      const report = await analyzeMediaForensics(base64);
      
      setResults(prev => ({
        ...prev,
        [id]: {
          id, timestamp: Date.now(), sourceName: 'Tactical Intercept', sourceType: 'INTEGRATED',
          platform, imagePreview: imageData, report
        }
      }));
      setIsScanning(prev => ({ ...prev, [id]: false }));
      addLog(`ANALYSIS_COMPLETE: ${report.verdict}`);
    } catch (e) {
      console.error(e);
      setIsScanning(prev => ({ ...prev, [id]: false }));
      addLog(`ERROR: PACKET_FRAGMENT_FAIL`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00f2ff] flex flex-col relative overflow-hidden">
      <GlitchOverlay />
      
      <header className="h-14 border-b border-[#00f2ff]/30 bg-black/90 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => addLog('KERN_STATUS_QUERY')}>
            <Hexagon className="w-5 h-5 text-[#00f2ff] animate-pulse" />
            <span className="hud-text font-black text-xs tracking-[0.4em] uppercase chromatic">Veritas_OS</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[9px] text-[#00f2ff]/40 font-bold uppercase tracking-[0.3em] border-l border-[#00f2ff]/20 pl-6">
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-500 animate-pulse"/> Signal: Locked</span>
            <NeuralLink />
          </div>
        </div>

        <nav className="flex items-center bg-white/5 p-1 border border-white/10 rounded-sm">
          <button 
            onClick={() => { setActiveMode('lab'); addLog('ENTRY: LABORATORY'); }}
            className={`px-6 py-1 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeMode === 'lab' ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_#00f2ff]' : 'text-white/50 hover:text-white'}`}
          >
            Laboratory
          </button>
          <button 
            onClick={() => { setActiveMode('guardian'); addLog('ENTRY: LIVE_HUD'); }}
            className={`px-6 py-1 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeMode === 'guardian' ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_#00f2ff]' : 'text-white/50 hover:text-white'}`}
          >
            Live_HUD
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[7px] font-bold opacity-30 uppercase tracking-widest">{timestamp}</span>
            <span className="text-[7px] font-bold opacity-30 uppercase tracking-widest">Buffer: Safe</span>
          </div>
          <div className="w-10 h-10 border border-[#00f2ff]/20 flex items-center justify-center bg-white/5 hover:border-[#00f2ff]/60 cursor-pointer">
             <Settings className="w-5 h-5 opacity-50" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10">
        {activeMode === 'lab' ? (
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
             <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7 space-y-6">
                   <div className="relative aspect-[16/10] bg-white/5 border border-[#00f2ff]/30 group flex items-center justify-center overflow-hidden">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00f2ff]" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00f2ff]" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00f2ff]" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00f2ff]" />

                      {labPreview ? (
                        <div className="w-full h-full relative p-4">
                          <img src={labPreview} className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700" />
                          {isScanning['lab'] && <ScannerOverlay />}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 group cursor-pointer p-20" onClick={() => fileInputRef.current?.click()}>
                           <div className="w-24 h-24 border border-[#00f2ff]/20 flex items-center justify-center relative group-hover:border-[#00f2ff] transition-all bg-black/40">
                              <div className="absolute inset-2 border border-dashed border-[#00f2ff]/10 animate-[spin_20s_linear_infinite]" />
                              <Upload className="w-8 h-8 animate-bounce text-[#00f2ff]/60 group-hover:text-[#00f2ff]" />
                           </div>
                           <span className="hud-text text-[10px] font-black tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-all text-center uppercase">Awaiting_Target_Input</span>
                        </div>
                      )}
                      
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload} 
                      />
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-[#00f2ff]/40 bg-white/5 hover:bg-[#00f2ff]/10 py-4 font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2 group"
                      >
                        <Binary className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Load_Asset
                      </button>
                      <button 
                        disabled={!labPreview || isScanning['lab']}
                        onClick={() => labPreview && triggerForensicScan('lab', labPreview, 'STANDALONE')}
                        className="col-span-1 md:col-span-2 bg-[#00f2ff] text-black py-4 font-black uppercase text-[9px] tracking-[0.4em] hover:shadow-[0_0_30px_#00f2ff] disabled:opacity-20 flex items-center justify-center gap-3 transition-all"
                      >
                        <Zap className="w-4 h-4 fill-current" /> Execute_Deep_Scan
                      </button>
                      <button className="border border-[#00f2ff]/20 bg-white/5 py-4 font-black uppercase text-[9px] tracking-[0.2em] opacity-30 cursor-not-allowed hidden md:flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Export_Log
                      </button>
                   </div>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-6">
                   <div className="border border-[#00f2ff]/20 bg-black/40 backdrop-blur-md p-6 h-full flex flex-col relative overflow-hidden">
                      <div className="absolute -top-4 -right-4 w-12 h-12 border border-[#00f2ff]/10 rotate-45" />

                      <h3 className="hud-text text-[10px] font-black uppercase tracking-widest border-b border-[#00f2ff]/20 pb-4 mb-6 flex items-center justify-between">
                         <span className="flex items-center gap-3"><Terminal className="w-4 h-4 text-[#ffaa00]" /> Forensic_Diagnostic</span>
                         <span className="text-[8px] opacity-40 font-mono">ID: VT-{Math.random().toString(36).substr(2, 5).toUpperCase()}</span>
                      </h3>
                      
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {results['lab'] ? (
                          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                             <div className={`p-6 border-2 flex items-center gap-6 relative overflow-hidden ${results['lab'].report.verdict === 'AI' ? 'border-[#ff0044] bg-[#ff0044]/10' : 'border-[#00f2ff] bg-[#00f2ff]/10'}`}>
                                <div className={`w-16 h-16 flex items-center justify-center border-2 shadow-2xl ${results['lab'].report.verdict === 'AI' ? 'border-[#ff0044] text-[#ff0044]' : 'border-[#00f2ff] text-[#00f2ff]'}`}>
                                   {results['lab'].report.verdict === 'AI' ? <ShieldAlert className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                                </div>
                                <div>
                                   <p className="hud-text text-[20px] font-black uppercase tracking-tighter chromatic">
                                      {results['lab'].report.verdict === 'AI' ? 'SYNTHETIC' : results['lab'].report.verdict === 'REAL' ? 'AUTHENTIC' : 'UNCERTAIN'}
                                   </p>
                                   <div className="flex flex-col gap-1 mt-1">
                                      <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black bg-black px-2 py-0.5 border border-white/10 uppercase tracking-widest">P_SCORE: {results['lab'].report.probability}%</span>
                                        <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">Conf: {results['lab'].report.confidence}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-white/5 mt-1 overflow-hidden">
                                        <div 
                                          className={`h-full transition-all duration-1000 ${results['lab'].report.verdict === 'AI' ? 'bg-[#ff0044]' : 'bg-[#00f2ff]'}`}
                                          style={{ width: `${results['lab'].report.probability}%` }}
                                        />
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <p className="text-[9px] font-black uppercase text-[#00f2ff] tracking-[0.3em] flex items-center gap-2">
                                     <Filter className="w-3 h-3" /> Diagnostic_Summary
                                   </p>
                                   <div className="bg-white/5 p-4 border border-white/10 font-medium italic text-[11px] leading-relaxed text-white/80">
                                      "{results['lab'].report.summary}"
                                   </div>
                                </div>

                                <div className="space-y-3">
                                   <p className="text-[9px] font-black uppercase opacity-40 tracking-widest border-b border-white/5 pb-2">Anomaly_Log</p>
                                   <div className="grid grid-cols-1 gap-2">
                                      {results['lab'].report.anomalies.map((a, i) => (
                                        <div key={i} className="text-[9px] p-3 bg-white/5 border-l-2 border-[#00f2ff]/20 hover:border-[#00f2ff] transition-all">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="font-black uppercase tracking-widest">{a.label}</span>
                                            <span className={`text-[7px] px-1 font-black ${a.severity === 'HIGH' ? 'text-red-500' : 'text-[#ffaa00]'}`}>{a.severity}</span>
                                          </div>
                                          <p className="opacity-60 leading-tight">{a.description}</p>
                                        </div>
                                      ))}
                                   </div>
                                </div>

                                {results['lab'].report.generatorSource && results['lab'].report.generatorSource !== 'None' && (
                                  <div className="mt-4 p-4 border border-[#ffaa00] bg-[#ffaa00]/10 flex items-center gap-4 relative">
                                    <AlertCircle className="w-6 h-6 text-[#ffaa00]" />
                                    <div>
                                      <p className="text-[8px] font-black uppercase text-[#ffaa00] opacity-80 mb-0.5">SOURCE_SIGNATURE</p>
                                      <p className="hud-text text-[13px] font-black uppercase text-[#ffaa00]">{results['lab'].report.generatorSource}</p>
                                    </div>
                                  </div>
                                )}
                             </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-10 py-24 text-center">
                             <Target className="w-20 h-20 mb-6 animate-pulse text-[#00f2ff]" />
                             <p className="hud-text text-[10px] font-black tracking-[0.5em] uppercase text-center">System_Awaiting_Buffer</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {permissionPhase === 'locked' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 <div className="relative w-40 h-40 mb-10 group cursor-pointer" onClick={() => addLog('KERN_AUTH_REQ')}>
                    <div className="absolute inset-0 border-2 border-[#00f2ff]/20 rounded-full animate-[ping_3s_infinite]" />
                    <div className="absolute inset-4 border border-[#00f2ff]/40 rounded-full animate-[spin_15s_linear_infinite]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Lock className="w-14 h-14 text-[#00f2ff] group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#00f2ff]" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#00f2ff]" />
                 </div>
                 <h2 className="hud-text text-3xl font-black mb-4 tracking-[0.4em] chromatic">ACCESS_DENIED</h2>
                 <p className="text-[11px] font-bold text-white/40 max-w-sm mb-10 uppercase tracking-[0.3em] leading-relaxed">Direct hardware bridge required for external packet interception.</p>
                 <button 
                  onClick={() => { setPermissionPhase('select_app'); addLog('KERN_AUTH_OK'); }}
                  className="bg-[#00f2ff] text-black px-16 py-5 font-black uppercase text-[11px] tracking-[0.5em] hover:shadow-[0_0_50px_#00f2ff] transition-all relative overflow-hidden group glitch-hover"
                 >
                   <span className="relative z-10">Bypass_Security_Grid</span>
                 </button>
              </div>
            ) : permissionPhase === 'select_app' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                 <h2 className="hud-text text-[12px] font-black tracking-[0.8em] mb-16 opacity-50 uppercase text-center">SELECT_INTERCEPT_PROXY</h2>
                 <div className="flex gap-16">
                    {['INSTAGRAM', 'YOUTUBE'].map(id => (
                      <button 
                        key={id}
                        onClick={() => { setActivePlatform(id as Platform); setPermissionPhase('live'); addLog(`BRIDGE: ${id}`); }}
                        className="group flex flex-col items-center gap-8"
                      >
                         <div className="w-40 h-40 border border-white/10 group-hover:border-[#00f2ff] group-hover:bg-[#00f2ff]/5 flex items-center justify-center transition-all relative">
                            {id === 'YOUTUBE' ? <Youtube className="w-16 h-16" /> : <Instagram className="w-16 h-16" />}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[#00f2ff] opacity-0 group-hover:opacity-100" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[#00f2ff] opacity-0 group-hover:opacity-100" />
                         </div>
                         <span className="hud-text text-[11px] font-black tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-[#00f2ff] transition-all">{id}</span>
                      </button>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <aside className="w-72 border-r border-[#00f2ff]/20 bg-black/40 p-6 hidden xl:flex flex-col gap-8">
                   <div className="space-y-6">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30 flex items-center gap-2"><Layers className="w-3 h-3" /> Active_Interceptions</h4>
                         <div className="space-y-3">
                            {MOCK_PLATFORM_FEED.map(p => (
                              <div key={p.id} className="text-[9px] font-mono text-white/40 flex items-center justify-between border-b border-white/5 pb-2 group hover:text-[#00f2ff] cursor-pointer transition-colors">
                                 <div className="flex items-center gap-2">
                                   <div className="w-1 h-1 bg-current" />
                                   <span>{p.id}.pkt</span>
                                 </div>
                                 <span className="text-[8px] opacity-40">0x{Math.floor(Math.random()*9999).toString(16).toUpperCase()}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="mt-auto">
                      <HexStream />
                   </div>
                </aside>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,transparent_80%)]">
                   <div className="max-w-md mx-auto py-12 px-6 space-y-20">
                      {MOCK_PLATFORM_FEED.map(post => {
                        const scanResult = results[post.id];
                        const scanning = isScanning[post.id];

                        return (
                          <div key={post.id} className="space-y-6 relative group">
                             <div className="relative aspect-square bg-white/5 border border-white/10 group overflow-hidden">
                                <img src={post.content} className={`w-full h-full object-cover transition-all duration-1000 ${scanning ? 'brightness-50 grayscale contrast-150 scale-105' : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'}`} />
                                {scanning && <ScannerOverlay />}

                                {scanResult && (
                                  <div className="absolute inset-0 z-30 animate-in zoom-in-95 duration-500 pointer-events-none flex items-center justify-center px-8">
                                     <div className={`w-full p-5 border-2 backdrop-blur-xl shadow-2xl relative ${scanResult.report.verdict === 'AI' ? 'bg-[#ff0044]/80 border-[#ff0044]' : 'bg-[#00f2ff]/80 border-[#00f2ff]'} text-black`}>
                                        <div className="flex items-center justify-between mb-2">
                                           <p className="hud-text text-[11px] font-black uppercase tracking-[0.2em]">
                                              {scanResult.report.verdict === 'AI' ? '!! SYNTHETIC_DETECTED !!' : 'AUTHENTIC_SIGNAL'}
                                           </p>
                                           <div className="bg-black text-[#00f2ff] px-2 py-0.5 text-[8px] font-black">{scanResult.report.confidence}%_ACC</div>
                                        </div>
                                        <p className="text-[10px] font-bold leading-tight opacity-90">{scanResult.report.summary.substring(0, 80)}...</p>
                                     </div>
                                  </div>
                                )}

                                {!scanResult && !scanning && (
                                  <button 
                                    onClick={() => triggerForensicScan(post.id, post.content, activePlatform!)}
                                    className="absolute inset-0 flex items-center justify-center group/btn pointer-events-none"
                                  >
                                    <div className="w-20 h-20 border-2 border-[#00f2ff]/20 rounded-full flex items-center justify-center group-hover/btn:border-[#00f2ff] group-hover/btn:scale-110 transition-all pointer-events-auto bg-black/20 backdrop-blur-sm relative overflow-hidden">
                                       <Target className="w-8 h-8 text-[#00f2ff] group-hover/btn:rotate-90 transition-transform" />
                                    </div>
                                  </button>
                                )}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="h-12 bg-black border-t border-[#00f2ff]/20 flex items-center justify-between px-6 z-50">
         <div className="flex gap-12 items-center h-full">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Secure_Kernel: Ready</span>
            </div>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-12 h-6">
              <Radio className="w-3 h-3 text-[#ffaa00] animate-pulse" />
              <div className="flex gap-4">
                {logs.slice(0, 1).map((log, i) => (
                  <span key={i} className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#ffaa00]">
                    {log}
                  </span>
                ))}
              </div>
            </div>
         </div>
         <p className="text-[9px] font-mono text-[#00f2ff]/40 uppercase tracking-[0.4em]">VT_INT_6.0.4_BETA</p>
      </footer>
    </div>
  );
};

export default App;
