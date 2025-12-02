import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import InputForm from './components/InputForm';
import AgentLoader from './components/AgentLoader';
import HtmlPreview from './components/HtmlPreview';
import CodeViewer from './components/CodeViewer';
import ConfirmationModal from './components/ConfirmationModal';
import AuditReport from './components/AuditReport';
import { runAgent1, runAgent2, runAgent3, refineAgent1, refineAgent2 } from './services/geminiService';
import { AppStep, ProductData, BrandData, AuditData } from './types';
import { ArrowRight, Code, Eye, Download, RefreshCw, Sparkles, MessageSquarePlus, Terminal, ShieldCheck } from 'lucide-react';

function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  
  // Content State
  const [agent1Output, setAgent1Output] = useState<string>('');
  const [agent1Prompt, setAgent1Prompt] = useState<string>('');
  
  const [agent2Output, setAgent2Output] = useState<string>('');
  const [agent2Prompt, setAgent2Prompt] = useState<string>('');

  const [auditResult, setAuditResult] = useState<AuditData | null>(null);
  const [auditPrompt, setAuditPrompt] = useState<string>('');

  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'prompt'>('preview');
  
  // Refinement State
  const [refinementInput, setRefinementInput] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  
  // Use a key to force the InputForm to completely reset when starting over
  const [formKey, setFormKey] = useState<number>(0);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirmAction = (title: string, message: string, action: () => void) => {
    setModalConfig({
        isOpen: true,
        title,
        message,
        onConfirm: action
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleStart = async (product: ProductData, brand: BrandData) => {
    setProductData(product);
    setBrandData(brand);
    setStep('agent1_working');
    
    try {
      const result = await runAgent1(product);
      setAgent1Output(result.html);
      setAgent1Prompt(result.prompt);
      setStep('agent1_review');
    } catch (error) {
      alert("Agent 1 encountered an error. Please try again.");
      setStep('input');
    }
  };

  const handleRefineAgent1 = async () => {
    if (!refinementInput.trim()) return;
    
    confirmAction(
      "Regenerate Content?",
      "This will rebuild the webpage based on your new instructions. Any manual code edits you've made to the current version will be overwritten.",
      async () => {
        setIsRefining(true);
        try {
          const result = await refineAgent1(agent1Output, refinementInput);
          setAgent1Output(result.html);
          setAgent1Prompt(result.prompt);
          setRefinementInput('');
          setViewMode('preview'); // Switch to preview to see changes
        } catch (error) {
          alert("Failed to refine content. Please try again.");
        } finally {
          setIsRefining(false);
        }
      }
    );
  };

  const handleProceedToAgent2 = async () => {
    if (!productData || !brandData || !agent1Output) return;
    
    setStep('agent2_working');
    setViewMode('preview'); // Reset view mode for next step
    try {
      const result = await runAgent2(agent1Output, brandData, productData);
      setAgent2Output(result.html);
      setAgent2Prompt(result.prompt);
      setStep('final_review');
    } catch (error) {
       alert("Agent 2 encountered an error. Please try again.");
       setStep('agent1_review');
    }
  };

  const handleRefineAgent2 = async () => {
    if (!refinementInput.trim() || !brandData) return;
    
    confirmAction(
      "Refine Brand Polish?",
      "This will regenerate the branded page based on your instructions. Any manual code edits will be overwritten.",
      async () => {
        setIsRefining(true);
        try {
          const result = await refineAgent2(agent2Output, refinementInput, brandData);
          setAgent2Output(result.html);
          setAgent2Prompt(result.prompt);
          setRefinementInput('');
          setViewMode('preview'); 
        } catch (error) {
          alert("Failed to refine content. Please try again.");
        } finally {
          setIsRefining(false);
        }
      }
    );
  };

  const handleRunAudit = async () => {
     if (!agent2Output) return;
     setStep('agent3_working');
     try {
        const result = await runAgent3(agent2Output);
        setAuditResult(result.audit);
        setAuditPrompt(result.prompt);
        setStep('audit_report');
     } catch (error) {
        alert("Agent 3 encountered an error. Please try again.");
        setStep('final_review');
     }
  };

  const handleDownload = () => {
    const html = (step === 'final_review' || step === 'audit_report') ? agent2Output : agent1Output;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landing-page-${step === 'agent1_review' ? 'raw' : 'final'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
     confirmAction(
       "Start Over?",
       "Are you sure you want to start over? All current progress, generated content, and customizations will be lost.",
       () => {
         setStep('input');
         setAgent1Output('');
         setAgent1Prompt('');
         setAgent2Output('');
         setAgent2Prompt('');
         setAuditResult(null);
         setAuditPrompt('');
         setProductData(null);
         setBrandData(null);
         setFormKey(prev => prev + 1); // Force re-mount of InputForm
         setViewMode('preview');
         setRefinementInput('');
       }
     );
  }

  // Helper to render the review areas
  const renderReviewArea = (
    html: string,
    prompt: string, 
    title: string, 
    isAgent1Review: boolean, 
    setHtml: (val: string) => void
  ) => {
    const isRefineEnabled = true; // Always true now for both steps
    const handleRefine = isAgent1Review ? handleRefineAgent1 : handleRefineAgent2;
    const agentColorClass = isAgent1Review ? 'text-emerald-400' : 'text-purple-400';
    const buttonBgClass = isAgent1Review ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-purple-600 hover:bg-purple-500';

    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)] animate-fade-in gap-4">
         {/* Top Toolbar */}
         <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {title}
              {isRefining && <span className={`text-sm font-normal ${agentColorClass} animate-pulse`}>(Refining...)</span>}
            </h2>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
               <button
                 onClick={() => setViewMode('preview')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  <Eye size={16} /> Preview
               </button>
               <button
                 onClick={() => setViewMode('code')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'code' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  <Code size={16} /> Code
               </button>
               <button
                 onClick={() => setViewMode('prompt')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'prompt' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  <Terminal size={16} /> Prompt
               </button>
            </div>
         </div>
  
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 px-4">
            {/* Main Content Area */}
            <div className={`col-span-1 ${isRefineEnabled ? 'lg:col-span-3' : 'lg:col-span-4'} flex flex-col h-full min-h-[500px] border border-slate-700 rounded-xl overflow-hidden`}>
               {viewMode === 'preview' && (
                  <HtmlPreview html={html} title="Browser Rendering" />
               )}
               {viewMode === 'code' && (
                  <CodeViewer 
                    code={html} 
                    isEditable={true} 
                    onCodeChange={setHtml} 
                  />
               )}
               {viewMode === 'prompt' && (
                  <CodeViewer 
                    code={prompt} 
                    isEditable={false}
                  />
               )}
            </div>
  
            {/* Sidebar for Refinement */}
            {isRefineEnabled && (
              <div className="col-span-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 flex flex-col gap-4">
                 <div className="flex items-center gap-2 text-white font-semibold pb-2 border-b border-slate-700">
                    <MessageSquarePlus size={18} className={agentColorClass}/>
                    {isAgent1Review ? 'AEO Refinement' : 'Brand Polish Refinement'}
                 </div>
                 
                 <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs text-slate-400">
                        {isAgent1Review 
                            ? "Instructions for Structure/Content:" 
                            : "Instructions for Style/Brand:"}
                    </label>
                    <textarea
                      disabled={isRefining}
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      placeholder={isAgent1Review 
                        ? "e.g., 'Add a section about pricing', 'Make the tone more serious'..."
                        : "e.g., 'Make the header dark blue', 'Change the font to serif', 'Add more whitespace'..."
                      }
                      className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white resize-none focus:ring-2 focus:ring-opacity-50 outline-none focus:ring-emerald-500"
                      style={{ 
                          // inline style for focus ring color fallback if generic class isn't enough
                          // relying on tailwind classes above
                       }}
                    />
                    <button
                      onClick={handleRefine}
                      disabled={isRefining || !refinementInput.trim()}
                      className={`mt-2 w-full py-2 ${buttonBgClass} disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg`}
                    >
                      {isRefining ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      {isRefining ? 'Regenerating...' : 'Regenerate'}
                    </button>
                 </div>
  
                 <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1">
                       <Code size={12}/> Manual Edit
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                       Switch to <strong>Code View</strong> to manually edit the HTML. Changes apply instantly to the preview.
                    </p>
                 </div>
              </div>
            )}
         </div>
  
         {/* Footer Actions */}
         <div className="p-4 mt-2 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center backdrop-blur-sm sticky bottom-0 z-20">
            <button onClick={handleReset} className="text-slate-500 hover:text-red-400 text-sm font-medium flex items-center gap-2 px-3 py-2">
               <RefreshCw size={16} /> Start Over
            </button>
            
            <div className="flex gap-3">
               <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 text-slate-200 font-medium hover:bg-slate-800 transition-colors"
               >
                  <Download size={18} /> Save HTML
               </button>
               
               {isAgent1Review ? (
                  <button
                     onClick={handleProceedToAgent2}
                     className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500 shadow-lg shadow-purple-900/50 transition-all hover:translate-x-0.5"
                  >
                     Refine with Agent 2 <ArrowRight size={18} />
                  </button>
               ) : (
                  <button
                     onClick={handleRunAudit}
                     className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 shadow-lg shadow-amber-900/50 transition-all hover:translate-x-0.5"
                  >
                     Run AEO Audit <ShieldCheck size={18} />
                  </button>
               )}
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      <header className="py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
               <span className="font-bold text-white text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">AEO & Brand Agent</h1>
              <p className="text-xs text-slate-400 mt-1">Dual-Stage Generative Workflow</p>
            </div>
          </div>
          {process.env.API_KEY ? (
             <span className="text-xs px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">API Connected</span>
          ) : (
             <span className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400 border border-red-900/50">Missing API Key</span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <StepIndicator currentStep={step} />

        <div className="mt-8">
          {step === 'input' && (
            <InputForm 
                key={formKey} // Force reset when formKey changes
                onSubmit={handleStart} 
                isLoading={false} 
            />
          )}

          {step === 'agent1_working' && (
            <AgentLoader agent="agent1" />
          )}

          {step === 'agent1_review' && renderReviewArea(
            agent1Output,
            agent1Prompt,
            'Stage 1 Output: AEO Optimized Structure',
            true,
            setAgent1Output
          )}

          {step === 'agent2_working' && (
            <AgentLoader agent="agent2" />
          )}

          {step === 'final_review' && renderReviewArea(
            agent2Output, 
            agent2Prompt,
            'Stage 2 Output: Branded & Polished',
            false,
            setAgent2Output
          )}

          {step === 'agent3_working' && (
            <AgentLoader agent="agent3" />
          )}

          {step === 'audit_report' && auditResult && (
             <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    AEO Audit Results
                  </h2>
                  <button onClick={() => setStep('final_review')} className="text-slate-400 hover:text-white flex items-center gap-2">
                    &larr; Back to Editor
                  </button>
                </div>
                <AuditReport data={auditResult} prompt={auditPrompt} />
             </div>
          )}

        </div>
      </main>

      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
}

export default App;