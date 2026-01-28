import React from 'react';

interface VisualCardProps {
  text: string;
  emoji?: string;
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'red';
  keyword?: string;
}

const VisualCard: React.FC<VisualCardProps> = ({ text, emoji, gradient = 'blue', keyword }) => {
  const gradients = {
    blue: 'from-blue-600 via-blue-500 to-cyan-500',
    purple: 'from-purple-600 via-purple-500 to-pink-500',
    green: 'from-green-600 via-emerald-500 to-teal-500',
    orange: 'from-orange-600 via-amber-500 to-yellow-500',
    pink: 'from-pink-600 via-rose-500 to-red-500',
    red: 'from-red-600 via-red-500 to-orange-500',
  };

  return (
    <div className={`relative w-full aspect-[1.91/1] rounded-xl overflow-hidden bg-gradient-to-br ${gradients[gradient]} p-8 flex items-center justify-center shadow-2xl`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-4">
        {keyword && (
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-2">
            <span className="text-sm font-semibold text-white uppercase tracking-wide">#{keyword}</span>
          </div>
        )}
        {emoji && (
          <div className="text-6xl md:text-7xl animate-bounce">
            {emoji}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg px-4">
          {text}
        </h2>
      </div>

      {/* X logo watermark */}
      <div className="absolute bottom-4 right-4 opacity-20">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">𝕏</span>
        </div>
      </div>
    </div>
  );
};

export default VisualCard;
