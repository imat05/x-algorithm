import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import TrendGeneratorSection from './components/TrendGeneratorSection';
import ApiKeyModal from './components/ApiKeyModal';
import { ViralScoreData, PostContent, AnalysisStatus, Language, ApiKeyItem } from './types';
import { analyzePostViralPotential } from './services/geminiService';
import { getAllApiKeys, getActiveApiKey, migrateOldApiKey } from './utils/apiKeyStorage';
import { Github, Globe, Download, Settings, BarChart3, Sparkles } from 'lucide-react';

type ActiveTab = 'analyzer' | 'trends';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<ViralScoreData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('tr');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);

  // Load API keys on mount
  const loadApiKeys = () => {
    // Migrate old key if exists
    migrateOldApiKey();
    
    const keys = getAllApiKeys();
    setApiKeys(keys);
    
    // If no API keys, show modal after a brief delay
    if (keys.length === 0) {
      setTimeout(() => setShowApiKeyModal(true), 500);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'tr' ? 'en' : 'tr');
    // Optional: Reset result when language changes to avoid confusion, or keep it.
    // setResult(null); 
  };

  const handleAnalyze = async (content: PostContent) => {
    // Check API key before analyzing
    const activeKey = getActiveApiKey();
    if (!activeKey) {
      setShowApiKeyModal(true);
      setErrorMsg(lang === 'tr' ? 'Lütfen önce API key\'inizi ayarlayın.' : 'Please set your API key first.');
      return;
    }

    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    setResult(null);

    try {
      const data = await analyzePostViralPotential(content.text, content.image, lang);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      
      // Check if error is related to API key
      if (err.message && err.message.includes('API key')) {
        setShowApiKeyModal(true);
      }
      
      setErrorMsg(err.message || (lang === 'tr' ? "Analiz başarısız oldu." : "Analysis failed."));
      setStatus(AnalysisStatus.ERROR);
    }
  };

  // Content Dictionary for App.tsx
  const activeKey = getActiveApiKey();
  const t = {
    titleMain: lang === 'tr' ? "Viral Olacak Mı?" : "Will It Go Viral?",
    subText: lang === 'tr' 
      ? "X açık kaynak algoritmasını kullanarak gönderilerinizi paylaşmadan önce puanlayın." 
      : "Score your posts using the X open-source algorithm before you share.",
    loadingText: lang === 'tr' ? "Algoritma simülasyonu çalışıyor..." : "Running algorithm simulation...",
    sourceCode: lang === 'tr' ? "Kaynak Kod" : "Source Code",
    installApp: lang === 'tr' ? "Uygulamayı Yükle" : "Install App",
    settings: lang === 'tr' ? "Ayarlar" : "Settings",
    apiKeyStatus: activeKey 
      ? (lang === 'tr' ? `✓ ${activeKey.name}` : `✓ ${activeKey.name}`)
      : (lang === 'tr' ? '⚠ API Key Gerekli' : '⚠ API Key Required')
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 selection:text-blue-200">
        
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/70 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">𝕏</span>
              </div>
              <h1 className="font-bold text-xl tracking-tight hidden sm:block">Algorithm <span className="text-slate-500">Predictor</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              {showInstallButton && (
                <button 
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition text-xs font-bold text-white shadow-lg hover:shadow-xl border-2 border-blue-500"
                  title={t.installApp}
                >
                  <Download size={16} className="animate-bounce" />
                  <span className="hidden sm:inline">{t.installApp}</span>
                </button>
              )}

              <button 
                onClick={() => setShowApiKeyModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition text-xs font-semibold border ${
                  activeKey 
                    ? 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-900/50' 
                    : 'bg-yellow-900/30 border-yellow-700 text-yellow-400 hover:bg-yellow-900/50 animate-pulse'
                }`}
                title={t.settings}
              >
                <Settings size={14} />
                <span className="hidden sm:inline">{t.apiKeyStatus}</span>
              </button>

              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition text-xs font-semibold border border-slate-700"
              >
                <Globe size={14} className="text-blue-400"/>
                <span className={lang === 'tr' ? 'text-white' : 'text-slate-500'}>TR</span>
                <span className="text-slate-600">|</span>
                <span className={lang === 'en' ? 'text-white' : 'text-slate-500'}>EN</span>
              </button>

              <a 
                href="https://github.com/xai-org/x-algorithm" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition"
              >
                <Github size={16} />
                <span className="hidden sm:inline">{t.sourceCode}</span>
              </a>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-2 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition relative ${
                  activeTab === 'analyzer'
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <BarChart3 size={18} />
                <span>{lang === 'tr' ? 'Analiz Et' : 'Analyze'}</span>
                {activeTab === 'analyzer' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('trends')}
                className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition relative ${
                  activeTab === 'trends'
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sparkles size={18} />
                <span>{lang === 'tr' ? 'Trend Postlar' : 'Trend Posts'}</span>
                {activeTab === 'trends' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Analyzer Tab */}
          {activeTab === 'analyzer' && (
            <>
              <div className="text-center mb-10 space-y-4">
                <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent pb-1">
                  {t.titleMain}
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                  {t.subText}
                </p>
              </div>

              <InputSection onAnalyze={handleAnalyze} isLoading={status === AnalysisStatus.ANALYZING} lang={lang} />

              {/* Loading State */}
              {status === AnalysisStatus.ANALYZING && (
                <div className="mt-12 text-center space-y-4 animate-pulse">
                  <div className="w-16 h-16 mx-auto rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
                  <p className="text-slate-400">{t.loadingText}</p>
                  <div className="flex justify-center gap-2 text-xs text-slate-600">
                    <span>Heavy Ranker</span> &bull; <span>Tweepcred</span> &bull; <span>Media Vision</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === AnalysisStatus.ERROR && (
                <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center text-red-400">
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Result State */}
              {status === AnalysisStatus.COMPLETED && result && (
                <ResultSection data={result} lang={lang} />
              )}
            </>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <TrendGeneratorSection lang={lang} />
          )}

        </main>

        <footer className="border-t border-slate-900 mt-20 py-8 text-center">
          {/* Footer content removed as requested */}
        </footer>

        {/* API Key Modal */}
        <ApiKeyModal 
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onKeysChange={loadApiKeys}
          apiKeys={apiKeys}
          lang={lang}
        />
      </div>
    </HashRouter>
  );
};

export default App;