import React from 'react';
import { AppStep } from '../types';
import { ClipboardList, Bot, Paintbrush, ShieldCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: 'input', label: 'Briefing', icon: ClipboardList },
  { id: 'agent1', label: 'AEO Generation', icon: Bot },
  { id: 'agent2', label: 'Brand Polish', icon: Paintbrush },
  { id: 'agent3', label: 'AEO Audit', icon: ShieldCheck },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getStepStatus = (stepId: string) => {
    // Input Step
    if (stepId === 'input') {
      return currentStep === 'input' ? 'active' : 'completed';
    }

    // Agent 1
    if (stepId === 'agent1') {
      if (currentStep === 'input') return 'pending';
      if (['agent1_working', 'agent1_review'].includes(currentStep)) return 'active';
      return 'completed';
    }

    // Agent 2
    if (stepId === 'agent2') {
       if (['input', 'agent1_working', 'agent1_review'].includes(currentStep)) return 'pending';
       if (['agent2_working', 'final_review'].includes(currentStep)) return 'active';
       return 'completed';
    }

    // Agent 3 (Audit)
    if (stepId === 'agent3') {
       if (['agent3_working', 'audit_report'].includes(currentStep)) return 'active';
       return 'pending';
    }

    return 'pending';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
        
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          let circleClass = "bg-slate-800 text-slate-500 border-slate-700";
          if (status === 'active') circleClass = "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]";
          if (status === 'completed') circleClass = "bg-emerald-600 text-white border-emerald-500";

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${circleClass}`}>
                <Icon size={20} />
              </div>
              <span className={`mt-2 text-xs font-medium ${status === 'pending' ? 'text-slate-500' : 'text-slate-300'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;