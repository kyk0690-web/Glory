import React, { useState, useEffect } from 'react';
import { SermonFormData } from '../types';
import { generateSermonPlan } from '../services/geminiService';
import { Copy, Bot, CheckCheck, Loader2, Sparkles, AlertCircle, Paperclip } from 'lucide-react';

interface ResultPreviewProps {
  data: SermonFormData;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ data }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Construct the prompt string
  useEffect(() => {
    const prompt = `
# 설교 계획 작성 요청

**역할:**
1. 당신은 기독교대한성결교회의 목회자입니다.
2. 당신은 부교역자로서 담임목사님의 목회를 돕는 사람입니다.

**목표:** 다음 정보를 바탕으로 체계적이고 은혜로운 **설교 계획서**를 작성해 주세요.

## 1. 기본 정보
- **대상:** ${data.department || '미지정'}
- **설교 횟수/기간:** ${data.frequency || '미지정'}
- **설교 시간:** ${data.sermonTime || '미지정'}

## 2. 내용 및 방향
- **설교 분류:** ${data.sermonType || '미지정'}
- **세부 사항:** ${data.details || '미지정'}
- **핵심 주제/키워드:** ${data.coreTheme || '미지정'}
${data.scripture ? `- **참고 성경 범위:** ${data.scripture}` : ''}
- **기타 요청사항:** ${data.direction || '없음'}

${data.referenceFileName ? `## 3. 참고 자료\n[첨부된 PDF 파일: ${data.referenceFileName}]\n이 파일의 내용을 분석하여 설교 계획에 반영해주세요.\n` : ''}

## ${data.referenceFileName ? '4' : '3'}. 요청 결과물 형식 및 조건
반드시 아래와 같은 **표(Table)** 형식으로 작성해주세요.

| 주차 | 날짜(월/주) | 설교 제목 | 성경 본문 | 핵심 주제 (One Message) | 2부 활동/적용 아이디어 |
|:---:|:---:|---|---|---|---|
| 1주 | 1월 1주 | ... | ... | ... | ... |

### 추가 요청사항
1. **구체적 구성**: 단순한 나열이 아니라, 설교의 흐름이 이어지도록 구성해주세요.
2. **적용점 포함**: 삶에 실제적으로 적용할 수 있는 포인트(Application)를 포함해주세요.
3. **활동 제안**: 설교 후 2부 순서나 분반 공부에서 할 수 있는 간단한 활동 아이디어를 포함해주세요.
`.trim();
    setGeneratedPrompt(prompt);
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass both prompt text and PDF data (if available) to the service
      const result = await generateSermonPlan(generatedPrompt, data.referenceFile);
      setAiResult(result);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Prompt Display Section */}
      <div className="flex flex-col flex-1 min-h-[300px]">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
             <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
             실시간 프롬프트 미리보기
          </label>
          <button
            onClick={handleCopy}
            className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-2 py-1 rounded"
          >
            {copied ? <CheckCheck className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? '복사됨' : '복사하기'}
          </button>
        </div>
        <div className="bg-slate-800 text-slate-200 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[400px] border border-slate-700 shadow-inner flex-grow relative text-left">
          {generatedPrompt}
          {data.referenceFileName && (
            <div className="absolute bottom-4 right-4 bg-slate-700/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-600 flex items-center gap-2 text-xs text-slate-300">
              <Paperclip className="w-3 h-3" />
              {data.referenceFileName} 포함됨
            </div>
          )}
        </div>
        
        <div className="mt-4">
           <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                설교 계획 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI 설교 계획 생성하기
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Generation Section */}
      { (aiResult || loading || error) && (
        <div className="flex flex-col flex-1 min-h-[400px] animate-fade-in">
           <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" />
              AI 생성 결과
            </label>
            {aiResult && (
               <button 
                  onClick={() => setAiResult(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs underline"
                >
                  닫기
                </button>
            )}
          </div>
          
          <div className={`bg-white rounded-xl border ${aiResult ? 'border-indigo-200' : 'border-slate-200'} p-0 flex flex-col h-full shadow-sm relative overflow-hidden`}>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full bg-white/90 backdrop-blur-sm absolute inset-0 z-10">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-indigo-900 font-medium">
                  {data.referenceFileName ? "PDF 자료를 분석하고 설교를 구상 중입니다..." : "깊이 있는 내용을 구상 중입니다..."}
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <p className="text-red-800 font-medium mb-2">오류가 발생했습니다</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {aiResult && !loading && (
              <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-slate-800 prose prose-indigo max-w-none bg-indigo-50/30 text-left">
                {aiResult.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line.startsWith('#') ? (
                      <h3 className="font-bold text-lg mt-4 mb-2 text-indigo-900 border-b border-indigo-100 pb-1">
                        {line.replace(/^#+\s/, '')}
                      </h3>
                    ) : line.startsWith('**') || line.includes('**') ? (
                      <p className="mb-2" dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                      }} />
                    ) : line.startsWith('|') ? (
                       <div className="overflow-x-auto my-1">
                         <p className="mb-0 whitespace-pre font-mono text-xs md:text-sm bg-white p-2 rounded border border-indigo-100">{line}</p>
                       </div>
                    ) : (
                      <p className="mb-2">{line}</p>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPreview;