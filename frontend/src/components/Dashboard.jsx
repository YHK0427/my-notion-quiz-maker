import React, { useState } from 'react';
import { Plus, BookOpen, Clock, Trash2, Edit2, Play, LogOut, Search, Zap, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [notebooks, setNotebooks] = useState([
    {
      id: 1,
      name: '데이터베이스 설계',
      questionCount: 15,
      lastStudied: '2일 전',
      progress: 73,
      category: 'CS',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 2,
      name: '운영체제 개념',
      questionCount: 23,
      lastStudied: '5일 전',
      progress: 45,
      category: 'CS',
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 3,
      name: '알고리즘 기초',
      questionCount: 18,
      lastStudied: '1주 전',
      progress: 90,
      category: 'Algorithm',
      color: 'from-orange-500 to-pink-500'
    },
    {
      id: 4,
      name: '네트워크 프로토콜',
      questionCount: 12,
      lastStudied: '3일 전',
      progress: 60,
      category: 'Network',
      color: 'from-blue-500 to-cyan-500'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const totalQuestions = notebooks.reduce((acc, nb) => acc + nb.questionCount, 0);
  const avgProgress = Math.round(notebooks.reduce((acc, nb) => acc + nb.progress, 0) / notebooks.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30">
      {/* Header */}
      <header className="glass border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">Quiz Maker</h1>
                <p className="text-sm text-slate-600 font-medium">나의 학습 노트</p>
              </div>
            </div>

            <button className="px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all duration-200 flex items-center gap-2 font-semibold">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: '전체 노트', 
              value: notebooks.length, 
              icon: BookOpen, 
              gradient: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-50'
            },
            { 
              label: '총 문제', 
              value: totalQuestions, 
              icon: Zap, 
              gradient: 'from-violet-500 to-purple-500',
              bg: 'bg-violet-50'
            },
            { 
              label: '평균 진행률', 
              value: `${avgProgress}%`, 
              icon: TrendingUp, 
              gradient: 'from-orange-500 to-pink-500',
              bg: 'bg-orange-50'
            }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="glass rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2 font-semibold">{stat.label}</p>
                  <p className="text-4xl font-bold text-slate-900 font-display">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Create */}
        <div className="glass rounded-2xl p-6 border border-slate-200/50 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="노트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 glass font-medium"
              />
            </div>
            <button className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              새 노트 만들기
            </button>
          </div>
        </div>

        {/* Notebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notebooks.map((notebook, idx) => (
            <div
              key={notebook.id}
              className="glass rounded-2xl overflow-hidden border border-slate-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Color Header */}
              <div className={`h-2 bg-gradient-to-r ${notebook.color}`}></div>
              
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                        {notebook.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">
                      {notebook.name}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      {notebook.lastStudied}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 py-4 border-t border-b border-slate-100">
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-slate-900 font-display">
                      {notebook.questionCount}
                    </p>
                    <p className="text-xs text-slate-600 font-semibold">문제</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-slate-900 font-display">
                      {notebook.progress}%
                    </p>
                    <p className="text-xs text-slate-600 font-semibold">진행률</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${notebook.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${notebook.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                    <Play className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    학습 시작
                  </button>
                  <button className="p-3.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group/edit">
                    <Edit2 className="w-5 h-5 text-slate-600 group-hover/edit:text-slate-900" />
                  </button>
                  <button className="p-3.5 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 group/del">
                    <Trash2 className="w-5 h-5 text-red-600 group-hover/del:text-red-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notebooks.length === 0 && (
          <div className="glass rounded-3xl p-16 text-center border border-slate-200/50 shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 font-display">아직 노트가 없습니다</h3>
            <p className="text-slate-600 mb-8 text-lg">첫 노트를 만들어 학습을 시작해보세요!</p>
            <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 inline-flex items-center gap-3">
              <Plus className="w-6 h-6" />
              첫 노트 만들기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;