'use client';

import React, { useEffect, useState } from 'react';
import { Minus, Plus, Type, PanelLeft, Minimize2, Maximize2 } from 'lucide-react';

interface FontSizeState {
  sidebarScale: number;
  bodyScale: number;
}

interface FontSizeControlProps {
  onToggle?: () => void;
  isExpanded?: boolean;
}

const DEFAULT_STATE: FontSizeState = {
  sidebarScale: 1,
  bodyScale: 1,
};

const MIN_SCALE = 0.8;
const MAX_SCALE = 1.4;
const STEP = 0.05;

export function FontSizeControl({ onToggle, isExpanded }: FontSizeControlProps) {
  const [state, setState] = useState<FontSizeState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('font-size-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error('Failed to parse font settings', e);
      }
    }
    setMounted(true);
  }, []);

  const applySettings = (newState: FontSizeState) => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-font-scale', newState.sidebarScale.toString());
    root.style.setProperty('--body-font-scale', newState.bodyScale.toString());
  };

  const updateState = (key: keyof FontSizeState, delta: number) => {
    setState(prev => {
      const current = prev[key];
      const next = Math.min(Math.max(current + delta, MIN_SCALE), MAX_SCALE);
      const newState = { ...prev, [key]: Number(next.toFixed(2)) };
      
      applySettings(newState);
      localStorage.setItem('font-size-settings', JSON.stringify(newState));
      return newState;
    });
  };

  if (!mounted) return null;

  return (
    <div className="font-size-controls">
      {/* Sidebar Font Control */}
      <div className="font-control-group" title="Sidebar Font Size">
        <PanelLeft size={14} className="control-icon" />
        <button 
          onClick={() => updateState('sidebarScale', -STEP)} 
          disabled={state.sidebarScale <= MIN_SCALE}
          className="font-btn"
        >
          <Minus size={12} />
        </button>
        <span className="scale-display">{Math.round(state.sidebarScale * 100)}%</span>
        <button 
          onClick={() => updateState('sidebarScale', STEP)} 
          disabled={state.sidebarScale >= MAX_SCALE}
          className="font-btn"
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="control-divider" />

      {/* Body Font Control */}
      <div className="font-control-group" title="Body Text Size">
        <Type size={14} className="control-icon" />
        <button 
          onClick={() => updateState('bodyScale', -STEP)} 
          disabled={state.bodyScale <= MIN_SCALE}
          className="font-btn"
        >
          <Minus size={12} />
        </button>
        <span className="scale-display">{Math.round(state.bodyScale * 100)}%</span>
        <button 
          onClick={() => updateState('bodyScale', STEP)} 
          disabled={state.bodyScale >= MAX_SCALE}
          className="font-btn"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Sidebar Toggle - Only if onToggle provided */}
      {onToggle && (
        <>
          <div className="control-divider" />
          <button 
            onClick={onToggle}
            className="font-btn"
            title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </>
      )}
    </div>
  );
}
