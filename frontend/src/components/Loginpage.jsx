import React, { useState } from 'react';
import { ArrowRight, BookOpen, Sparkles, Lock, User, Zap, Target, TrendingUp } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-10 px-8">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full shadow-sm border border-emerald-200/50">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-900">AI로 학습을 스마트하게</span>
            </div>
            
            <h1 className="text-7xl font-bold text-slate-900 leading-tight font-display tracking-tight">
              나만의
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-violet-600 bg-clip-text text-transparent">
                퀴즈 메이커
              </span>
            </h1>
            
            <p className="text-2xl text-slate-600 leading-relaxed font-medium">
              노트를 퀴즈로 바꾸는 가장 빠른 방법
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: Zap, text: 'AI가 1분만에 퀴즈 생성', color: 'from-yellow-500 to-orange-500' },
              { icon: Target, text: '맞춤형 난이도와 문제 유형', color: 'from-emerald-500 to-teal-500' },
              { icon: TrendingUp, text: '학습 진도 자동 추적', color: 'from-violet-500 to-purple-500' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-4 p-5 glass rounded-2xl border border-slate-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-slate-700 font-semibold text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="glass rounded-3xl shadow-2xl border border-white/50 p-10 space-y-8 max-w-md mx-auto w-full">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-display">
              {isLogin ? '다시 만나서 반가워요' : '함께 시작해요'}
            </h2>
            <p className="text-slate-600">
              {isLogin ? '계속해서 학습을 진행하세요' : '새로운 학습 여정을 시작하세요'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                사용자 이름
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 glass font-medium"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                비밀번호 {!isLogin && '(선택사항)'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 glass font-medium"
                placeholder="비밀번호를 입력하세요"
                required={isLogin}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-slide-up">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 glass font-medium"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {isLogin ? '로그인' : '회원가입'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass text-slate-500 font-medium">또는</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            {isLogin ? '새 계정 만들기' : '이미 계정이 있으신가요?'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;