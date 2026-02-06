import React, { useState } from 'react';
import { RefreshCw, BookOpen, ChevronRight, Check, FileText, Lock } from 'lucide-react';

const NotionConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notionPages, setNotionPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Mock Notion pages
  const mockPages = [
    {
      id: '1',
      title: '데이터베이스 정규화',
      icon: '📊',
      lastEdited: '2024-01-15',
      wordCount: 1250
    },
    {
      id: '2',
      title: '운영체제 스케줄링',
      icon: '⚙️',
      lastEdited: '2024-01-14',
      wordCount: 980
    },
    {
      id: '3',
      title: '네트워크 계층 모델',
      icon: '🌐',
      lastEdited: '2024-01-13',
      wordCount: 1500
    },
    {
      id: '4',
      title: 'RESTful API 설계',
      icon: '🔌',
      lastEdited: '2024-01-12',
      wordCount: 1100
    }
  ];

  const handleConnect = async () => {
    setLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnected(true);
      setNotionPages(mockPages);
      setLoading(false);
    }, 1500);
  };

  const togglePageSelection = (pageId) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const handleImport = () => {
    console.log('Importing pages:', Array.from(selectedPages));
    // Navigate to quiz creator with selected pages
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {!isConnected ? (
          /* Connection Screen */
          <div className="glass rounded-3xl p-12 border border-slate-200/50 text-center space-y-8 shadow-2xl">
            {/* Notion Logo */}
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl">
              <BookOpen className="w-14 h-14 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-slate-900 font-display">Notion 연동</h1>
              <p className="text-xl text-slate-600 max-w-md mx-auto">
                Notion 계정을 연결하여 노트를 불러오고 자동으로 퀴즈를 생성하세요
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              {[
                { icon: Lock, text: '안전한 OAuth 인증', color: 'from-emerald-500 to-teal-500' },
                { icon: RefreshCw, text: '자동 동기화', color: 'from-violet-500 to-purple-500' },
                { icon: BookOpen, text: '모든 페이지 접근', color: 'from-orange-500 to-pink-500' }
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 p-5 glass rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 text-center">{feature.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleConnect}
              disabled={loading}
              className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xl font-bold hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  연결 중...
                </>
              ) : (
                <>
                  <BookOpen className="w-6 h-6" />
                  Notion 연결하기
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 max-w-lg mx-auto pt-4">
              Notion 연결 시 읽기 권한만 요청합니다. 언제든지 연결을 해제할 수 있습니다.
            </p>
          </div>
        ) : (
          /* Page Selection Screen */
          <>
            <div className="glass rounded-2xl p-6 border border-slate-200/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display">Notion 페이지</h2>
                    <p className="text-sm text-slate-600 font-medium">퀴즈로 만들 페이지를 선택하세요</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConnected(false)}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  연결 해제
                </button>
              </div>
            </div>

            {/* Pages List */}
            <div className="space-y-3">
              {notionPages.map((page) => {
                const isSelected = selectedPages.has(page.id);
                
                return (
                  <button
                    key={page.id}
                    onClick={() => togglePageSelection(page.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-xl scale-[1.02]'
                        : 'glass border-slate-200 hover:border-emerald-300 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-slate-300 glass'
                      }`}>
                        {isSelected && <Check className="w-5 h-5 text-white" />}
                      </div>

                      {/* Icon */}
                      <div className="text-4xl">{page.icon}</div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {page.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                          <span>마지막 수정: {page.lastEdited}</span>
                          <span>•</span>
                          <span>{page.wordCount.toLocaleString()} 단어</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className={`w-6 h-6 transition-all duration-200 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Import Button */}
            {selectedPages.size > 0 && (
              <div className="glass rounded-2xl p-6 border border-slate-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedPages.size}개 페이지 선택됨
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      선택한 페이지에서 퀴즈가 생성됩니다
                    </p>
                  </div>
                  <button
                    onClick={handleImport}
                    className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    퀴즈 만들기
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotionConnect;