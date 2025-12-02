import React, { useState, useRef } from 'react';
import { ProductData, BrandData } from '../types';
import { ArrowRight, Sparkles, Upload, FileText, X } from 'lucide-react';

interface InputFormProps {
  onSubmit: (product: ProductData, brand: BrandData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [product, setProduct] = useState<ProductData>({
    productName: '',
    features: '',
    targetAudience: '',
    cta: 'Get a Free Quote'
  });

  const [brand, setBrand] = useState<BrandData>({
    personality: 'Trustworthy & Professional',
    tone: 'Confident but approachable',
    primaryColor: '#2563EB',
    brandingDocument: ''
  });

  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const text = await file.text();
      setBrand(prev => ({ ...prev, brandingDocument: text }));
    }
  };

  const clearFile = () => {
    setFileName('');
    setBrand(prev => ({ ...prev, brandingDocument: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product, brand);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
          Product Details
        </h2>
        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
            <input
              required
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. SecureLife Term Plus"
              value={product.productName}
              onChange={(e) => setProduct({ ...product, productName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Key Features / Benefits</label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. No medical exam required, instant approval, fixed premiums..."
              value={product.features}
              onChange={(e) => setProduct({ ...product, features: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Target Audience</label>
              <input
                required
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. New parents, homeowners"
                value={product.targetAudience}
                onChange={(e) => setProduct({ ...product, targetAudience: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Call to Action</label>
              <input
                required
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Speak to an Advisor"
                value={product.cta}
                onChange={(e) => setProduct({ ...product, cta: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
           <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
           Brand Strategy
        </h2>
        
        <div className="grid gap-6">
          {/* File Upload Section */}
          <div className="bg-slate-900/50 border border-dashed border-slate-600 rounded-xl p-6 text-center hover:bg-slate-900 transition-colors">
            {!brand.brandingDocument ? (
              <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 text-purple-400">
                  <Upload size={24} />
                </div>
                <h3 className="text-sm font-semibold text-white">Upload Brand Guidelines</h3>
                <p className="text-xs text-slate-400 mt-1 mb-3">Upload a text file (txt, md, json) with your brand voice & rules.</p>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-white transition-colors"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{fileName}</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <Sparkles size={10} /> Brand Context Loaded
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={clearFile}
                  className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.json,.csv"
              onChange={handleFileChange} 
            />
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider">Or define manually</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <div className={`grid gap-5 transition-opacity duration-300 ${brand.brandingDocument ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Brand Personality</label>
                <input
                  required={!brand.brandingDocument}
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Modern, Tech-savvy"
                  value={brand.personality}
                  onChange={(e) => setBrand({ ...brand, personality: e.target.value })}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Brand Tone</label>
                <input
                  required={!brand.brandingDocument}
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Friendly, Empathetic"
                  value={brand.tone}
                  onChange={(e) => setBrand({ ...brand, tone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Brand Color Theme</label>
               <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="h-10 w-10 rounded border-0 cursor-pointer"
                    value={brand.primaryColor}
                    onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  />
                  <input
                    type="text"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    value={brand.primaryColor}
                    onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          {isLoading ? (
            <>
              <Sparkles className="animate-spin" size={20} />
              Initializing Agents...
            </>
          ) : (
            <>
              Start Generation Workflow
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;