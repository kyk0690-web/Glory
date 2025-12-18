import React from 'react';
import { SermonFormData, SERMON_TYPES } from '../types';
import { BookOpen, List, MessageSquare, Target, Layout } from 'lucide-react';

interface Step2Props {
  data: SermonFormData;
  updateData: (updates: Partial<SermonFormData>) => void;
}

const Step2Content: React.FC<Step2Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
          내용 및 방향성
        </h2>
        <p className="text-slate-500 mb-6 ml-11">설교의 핵심 메시지와 방향을 설정해주세요.</p>

        <div className="ml-11 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <List className="w-4 h-4 text-slate-400" /> 설교 분류
            </label>
            <select
                value={data.sermonType}
                onChange={(e) => updateData({ sermonType: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm ${data.sermonType ? 'border-slate-300' : 'border-slate-300 text-slate-500'}`}
            >
                <option value="" disabled>선택하세요</option>
                {SERMON_TYPES.map((type) => (
                <option key={type} value={type} className="text-slate-900">{type}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" /> 세부사항
                </label>
                <input
                    type="text"
                    value={data.details}
                    onChange={(e) => updateData({ details: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                    placeholder="예: 갈 바를 알지 못하고 나아감"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-400" />
                핵심 주제/키워드
              </label>
              <input
                type="text"
                value={data.coreTheme}
                onChange={(e) => updateData({ coreTheme: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                placeholder="예: 믿음의 순종"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              참고 성경 범위 (선택)
            </label>
            <input
              type="text"
              value={data.scripture}
              onChange={(e) => updateData({ scripture: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              placeholder="예: 로마서 8장, 시편 23편"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                <span className="flex items-center gap-1"><Layout className="w-3 h-3 text-slate-400" /> 기타 요청사항</span>
            </label>
            <textarea
              value={data.direction}
              onChange={(e) => updateData({ direction: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors h-24 resize-none text-sm"
              placeholder="예: 청소년들이 학교 생활에서 겪는 어려움에 공감해주고, 구체적인 적용점을 제시해주세요."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Content;