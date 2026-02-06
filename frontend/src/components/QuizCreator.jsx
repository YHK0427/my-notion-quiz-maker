import React, { useState } from 'react';
import { Upload, FileText, Sparkles, Settings, ChevronRight, CheckCircle, Loader, Wand2 } from 'lucide-react';

const QuizCreator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    notebookName: '',
    noteContent: '',
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'short-answer']
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, noteContent: e.target.result });
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Progress Steps */}
        <div className="glass rounded-2xl p-8 border border-slate-200/50 shadow-xl">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: '노트 업로드', icon: Upload },
              { num: 2, label: '설정', icon: Settings },
              { num: 3, label: '완료', icon: CheckCircle }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl scale-110' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      <s.icon className="w-7 h-7" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-bold ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                      Step {s.num}
                    </p>
                    <p className={`text-xs font-medium ${step >= s.num ? 'text-slate-600' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full mx-6 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500 ${
                        step > s.num ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Upload Note */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="glass rounded-2xl p-10 border border-slate-200/50 space-y-8 shadow-xl">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-slate-900 font-display">노트를 업로드하세요</h2>
                <p className="text-slate-600 text-lg">텍스트를 직접 입력하거나 파일을 업로드할 수 있습니다</p>
              </div>

              {/* Notebook Name */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">노트북 이름</label>
                <input
                  type="text"
                  value={formData.notebookName}
                  onChange={(e) => setFormData({ ...formData, notebookName: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 glass font-medium text-lg"
                  placeholder="예: 데이터베이스 설계"
                />
              </div>

              {/* File Upload */}
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".txt,.md,.pdf"
                />
                <label
                  htmlFor="file-upload"
                  className="block border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="space-y-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200 shadow-2xl">
                      {uploadedFile ? (
                        <FileText className="w-10 h-10 text-white" />
                      ) : (
                        <Upload className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div>
                      {uploadedFile ? (
                        <>
                          <p className="text-xl font-bold text-slate-900">{uploadedFile.name}</p>
                          <p className="text-sm text-slate-600 mt-2">클릭하여 다른 파일 선택</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-slate-900">파일을 드래그하거나 클릭하여 업로드</p>
                          <p className="text-sm text-slate-600 mt-2">TXT, MD, PDF 파일 지원</p>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 glass text-slate-500 font-semibold">또는</span>
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">직접 입력</label>
                <textarea
                  value={formData.noteContent}
                  onChange={(e) => setFormData({ ...formData, noteContent: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 min-h-[240px] font-mono text-sm glass resize-none"
                  placeholder="노트 내용을 입력하세요..."
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.notebookName || !formData.noteContent}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
              >
                다음 단계
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Settings */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="glass rounded-2xl p-10 border border-slate-200/50 space-y-8 shadow-xl">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-slate-900 font-display">퀴즈 설정</h2>
                <p className="text-slate-600 text-lg">원하는 퀴즈 형식을 선택하세요</p>
              </div>

              {/* Question Count */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">문제 개수</label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="w-24 px-5 py-3 bg-emerald-50 rounded-xl text-center font-bold text-2xl text-emerald-900 border-2 border-emerald-200">
                    {formData.questionCount}
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">난이도</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'easy', label: '쉬움', gradient: 'from-green-500 to-emerald-500' },
                    { value: 'medium', label: '보통', gradient: 'from-yellow-500 to-orange-500' },
                    { value: 'hard', label: '어려움', gradient: 'from-red-500 to-pink-500' }
                  ].map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                      className={`py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                        formData.difficulty === diff.value
                          ? `bg-gradient-to-r ${diff.gradient} text-white shadow-xl scale-105`
                          : 'glass text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">문제 유형</label>
                <div className="space-y-3">
                  {[
                    { value: 'multiple-choice', label: '객관식', icon: '📝', desc: '4개의 선택지 중 정답 선택' },
                    { value: 'short-answer', label: '단답형', icon: '✍️', desc: '짧은 답 직접 입력' },
                    { value: 'true-false', label: 'O/X', icon: '✓✗', desc: '참 또는 거짓 선택' },
                    { value: 'essay', label: '서술형', icon: '📄', desc: '긴 답변 작성' }
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        formData.questionTypes.includes(type.value)
                          ? 'bg-emerald-50 border-emerald-500 shadow-lg'
                          : 'glass border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.questionTypes.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, questionTypes: [...formData.questionTypes, type.value] });
                          } else {
                            setFormData({ ...formData, questionTypes: formData.questionTypes.filter(t => t !== type.value) });
                          }
                        }}
                        className="w-6 h-6 rounded-lg accent-emerald-600"
                      />
                      <span className="text-3xl">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-lg">{type.label}</p>
                        <p className="text-sm text-slate-600">{type.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200"
                >
                  이전
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={formData.questionTypes.length === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  AI로 퀴즈 생성하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && !isGenerating && (
          <div className="glass rounded-3xl p-16 text-center border border-slate-200/50 space-y-8 shadow-2xl animate-slide-up">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-slate-900 font-display">퀴즈가 생성되었습니다!</h2>
              <p className="text-slate-600 text-xl">
                총 <span className="font-bold text-emerald-600">{formData.questionCount}개</span>의 문제가 준비되었습니다
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200">
                학습 시작하기
              </button>
              <button 
                onClick={() => {
                  setStep(1);
                  setFormData({ notebookName: '', noteContent: '', questionCount: 10, difficulty: 'medium', questionTypes: ['multiple-choice', 'short-answer'] });
                }}
                className="px-10 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200"
              >
                새 퀴즈 만들기
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="glass rounded-3xl p-16 text-center border border-slate-200/50 space-y-8 shadow-2xl">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Loader className="w-14 h-14 text-white animate-spin" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-slate-900 font-display">AI가 퀴즈를 생성하고 있습니다</h2>
              <p className="text-slate-600 text-lg">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCreator;