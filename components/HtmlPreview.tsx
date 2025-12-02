import React from 'react';

interface HtmlPreviewProps {
  html: string;
  title: string;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ html, title }) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500"></div>
           <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <span className="ml-2">{title}</span>
        </span>
        <div className="px-2 py-0.5 rounded bg-slate-700 text-[10px] text-slate-400 font-mono">
            Read-only Preview
        </div>
      </div>
      <div className="flex-1 bg-white relative">
        <iframe
          title="Content Preview"
          srcDoc={html}
          className="w-full h-full absolute inset-0 border-0"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default HtmlPreview;