import React, { useState, useEffect } from 'react';
import { SermonFormData, DEPARTMENTS, FREQUENCY_OPTIONS, SERMON_TIME_OPTIONS } from '../types';
import { Users, Clock } from 'lucide-react';

interface Step1Props {
  data: SermonFormData;
  updateData: (updates: Partial<SermonFormData>) => void;
}

const Step1Department: React.FC<Step1Props> = ({ data, updateData }) => {
  const [frequencyMode, setFrequencyMode] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');

  // Sync frequency mode when data.frequency changes (e.g. loading from URL)
  useEffect(() => {
    if (data.frequency) {
      if (FREQUENCY_OPTIONS.includes(data.frequency)) {
        setFrequencyMode(data.frequency);
      } else {
        setFrequencyMode('기타 (직접 입력)');
        setCustomFrequency(data.frequency);
      }
    } else {
      setFrequencyMode('');
      setCustomFrequency('');
    }
  }, [data.frequency]);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFrequencyMode(val);
    if (val !== '기타 (직접 입력)') {
      updateData({ frequency: val });
    } else {
      updateData({ frequency: customFrequency });
    }
  };

  const handleCustomFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomFrequency(val);
    updateData({ frequency: val });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
          기본 정보
        </h2>
        <p className="text-slate-500 mb-6 ml-11">설교의 대상과 일정을 설정해주세요.</p>
        
        <div className="ml-11 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              대상 부서
            </label>
            <select
              value={data.department}
              onChange={(e) => updateData({ department: e.target.value })}
              className={`w-full px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm ${data.department ? 'border-slate-300' : 'border-slate-300 text-slate-500'}`}
            >
              <option value="" disabled>선택하세요</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.label} className="text-slate-900">
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                설교 횟수
              </label>
              <select
                value={frequencyMode}
                onChange={handleFrequencyChange}
                className={`w-full px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm ${frequencyMode ? 'border-slate-300' : 'border-slate-300 text-slate-500'}`}
              >
                <option value="" disabled>선택하세요</option>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-900">{opt}</option>
                ))}
              </select>
              {frequencyMode === '기타 (직접 입력)' && (
                <input 
                  type="text"
                  value={customFrequency}
                  onChange={handleCustomFrequencyChange}
                  placeholder="예: 특별 새벽기도회 5일"
                  className="w-full mt-2 px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm animate-fade-in"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                설교 시간
              </label>
              <select
                value={data.sermonTime}
                onChange={(e) => updateData({ sermonTime: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm ${data.sermonTime ? 'border-slate-300' : 'border-slate-300 text-slate-500'}`}
              >
                <option value="" disabled>선택하세요</option>
                {SERMON_TIME_OPTIONS.map((time) => (
                  <option key={time} value={time} className="text-slate-900">{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Department;