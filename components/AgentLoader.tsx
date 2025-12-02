import React from 'react';
import { Bot, Paintbrush, Cog, ShieldCheck } from 'lucide-react';

interface AgentLoaderProps {
  agent: 'agent1' | 'agent2' | 'agent3';
}

const AgentLoader: React.FC<AgentLoaderProps> = ({ agent }) => {
  const isAgent1 = agent === 'agent1';
  const isAgent2 = agent === 'agent2';
  const isAgent3 = agent === 'agent3';

  let colorClass = "";
  let glowClass = "";
  let icon = null;
  let title = "";
  let subtext = "";
  let logs = [];

  if (isAgent1) {
    colorClass = "text-emerald-400";
    glowClass = "bg-emerald-500";
    icon = <Bot size={64} className={colorClass} />;
    title = "Agent 1: AEO Architect";
    subtext = "Structuring semantic HTML & Generating Schema...";
    logs = [
      "> Initializing SEO_MODULE...",
      "> Analyzing input parameters...",
      "> Connecting to Gemini 2.5 Flash...",
      "> Generating tokens...",
      "> Verifying output integrity...",
      "> Processing..."
    ];
  } else if (isAgent2) {
    colorClass = "text-purple-400";
    glowClass = "bg-purple-500";
    icon = <Paintbrush size={64} className={colorClass} />;
    title = "Agent 2: Brand Strategist";
    subtext = "Applying brand voice, colors, and styling...";
    logs = [
      "> Initializing STYLE_ENGINE...",
      "> Reading Brand Personality...",
      "> Applying Design System...",
      "> Optimizing Color Palette...",
      "> Refinement Phase...",
      "> Finalizing Output..."
    ];
  } else {
    colorClass = "text-amber-400";
    glowClass = "bg-amber-500";
    icon = <ShieldCheck size={64} className={colorClass} />;
    title = "Agent 3: AEO Auditor";
    subtext = "Simulating Answer Engine interactions...";
    logs = [
      "> Initializing AUDIT_PROTOCOL...",
      "> Simulating Google SGE Crawl...",
      "> Checking Schema Validity...",
      "> Simulating ChatGPT Search...",
      "> Scoring Content Structure...",
      "> Generating Report..."
    ];
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-fade-in">
      <div className="relative">
        <div className={`absolute inset-0 blur-2xl opacity-40 rounded-full ${glowClass}`}></div>
        <div className={`relative z-10 w-32 h-32 rounded-2xl bg-slate-800 border-2 flex items-center justify-center shadow-2xl border-${glowClass.split('-')[1]}-500`}>
          {icon}
        </div>
        
        {/* Orbiting element */}
        <div className="absolute top-0 left-0 w-full h-full animate-spin-slow pointer-events-none">
           <div className={`absolute -top-2 left-1/2 w-4 h-4 rounded-full ${glowClass.replace('bg-', 'bg-').replace('500', '400')}`}></div>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h2>
      <div className="mt-2 flex items-center gap-2 text-slate-400">
        <Cog className="animate-spin" size={18} />
        <span className="text-lg">
          {subtext}
        </span>
      </div>
      
      <div className="mt-8 max-w-md w-full bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-500 h-32 overflow-hidden relative border border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900 z-10"></div>
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => (
             <p key={i} className={i === logs.length - 1 ? "animate-pulse" : ""}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentLoader;