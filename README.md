<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# X-Algorithm Viral Puanlayıcı

X (Twitter) gönderilerinizi paylaşmadan önce viral potansiyelini analiz edin. X'in açık kaynak algoritmasını kullanarak gönderi puanlaması, güçlü/zayıf yönler analizi ve optimize edilmiş alternatifler sunar.

## 🚀 Özellikler

- 🎯 **AI Destekli Analiz**: Google Gemini ile X algoritması simülasyonu
- 📊 **0-100 Viral Puan**: Görsel gauge ile anlık puanlama
- ✅ **Güçlü/Zayıf Yönler**: Algoritma bazlı detaylı faktör analizi
- ✨ **3 Optimize Alternatif**: Farklı stratejilerle iyileştirilmiş versiyonlar
- 🌍 **İki Dil Desteği**: Türkçe ve İngilizce arayüz
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🖼️ **Görsel Analizi**: Resimli gönderiler için multimodal analiz
- 🔄 **Tek Tıkla Paylaşım**: X'e direkt paylaşım ve kopyalama

## 📋 Gereksinimler

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **Gemini API Key** (Ücretsiz) - [AI Studio](https://aistudio.google.com/apikey)

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Değişkenlerini Ayarlayın

`.env` dosyası oluşturun (veya `.env.example` dosyasını kopyalayın):

```bash
# .env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> **⚠️ ÖNEMLİ GÜVENLİK UYARISI:**
> 
> Bu uygulama client-side'da API key kullanıyor. Production ortamında API key'iniz tarayıcı DevTools'tan görünür olacaktır.
> 
> **Öneriler:**
> - API key'inizi rate limit ve quota ile sınırlayın
> - Production için backend proxy servisi ekleyin (API key'i server-side'da tutun)
> - Google Cloud Console'dan key'inize kısıtlamalar ekleyin
> - Test/geliştirme için ayrı API key kullanın

### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda açılacak: `http://localhost:5173`

### 4. Production Build

```bash
npm run build
npm run preview
```

Build dosyaları `dist/` klasöründe oluşur.

## 📱 PWA (Progressive Web App)

Bu uygulama PWA olarak yapılandırılmıştır. Kullanıcılar:
- Tarayıcıdan "Ana Ekrana Ekle" ile yükleyebilir
- Offline çalışabilir (cache stratejisi ile)
- Native app benzeri deneyim yaşar

## 🏗️ Teknolojiler

- **React 19** - UI Framework
- **TypeScript 5** - Type Safety
- **Vite 6** - Build Tool & Dev Server
- **TailwindCSS 3** - Styling
- **Google Gemini AI** - AI Analysis
- **Lucide React** - Icon Library
- **Vite PWA Plugin** - Progressive Web App

## 📂 Proje Yapısı

```
/
├── components/
│   ├── InputSection.tsx    # Gönderi input formu
│   ├── ResultSection.tsx   # Analiz sonuçları
│   └── Gauge.tsx           # Puan gösterimi
├── services/
│   └── geminiService.ts    # AI API entegrasyonu
├── App.tsx                 # Ana uygulama
├── types.ts                # TypeScript tipleri
├── index.tsx               # Giriş noktası
├── index.css               # Global stiller
└── vite.config.ts          # Build yapılandırması
```

## 🎨 Özellik Detayları

### Analiz Metrikleri
- **Viral Puan**: 0-100 arası algoritma skoru
- **Sınıflandırma**: Düşük/Orta/Yüksek/Viral potansiyel
- **Güçlü Yönler**: Engagement faktörleri
- **Zayıf Noktalar**: Risk faktörleri
- **İyileştirme İpuçları**: Actionable öneriler

### Optimize Alternatifler
1. **Konuşma Odaklı**: Etkileşim maksimizasyonu
2. **Viral Odaklı**: Algoritma optimizasyonu
3. **Hikaye Odaklı**: Duygusal bağ kurma

## ⚙️ Yapılandırma

### TailwindCSS Özelleştirme
`tailwind.config.js` dosyasından renk, font ve diğer ayarları değiştirebilirsiniz.

### Gemini Model Değiştirme
`services/geminiService.ts` içinde model adını güncelleyin.

---

**Not**: Bu uygulama eğitim amaçlıdır ve X (Twitter) tarafından resmi olarak desteklenmemektedir.

