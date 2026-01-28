import React, { useRef, useState } from 'react';
import { PostContent, Language } from '../types';
import { Image, X } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (content: PostContent) => void;
  isLoading: boolean;
  lang: Language;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading, lang }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    title: lang === 'tr' ? "Yeni Gönderi Taslağı" : "New Post Draft",
    placeholder: lang === 'tr' ? "Neler oluyor?" : "What is happening?",
    analyzing: lang === 'tr' ? "Analiz Ediliyor..." : "Analyzing...",
    analyze: lang === 'tr' ? "Puanla" : "Rate It",
    imageTitle: lang === 'tr' ? "Resim Ekle" : "Add Image",
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    if (text.length > 280) return;
    onAnalyze({ text, image, imagePreview });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-slate-300 font-medium">{t.title}</h2>
      </div>
      
      <div className="p-4 flex gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xl">
          🤖
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-transparent text-xl text-white placeholder-slate-500 focus:outline-none resize-none min-h-[120px]"
            disabled={isLoading}
          />
          
          {imagePreview && (
            <div className="relative mt-2 mb-4 group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="rounded-2xl max-h-80 w-auto object-cover border border-slate-700"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 left-2 bg-black/70 p-1.5 rounded-full hover:bg-black/90 transition text-white"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="border-t border-slate-800 pt-3 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition"
                disabled={isLoading}
                title={t.imageTitle}
              >
                <Image size={20} />
              </button>
              {/* Hidden input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="flex items-center gap-4">
              {text.length > 0 && (
                <span className={`text-xs ${text.length > 280 ? 'text-red-500' : 'text-slate-500'}`}>
                  {text.length} / 280
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={(!text && !image) || isLoading || text.length > 280}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 
                  ${(!text && !image) || isLoading || text.length > 280
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-slate-200'}`}
              >
                {isLoading ? t.analyzing : t.analyze}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;