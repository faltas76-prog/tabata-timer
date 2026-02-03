import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';

export default function TabataTimer() {
  const [rounds, setRounds] = useState(8);
  const [series, setSeries] = useState(1);
  const [seriesBreak, setSeriesBreak] = useState(60);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [prepTime, setPrepTime] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(false);
  const [isPrep, setIsPrep] = useState(true);
  const [isSeriesBreak, setIsSeriesBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  useEffect(() => {
    let interval = null;

    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time === 4 && soundEnabledRef.current) playShortBeep();
          if (time === 3 && soundEnabledRef.current) playShortBeep();
          if (time === 2 && soundEnabledRef.current) playShortBeep();

          if (time > 1) return time - 1;

          if (soundEnabledRef.current) playLongBeep();

          if (isPrep) {
            setIsPrep(false);
            setIsWork(true);
            return workTime;
          }

          if (isSeriesBreak) {
            setIsSeriesBreak(false);
            setCurrentRound(1);
            setIsWork(true);
            setCurrentSeries(s => s + 1);
            return workTime;
          }

          if (isWork) {
            setIsWork(false);
            return restTime;
          } else {
            if (currentRound < rounds) {
              setCurrentRound(r => r + 1);
              setIsWork(true);
              return workTime;
            } else {
              if (currentSeries < series) {
                setIsSeriesBreak(true);
                return seriesBreak;
              } else {
                setIsFinished(true);
                setIsRunning(false);
                return 0;
              }
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isWork, isPrep, isSeriesBreak, currentRound, currentSeries, rounds, series, isFinished, workTime, restTime, seriesBreak, prepTime]);

  const playShortBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  };

  const playLongBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  };

  const handleStart = () => {
    if (!isRunning && currentRound === 1 && !isWork && isPrep) {
      setTimeLeft(prepTime);
    }
    setIsRunning(true);
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {});
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setCurrentSeries(1);
    setCurrentRound(1);
    setIsWork(false);
    setIsPrep(true);
    setIsSeriesBreak(false);
    setTimeLeft(prepTime);
  };

  const set = (wt, rt, pt, r, s, sb) => {
    setWorkTime(wt);
    setRestTime(rt);
    setPrepTime(pt);
    setRounds(r);
    setSeries(s);
    setSeriesBreak(sb);
    if (!isRunning) setTimeLeft(pt);
  };

  const getProgress = () => {
    if (isPrep) return ((prepTime - timeLeft) / prepTime) * 100;
    if (isSeriesBreak) return ((seriesBreak - timeLeft) / seriesBreak) * 100;
    return isWork
      ? ((workTime - timeLeft) / workTime) * 100
      : ((restTime - timeLeft) / restTime) * 100;
  };

  const progress = getProgress();
  const totalTime = prepTime + rounds * (workTime + restTime) * series + seriesBreak * (series - 1);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;

  const colors = isPrep
    ? { primary: '#f59e0b', shadow: 'rgba(245,158,11,0.8)' }
    : isSeriesBreak
      ? { primary: '#a855f7', shadow: 'rgba(168,85,247,0.8)' }
      : isWork
        ? { primary: '#06b6d4', shadow: 'rgba(6,182,212,0.8)' }
        : { primary: '#ec4899', shadow: 'rgba(236,72,153,0.8)' };

  const phaseText = isFinished ? '// HOTOVO //'
    : isPrep ? '>> PŘÍPRAVA <<'
    : isSeriesBreak ? '// PAUZA SÉRIE //'
    : isWork ? '>> CVIČ <<'
    : '// ODPOČINEK //';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
      }}></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-cyan-500/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                TABATA
              </h1>
              <div className="flex gap-2">
                <button onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500 text-cyan-400 rounded-lg transition-all">
                  {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
                <button onClick={() => setShowSettings(!showSettings)} disabled={isRunning}
                  className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500 text-cyan-400 rounded-lg transition-all disabled:opacity-50">
                  <Settings size={24} />
                </button>
              </div>
            </div>

            {/* Settings panel */}
            {showSettings && !isRunning && (
              <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg space-y-3 max-h-80 overflow-y-auto">
                {[
                  { label: 'Příprava (s)', val: prepTime, color: 'amber', min: 5, max: 60, onChange: v => set(workTime, restTime, v, rounds, series, seriesBreak) },
                  { label: 'Cvičení (s)', val: workTime, color: 'cyan', min: 5, max: 180, onChange: v => set(v, restTime, prepTime, rounds, series, seriesBreak) },
                  { label: 'Odpočinek (s)', val: restTime, color: 'pink', min: 5, max: 180, onChange: v => set(workTime, v, prepTime, rounds, series, seriesBreak) },
                  { label: 'Počet kol', val: rounds, color: 'purple', min: 1, max: 20, onChange: v => set(workTime, restTime, prepTime, v, series, seriesBreak) },
                  { label: 'Počet sérií', val: series, color: 'amber', min: 1, max: 10, onChange: v => set(workTime, restTime, prepTime, rounds, v, seriesBreak) },
                ].map(({ label, val, color, min, max, onChange }) => (
                  <div key={label}>
                    <label className={`text-${color}-400 text-sm mb-1 block font-mono`}>{label}</label>
                    <input type="number" min={min} max={max} value={val}
                      onChange={e => onChange(parseInt(e.target.value) || min)}
                      className={`w-full px-4 py-2 bg-black/50 border-2 border-${color}-500/50 rounded-lg text-${color}-400 text-center text-lg focus:outline-none`}
                    />
                  </div>
                ))}
                {series > 1 && (
                  <div>
                    <label className="text-violet-400 text-sm mb-1 block font-mono">Pauza mezi sériemi (s)</label>
                    <input type="number" min={10} max={300} value={seriesBreak}
                      onChange={e => set(workTime, restTime, prepTime, rounds, series, parseInt(e.target.value) || 60)}
                      className="w-full px-4 py-2 bg-black/50 border-2 border-violet-500/50 rounded-lg text-violet-400 text-center text-lg focus:outline-none"
                    />
                  </div>
                )}
                <div className="text-center text-cyan-400/60 text-sm font-mono pt-1">
                  Celkem: {mins}:{secs.toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {/* Timer circle */}
            <div className="relative mb-6">
              <svg className="w-full h-56 md:h-64" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="8" />
                <circle cx="100" cy="100" r="80" fill="none" stroke={colors.primary} strokeWidth="12"
                  strokeDasharray={`${progress * 5.03} 503`} strokeLinecap="round"
                  transform="rotate(-90 100 100)" filter="url(#glow)" className="transition-all duration-300" />
                <circle cx="100" cy="100" r="80" fill="none" stroke={colors.primary} strokeWidth="4"
                  strokeDasharray={`${progress * 5.03} 503`} strokeLinecap="round"
                  transform="rotate(-90 100 100)" className="transition-all duration-300" />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl md:text-7xl font-bold mb-1" style={{ color: colors.primary, textShadow: `0 0 20px ${colors.shadow}` }}>
                  {timeLeft}
                </div>
                <div className="text-xl md:text-2xl font-bold font-mono" style={{ color: colors.primary }}>{phaseText}</div>
                {!isSeriesBreak && !isPrep && (
                  <div className="text-purple-400 mt-1 font-mono text-xs md:text-sm">KOLO {currentRound} / {rounds}</div>
                )}
                {series > 1 && !isPrep && (
                  <div className="text-amber-400 mt-1 font-mono text-xs md:text-sm">SÉRIE {currentSeries} / {series}</div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              {!isRunning ? (
                <button onClick={handleStart}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black px-6 md:px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/50 font-mono">
                  <Play size={20} /> START
                </button>
              ) : (
                <button onClick={handlePause}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-black px-6 md:px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-pink-500/50 font-mono">
                  <Pause size={20} /> PAUZA
                </button>
              )}
              <button onClick={handleReset}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white px-6 md:px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-purple-500/50 font-mono">
                <RotateCcw size={20} /> RESET
              </button>
            </div>

            {/* Footer info */}
            <div className="mt-5 text-center text-cyan-400/60 text-xs md:text-sm font-mono">
              <p>{prepTime}s příprava • {workTime}s cvičení • {restTime}s odpočinek</p>
              <p className="mt-1">{rounds} kol{series > 1 ? ` • ${series} sérií • ${seriesBreak}s pauza` : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
