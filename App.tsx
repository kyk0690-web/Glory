import React, { useState, useRef, useEffect } from 'react';
import Step1Department from './components/Step1Department';
import Step2Content from './components/Step2Content';
import ResultPreview from './components/ResultPreview';
import { SermonFormData } from './types';
import { BookOpenCheck, FileText, Paperclip, Trash2, UploadCloud, Users, Mic2, Share2, Check } from 'lucide-react';

const INITIAL_DATA: SermonFormData = {
  department: '',
  frequency: '',
  period: '',
  sermonType: '',
  coreTheme: '',
  details: '',
  scripture: '',
  direction: '',
  referenceFile: null,
  referenceFileName: null,
  sermonTime: '',
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<SermonFormData>(INITIAL_DATA);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load state from URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFormData: Partial<SermonFormData> = {};
    let hasData = false;

    const fields: (keyof SermonFormData)[] = [
      'department', 'frequency', 'period', 'sermonType', 
      'coreTheme', 'details', 'scripture', 'direction', 
      'sermonTime'
    ];

    fields.forEach(field => {
      const value = params.get(field);
      if (value) {
        newFormData[field] = value;
        hasData = true;
      }
    });

    if (hasData) {
      setFormData(prev => ({ ...prev, ...newFormData }));
    }
  }, []);

  const updateData = (updates: Partial<SermonFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateData({ 
          referenceFile: base64,
          referenceFileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    updateData({ referenceFile: null, referenceFileName: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    
    // Add all string fields to URL params
    Object.entries(formData).forEach(([key, value]) => {
      // Exclude large files and nulls
      if (key !== 'referenceFile' && key !== 'referenceFileName' && value) {
        params.set(key, value as string);
      }
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpenCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Sermon Planner <span className="text-indigo-600">Pro</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCopied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
              title="현재 설정을 링크로 공유하기"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {isCopied ? '링크 복사됨!' : '설정 공유'}
            </button>
            <div className="hidden sm:block text-xs sm:text-sm text-slate-500 font-medium border-l border-slate-200 pl-3">
               설교 기획 어시스턴트
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Basic Info Card (Using Component) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <Step1Department data={formData} updateData={updateData} />
            </div>

            {/* 2. Content Info Card (Using Component) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <Step2Content data={formData} updateData={updateData} />
            </div>

            {/* 3. Reference Material Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Paperclip className="w-5 h-5 text-indigo-500" />
                참고 자료 (PDF)
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-slate-400" /> 교회 커리큘럼, 공과 목차, 혹은 연간계획서가 있다면 첨부해주세요.</span>
                </label>
                
                <div className="mt-2">
                  {!formData.referenceFileName ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
                        <UploadCloud className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">클릭하여 PDF 업로드</p>
                      <p className="text-xs text-slate-400 mt-1">최대 10MB</p>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{formData.referenceFileName}</p>
                          <p className="text-xs text-green-600">업로드 완료</p>
                        </div>
                      </div>
                      <button 
                        onClick={removeFile}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="application/pdf"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Preview & Result */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <ResultPreview data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;