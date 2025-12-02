import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
  isEditable?: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, onCodeChange, isEditable = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If it is editable, it's Code. If it's NOT editable and we have onChange, that's weird but ok.
  // If it's NOT editable and NO onChange, it could be the Prompt view or Code Readonly view.
  // We can treat them similarly, but prompts should wrap lines.
  
  const isPromptView = !isEditable && !code.trim().startsWith('<');

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
       <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
          {isEditable ? 'Code Editor' : (isPromptView ? 'Prompt Details' : 'Raw Source Code')}
          {isEditable && <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Editable</span>}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {isEditable && onCodeChange ? (
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full h-full bg-slate-900 text-blue-300 font-mono text-sm p-4 outline-none resize-none border-0 focus:ring-0"
            spellCheck={false}
          />
        ) : (
          <div className="w-full h-full overflow-auto p-4">
            <pre className={`font-mono text-sm text-slate-300 ${isPromptView ? 'whitespace-pre-wrap' : 'whitespace-pre-wrap break-all'}`}>
                {code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;