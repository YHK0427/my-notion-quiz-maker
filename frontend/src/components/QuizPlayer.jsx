import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Clock, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

const QuizPlayer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: '데이터베이스의 ACID 속성 중 "A"가 의미하는 것은 무엇인가요?',
      options: [
        'Atomicity (원자성)',
        'Availability (가용성)',
        'Authenticity (진정성)',
        'Accuracy (정확성)'
      ],
      correct: 0,
      explanation: 'ACID의 A는 Atomicity(원자성)를 의미합니다. 트랜잭션의 연산들이 모두 성공하거나 모두 실패해야 한다는 특성입니다.'
    },
    {
      id: 2,
      type: 'true-false',
      question: 'NoSQL 데이터베이스는 관계형 스키마를 사용한다.',
      options: ['맞다', '틀리다'],
      correct: 1,
      explanation: 'NoSQL 데이터베이스는 비관계형(non-relational) 데이터베이스로, 유연한 스키마나 스키마리스 구조를 사용합니다.'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'SQL에서 중복된 값을 제거하고 고유한 값만 선택하는 키워드는?',
      options: [
        'UNIQUE',
        'DISTINCT',
        'DIFFERENT',
        'SEPARATE'
      ],
      correct: 1,
      explanation: 'DISTINCT 키워드는 SELECT 쿼리에서 중복된 레코드를 제거하고 고유한 값만 반환합니다.'
    },
    {
      id: 4,
      type: 'short-answer',
      question: 'JOIN 연산 중에서 양쪽 테이블의 모든 레코드를 포함하는 JOIN의 이름은?',
      correct: 'FULL OUTER JOIN',
      explanation: 'FULL OUTER JOIN은 왼쪽과 오른쪽 테이블의 모든 레코드를 포함하며, 매칭되지 않는 부분은 NULL로 채웁니다.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    const newAnswers = { ...answers };
    newAnswers[currentQuestion] = {
      selected: selectedAnswer,
      correct: questions[currentQuestion].correct === selectedAnswer
    };
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.selected ?? null);
      setShowResult(false);
    }
  };

  const toggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQuestion)) {
      newFlags.delete(currentQuestion);
    } else {
      newFlags.add(currentQuestion);
    }
    setFlaggedQuestions(newFlags);
  };

  const calculateScore = () => {
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  if (quizCompleted) {
    const score = calculateScore();
    const correctCount = Object.values(answers).filter(a => a.correct).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass rounded-3xl p-12 border border-slate-200/50 text-center space-y-8 shadow-2xl">
            {/* Score Circle */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${score * 5.53} 553`}
                  className={`${
                    score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'
                  } transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-5xl font-bold text-slate-900 font-display">{score}%</p>
                  <p className="text-sm text-slate-600 mt-1 font-semibold">점수</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-900 font-display">퀴즈 완료!</h2>
              <p className="text-lg text-slate-600">
                총 {questions.length}문제 중 <span className="font-bold text-emerald-600">{correctCount}문제</span>를 맞혔습니다
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="glass rounded-xl p-4 border border-emerald-200">
                <p className="text-3xl font-bold text-emerald-600 font-display">{correctCount}</p>
                <p className="text-sm text-slate-600 font-semibold">정답</p>
              </div>
              <div className="glass rounded-xl p-4 border border-red-200">
                <p className="text-3xl font-bold text-red-600 font-display">{questions.length - correctCount}</p>
                <p className="text-sm text-slate-600 font-semibold">오답</p>
              </div>
              <div className="glass rounded-xl p-4 border border-violet-200">
                <p className="text-3xl font-bold text-violet-600 font-display">{formatTime(timeSpent)}</p>
                <p className="text-sm text-slate-600 font-semibold">소요시간</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200">
                오답 다시 풀기
              </button>
              <button className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200">
                대시보드로
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-violet-50/30">
      {/* Header */}
      <header className="glass border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold">
              <ArrowLeft className="w-5 h-5" />
              <span>나가기</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="font-mono font-bold text-slate-900">{formatTime(timeSpent)}</span>
              </div>
              
              <button
                onClick={toggleFlag}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  flaggedQuestions.has(currentQuestion)
                    ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300'
                    : 'glass text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Flag className="w-5 h-5" fill={flaggedQuestions.has(currentQuestion) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">
                문제 {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-slate-600 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass rounded-3xl p-10 border border-slate-200/50 shadow-2xl space-y-8">
          {/* Question Type Badge */}
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border-2 border-emerald-200">
              {question.type === 'multiple-choice' && '객관식'}
              {question.type === 'true-false' && 'O/X'}
              {question.type === 'short-answer' && '단답형'}
            </span>
          </div>

          {/* Question */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.type === 'short-answer' ? (
              <input
                type="text"
                value={selectedAnswer || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-200 text-lg font-medium glass"
                placeholder="답을 입력하세요..."
                disabled={showResult}
              />
            ) : (
              question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = question.correct === index;
                const showCorrectAnswer = showResult && isCorrect;
                const showWrongAnswer = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      showCorrectAnswer
                        ? 'bg-emerald-50 border-emerald-500 shadow-xl scale-[1.02]'
                        : showWrongAnswer
                        ? 'bg-red-50 border-red-500 shadow-lg'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-lg scale-[1.02]'
                        : 'glass border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    } ${showResult ? 'cursor-default' : 'hover:scale-[1.01]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                        showCorrectAnswer
                          ? 'bg-emerald-500 text-white'
                          : showWrongAnswer
                          ? 'bg-red-500 text-white'
                          : isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {showCorrectAnswer ? (
                          <Check className="w-6 h-6" />
                        ) : showWrongAnswer ? (
                          <X className="w-6 h-6" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className={`text-lg ${
                        showCorrectAnswer || showWrongAnswer || isSelected
                          ? 'font-bold'
                          : 'font-medium'
                      } text-slate-900`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={`p-6 rounded-xl border-2 ${
              answers[currentQuestion]?.correct
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  answers[currentQuestion]?.correct
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                }`}>
                  {answers[currentQuestion]?.correct ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <X className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-bold mb-2 text-lg ${
                    answers[currentQuestion]?.correct ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {answers[currentQuestion]?.correct ? '정답입니다! 🎉' : '오답입니다'}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>

            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                답안 제출
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? '결과 보기' : '다음 문제'}
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 glass rounded-2xl p-6 border border-slate-200/50 shadow-lg">
          <h3 className="text-sm font-bold text-slate-700 mb-4">문제 탐색</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => {
              const isAnswered = answers[index] !== undefined;
              const isCurrent = index === currentQuestion;
              const isFlagged = flaggedQuestions.has(index);

              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setSelectedAnswer(answers[index]?.selected ?? null);
                    setShowResult(false);
                  }}
                  className={`aspect-square rounded-xl font-bold text-sm transition-all duration-200 relative ${
                    isCurrent
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl scale-110'
                      : isAnswered
                      ? answers[index].correct
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-2 border-emerald-300'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'
                      : 'glass text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-500 text-yellow-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPlayer;