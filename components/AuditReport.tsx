import React from 'react';
import { AuditData } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Search, Bot, BrainCircuit } from 'lucide-react';

interface AuditReportProps {
  data: AuditData;
  prompt: string;
}

const AuditReport: React.FC<AuditReportProps> = ({ data, prompt }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500';
    if (score >= 70) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pass': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'fail': return <XCircle className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const getEngineIcon = (name: string) => {
    if (name.toLowerCase().includes('google')) return <Search size={20} className="text-blue-400" />;
    if (name.toLowerCase().includes('gpt')) return <Bot size={20} className="text-emerald-400" />;
    return <BrainCircuit size={20} className="text-purple-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in p-6 space-y-8">
      
      {/* Header & Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-8 border border-slate-700 backdrop-blur-sm flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-2">AEO Audit Report</h2>
          <p className="text-slate-400 leading-relaxed">{data.summary}</p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-bold ${getScoreColor(data.overallScore)}`}>
            {data.overallScore}
          </div>
          <span className="mt-4 text-sm font-medium text-slate-400 uppercase tracking-wider">Overall AEO Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Checklist */}
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
           <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
             <h3 className="font-semibold text-white flex items-center gap-2">
               <ShieldCheckIcon /> Optimization Checklist
             </h3>
           </div>
           <div className="divide-y divide-slate-800">
             {data.checklist.map((item, idx) => (
               <div key={idx} className="p-4 flex gap-4 hover:bg-slate-800/30 transition-colors">
                 <div className="flex-shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>
                 <div>
                   <h4 className="text-sm font-medium text-slate-200">{item.criteria}</h4>
                   <p className="text-xs text-slate-500 mt-1">{item.details}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Engine Simulations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white px-2">AI Engine Simulations</h3>
          {data.engineSimulations.map((sim, idx) => (
            <div key={idx} className="bg-slate-900 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-medium text-slate-200">
                    {getEngineIcon(sim.engineName)}
                    {sim.engineName}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 ${sim.verdict.toLowerCase().includes('high') || sim.verdict.toLowerCase().includes('strong') || sim.verdict.toLowerCase().includes('likely') ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {sim.verdict}
                  </span>
               </div>
               <div className="bg-slate-950 rounded p-3 text-xs font-mono text-slate-400 leading-relaxed border-l-2 border-slate-700">
                  "{sim.simulatedResponse}"
               </div>
            </div>
          ))}
        </div>

      </div>

      {/* Prompt Used */}
      <div className="mt-8 pt-8 border-t border-slate-800">
        <details className="group">
          <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2">
            View Auditor Prompt
          </summary>
          <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-500 whitespace-pre-wrap">
            {prompt}
          </div>
        </details>
      </div>

    </div>
  );
};

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default AuditReport;