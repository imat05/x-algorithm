import React, { useState } from 'react';
import { ViralScoreData, Language } from '../types';
import Gauge from './Gauge';
import { CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Copy, Check, Share2, Lightbulb, ArrowRightCircle } from 'lucide-react';

interface ResultSectionProps {
  data: ViralScoreData;
  lang: Language;
}

const ResultSection: React.FC<ResultSectionProps> = ({ data, lang }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const t = {
    verdict: lang === 'tr' ? "ALGORİTMA KARARI" : "ALGORITHM VERDICT",
    strengths: lang === 'tr' ? "Güçlü Yönler" : "Strengths",
    weaknesses: lang === 'tr' ? "Zayıf Noktalar" : "Weaknesses",
    variationsTitle: lang === 'tr' ? "Viral Alternatifler" : "Viral Alternatives",
    variationsDesc: lang === 'tr' 
      ? "Algoritmaya göre bu gönderiyi düzenleyerek puanını artırabiliriz. İşte 3 farklı yaklaşım:" 
      : "We can improve the score by tweaking the post for the algorithm. Here are 3 different approaches:",
    suggestionLabel: lang === 'tr' ? "Öneri" : "Option",
    tipsTitle: lang === 'tr' ? "Aksiyon Planı" : "Action Plan",
    noStrengths: lang === 'tr' ? "Belirgin bir güçlü yön bulunamadı." : "No specific strengths detected.",
    noWeaknesses: lang === 'tr' ? "Belirgin bir risk faktörü bulunamadı." : "No specific risks detected.",
    shareOnX: lang === 'tr' ? "X'te Paylaş" : "Share on X",
    copy: lang === 'tr' ? "Kopyala" : "Copy",
    copied: lang === 'tr' ? "Kopyalandı" : "Copied",
    score: lang === 'tr' ? "PUAN" : "SCORE",
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShareOnX = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 40) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6 animate-fade-in-up pb-12">
      
      {/* Top Card: Score & Classification */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm shadow-xl">
        <div className="flex-shrink-0 scale-110">
          <Gauge score={data.score} lang={lang} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            {t.verdict}
          </h3>
          <h2 className="text-3xl font-bold text-white mb-2">{data.classification}</h2>
          <p className="text-slate-300 leading-relaxed">
            {data.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positives */}
        <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-green-400">
            <TrendingUp size={20} />
            <h4 className="font-bold text-lg">{t.strengths}</h4>
          </div>
          <ul className="space-y-3">
            {data.positiveFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
            {data.positiveFactors.length === 0 && (
              <li className="text-slate-500 italic text-sm">{t.noStrengths}</li>
            )}
          </ul>
        </div>

        {/* Negatives */}
        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-red-400">
            <AlertTriangle size={20} />
            <h4 className="font-bold text-lg">{t.weaknesses}</h4>
          </div>
          <ul className="space-y-3">
            {data.negativeFactors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
            {data.negativeFactors.length === 0 && (
              <li className="text-slate-500 italic text-sm">{t.noWeaknesses}</li>
            )}
          </ul>
        </div>
      </div>

      {/* NEW SECTION: Viral Variations */}
      {data.optimizedVariations && data.optimizedVariations.length > 0 && (
        <div className="space-y-4 pt-4">
           <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-white">{t.variationsTitle}</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            {t.variationsDesc}
          </p>
          
          <div className="grid gap-5">
            {data.optimizedVariations.map((variant, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors duration-300 group shadow-lg"
              >
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider bg-purple-500/10 px-2 py-1 rounded">
                      {variant.label}
                    </span>
                    {variant.predictedScore && (
                       <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border ${getScoreColor(variant.predictedScore)}`}>
                         <TrendingUp size={12} />
                         <span>{variant.predictedScore} {t.score}</span>
                       </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="relative bg-black rounded-lg p-4 border border-slate-800 font-medium text-lg text-slate-200 mb-4 shadow-inner">
                    {variant.content}
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 mt-4">
                     {/* Explanation */}
                    <div className="hidden sm:flex items-start gap-2 text-xs text-slate-400 bg-purple-900/10 p-2 rounded-lg border border-purple-500/10 flex-1">
                      <Sparkles size={12} className="mt-0.5 text-purple-400 flex-shrink-0" />
                      <p>{variant.explanation}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleCopy(variant.content, idx)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700"
                        title={t.copy}
                      >
                         {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                         <span className="hidden xs:inline">{copiedIndex === idx ? t.copied : t.copy}</span>
                      </button>

                      <button
                        onClick={() => handleShareOnX(variant.content)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-200 text-black transition-colors text-xs font-bold border border-transparent"
                        title={t.shareOnX}
                      >
                         <Share2 size={14} />
                         <span>{t.shareOnX}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Tips - Action Plan */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <Lightbulb size={20} />
          <h4 className="font-bold text-lg">{t.tipsTitle}</h4>
        </div>
        <div className="grid gap-3">
           {data.improvementTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-blue-900/20 p-3 rounded-lg border border-blue-500/10">
                <span className="flex-shrink-0 mt-0.5 text-blue-400">
                   <ArrowRightCircle size={18} />
                </span>
                <p className="text-slate-200 text-sm font-medium">{tip}</p>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ResultSection;