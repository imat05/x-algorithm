import React, { useState, useRef } from 'react';
import { Language, TrendPostsData, PostTone } from '../types';
import { generateTrendPosts } from '../services/geminiService';
import { TrendingUp, Sparkles, Copy, Check, Hash, Share2, ChevronDown, Download } from 'lucide-react';
import Gauge from './Gauge';
import VisualCard from './VisualCard';
import html2canvas from 'html2canvas';

interface TrendGeneratorSectionProps {
  lang: Language;
}

const TrendGeneratorSection: React.FC<TrendGeneratorSectionProps> = ({ lang }) => {
  const [keyword, setKeyword] = useState('');
  const [tone, setTone] = useState<PostTone>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TrendPostsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const t = {
    title: lang === 'tr' ? 'Trend Post Üretici' : 'Trend Post Generator',
    subtitle: lang === 'tr' 
      ? 'Bir anahtar kelime girin, X algoritmasına göre optimize edilmiş viral postlar alın'
      : 'Enter a keyword, get viral posts optimized for X algorithm',
    placeholder: lang === 'tr' ? 'Örn: yapay zeka, teknoloji, spor...' : 'e.g., AI, technology, sports...',
    tone: lang === 'tr' ? 'Ton' : 'Tone',
    generate: lang === 'tr' ? 'Oluştur' : 'Generate',
    generating: lang === 'tr' ? 'Trend konular aranıyor...' : 'Searching for trending topics...',
    emptyKeyword: lang === 'tr' ? 'Lütfen bir anahtar kelime girin' : 'Please enter a keyword',
    trend: lang === 'tr' ? 'Trend Konu' : 'Trending Topic',
    viralScore: lang === 'tr' ? 'Viral Potansiyel' : 'Viral Potential',
    whyWorks: lang === 'tr' ? 'Neden İşe Yarar' : 'Why It Works',
    algorithmFactors: lang === 'tr' ? 'Algoritma Faktörleri' : 'Algorithm Factors',
    copy: lang === 'tr' ? 'Kopyala' : 'Copy',
    copied: lang === 'tr' ? 'Kopyalandı!' : 'Copied!',
    downloadImage: lang === 'tr' ? 'Görseli İndir' : 'Download Image',
    shareOnX: lang === 'tr' ? 'X\'te Paylaş' : 'Share on X',
    generatedFor: lang === 'tr' ? 'için üretildi' : 'generated for',
    tones: {
      friendly: lang === 'tr' ? 'Arkadaşça' : 'Friendly',
      professional: lang === 'tr' ? 'Profesyonel' : 'Professional',
      exciting: lang === 'tr' ? 'Heyecanlı' : 'Exciting',
      optimistic: lang === 'tr' ? 'İyimser' : 'Optimistic',
      pessimistic: lang === 'tr' ? 'Kötümser' : 'Pessimistic',
      humorous: lang === 'tr' ? 'Komik' : 'Humorous',
      motivational: lang === 'tr' ? 'Motive Edici' : 'Motivational',
      controversial: lang === 'tr' ? 'Tartışmalı' : 'Controversial',
    }
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setError(t.emptyKeyword);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateTrendPosts(keyword, tone, lang);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === 'tr' ? 'Post üretimi başarısız oldu.' : 'Post generation failed.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadVisualCard = async (index: number) => {
    const cardElement = document.getElementById(`visual-card-${index}`);
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `${keyword}-post-${index + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleShareOnX = (content: string) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const getGradientForIndex = (index: number) => {
    const gradients: Array<'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'red'> = ['blue', 'purple', 'green', 'orange', 'pink', 'red'];
    return gradients[index % gradients.length];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="text-yellow-400" size={32} />
          <h2 className="text-3xl font-bold text-white">{t.title}</h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            disabled={isGenerating}
            className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Tone Dropdown */}
          <div className="relative">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as PostTone)}
              disabled={isGenerating}
              className="appearance-none px-6 py-4 pr-12 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {(Object.keys(t.tones) as PostTone[]).map((toneKey) => (
                <option key={toneKey} value={toneKey}>
                  {t.tones[toneKey]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !keyword.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">{t.generating}</span>
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                <span>{t.generate}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center text-sm text-slate-500">
            <span className="font-semibold text-blue-400">{result.generatedPosts.length} {lang === 'tr' ? 'post' : 'posts'}</span> "{result.keyword}" {t.generatedFor}
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
            {result.generatedPosts.map((post, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition shadow-xl"
              >
                {/* Trend Topic Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="text-blue-400" size={16} />
                  <span className="text-sm font-semibold text-blue-400">{post.trendTopic}</span>
                </div>

                {/* Visual Card */}
                {post.visualText && (
                  <div className="mb-4" id={`visual-card-${index}`}>
                    <VisualCard 
                      text={post.visualText} 
                      emoji={post.visualEmoji}
                      gradient={getGradientForIndex(index)}
                      keyword={keyword}
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="bg-black/30 rounded-xl p-4 mb-4 border border-slate-700/50">
                  <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">
                      {post.content.length} / 280 {lang === 'tr' ? 'karakter' : 'characters'}
                    </span>
                    <div className="flex gap-2">
                      {post.visualText && (
                        <button
                          onClick={() => downloadVisualCard(index)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm text-white transition"
                        >
                          <Download size={14} />
                          <span className="hidden sm:inline">{t.downloadImage}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(post.content, index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-green-400">{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>{t.copy}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleShareOnX(post.content)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition"
                      >
                        <Share2 size={14} />
                        <span className="hidden sm:inline">{t.shareOnX}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Viral Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300">{t.viralScore}</span>
                    <span className="text-2xl font-bold text-white">{post.predictedScore}</span>
                  </div>
                  <Gauge score={post.predictedScore} size="small" />
                </div>

                {/* Explanation */}
                <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">{t.whyWorks}</h4>
                  <p className="text-sm text-slate-300">{post.explanation}</p>
                </div>

                {/* Algorithm Factors */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">{t.algorithmFactors}</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.algorithmFactors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-300"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendGeneratorSection;
