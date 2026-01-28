# 🚀 X-Algorithm Viral Puanlayıcı - Güncel Durum

**Son Güncelleme:** 26 Ocak 2026, 16:30

---

## 📋 Proje Özeti
X (Twitter) için viral post analiz ve üretim aracı. Gemini AI kullanarak:
1. Mevcut postları analiz eder ve skorlar
2. Trend bazlı viral postlar üretir

---

## ✅ Tamamlanmış Özellikler

### 1️⃣ Post Analiz Sistemi (Analiz Et Sekmesi)
- Metin/görsel input
- 0-100 viral skor hesaplama
- Algoritma faktörleri analizi
- İyileştirme önerileri + 3 varyasyon
- TR/EN dil desteği
- 280 karakter limiti kontrolü

### 2️⃣ Trend Post Üretici (Trend Postlar Sekmesi) ⭐ YENİ
**Temel Özellikler:**
- Anahtar kelime bazlı post üretimi
- 3 trend konusu + 3 optimized post
- Viral skor tahmini
- Algoritma faktörleri açıklaması

**Ton Seçimi (8 Seçenek):**
- Arkadaşça, Profesyonel, Heyecanlı, İyimser
- Kötümser, Komik, Motive Edici, Tartışmalı

**Görsel Kartlar:**
- 6 gradient renk seçeneği
- Emoji + metin (3-8 kelime)
- `#anahtar_kelime` badge
- html2canvas ile PNG indirme

**Paylaşım:**
- ✅ "Görseli İndir" butonu (yeşil)
- ✅ "Kopyala" butonu (gri)
- ✅ "X'te Paylaş" butonu (mavi, Twitter intent)

### 3️⃣ API Key Yönetimi
- Çoklu API key desteği
- Modal UI (ekle/düzenle/sil)
- Aktif key seçimi
- localStorage persistence

### 4️⃣ PWA Desteği
- Install butonu
- Service Worker
- Offline ready
- Mobile responsive

---

## 🛠️ Teknik Stack

```
Frontend:  React 19.2.3 + TypeScript
Build:     Vite 6.4.1
Styling:   TailwindCSS 3
Icons:     Lucide React
Routing:   react-router-dom (HashRouter)
AI:        Gemini API (gemini-3-flash-preview)
Export:    html2canvas 1.4.1
```

---

## 📁 Kritik Dosyalar

### Components
- `TrendGeneratorSection.tsx` → Trend post UI + visual cards + download
- `VisualCard.tsx` → Gradient kartlar (#keyword badge)
- `ApiKeyModal.tsx` → Çoklu key yönetimi
- `InputSection.tsx` → Analiz input
- `ResultSection.tsx` → Analiz sonuç
- `Gauge.tsx` → Skor göstergesi

### Services
- `geminiService.ts` → 2 fonksiyon:
  - `analyzePost(text, image, lang)` → Analiz
  - `generateTrendPosts(keyword, tone, lang)` → Trend postlar

### Utils
- `apiKeyStorage.ts` → localStorage CRUD

### Types
- `types.ts` → PostTone, TrendPost, TrendPostsData, etc.

---

## 🎨 TrendGeneratorSection Özellikleri

**Input:**
- Anahtar kelime input
- Ton dropdown (8 seçenek)
- "Oluştur" butonu

**Output (Her post için):**
```
┌─────────────────────────────────┐
│ 🏷️ Trend Topic Badge           │
├─────────────────────────────────┤
│ 🎨 VISUAL CARD                  │
│   [Gradient Arkaplan]           │
│   #anahtar_kelime               │
│   🚀 Emoji                      │
│   "Çarpıcı Mesaj"               │
│   𝕏 Watermark                   │
├─────────────────────────────────┤
│ 📝 Post İçeriği (max 280)       │
│   [Karakter sayacı]             │
│   [📥 İndir] [📋 Kopyala] [🐦 Paylaş] │
├─────────────────────────────────┤
│ 📊 Viral Skor Gauge             │
│ 💡 Açıklama                     │
│ ⚙️ Algoritma Faktörleri         │
└─────────────────────────────────┘
```

---

## 🧬 Gemini Prompt Yapısı

### generateTrendPosts()
```typescript
Parameters: (keyword: string, tone: PostTone, lang: Language)
Returns: {
  keyword: string,
  generatedPosts: [{
    trendTopic: string,      // Örn: "#YapayZeka2026"
    content: string,          // Max 280 char
    predictedScore: number,   // 60-90 arası
    explanation: string,
    algorithmFactors: string[],
    visualText: string,       // 3-8 kelime (keyword içermeli)
    visualEmoji: string       // Tek emoji
  }]
}
```

**Prompt Özellikleri:**
- Ton talimatları (8 farklı)
- X algoritma kuralları (engagement hooks, hashtags, etc.)
- visualText'te keyword zorunlu
- Örnek: "yapay zeka is changing everything"

---

## 🎯 Download & Share Akışı

1. **Görsel İndir:**
   - `downloadVisualCard(index)` fonksiyonu
   - html2canvas ile DOM → PNG
   - `${keyword}-post-${index}.png` olarak indir

2. **X'te Paylaş:**
   - `handleShareOnX(content)` fonksiyonu
   - Twitter intent URL
   - Yeni pencere açar (550x420)
   - NOT: Görsel manuel yüklenmeli (Twitter API sınırlaması)

---

## 🚦 Çalışma Durumu

```bash
✅ npm install        # Tamamlandı (493 paket)
✅ npm run dev        # http://localhost:3000
✅ PWA Install        # Aktif
✅ Multi-API Keys     # Çalışıyor
✅ Visual Cards       # Render ediliyor
✅ Download Image     # html2canvas ready
✅ Share on X         # Twitter intent URL
```

---

## 🐛 Bilinen Sorunlar
- Yok (şu an için)

---

## 🔮 Gelecek Özellikler (Öneriler)
- [ ] İndirilen görseli otomatik X'e yükle (API gerektirir)
- [ ] Post history (localStorage)
- [ ] Favori postları kaydet
- [ ] Toplu indirme (3 post birden)
- [ ] Görsel edit (metin/renk değiştir)
- [ ] Analytics dashboard
- [ ] Schedule posts

---

## 💾 Environment
```
.env dosyası mevcut (API key)
Development server: Vite HMR aktif
Port: 3000
```

---

## 📝 Devam Etmek İçin
1. Bu dosyayı oku
2. `npm run dev` ile serveri başlat
3. Trend Postlar sekmesini test et
4. Kod: `components/TrendGeneratorSection.tsx` ve `services/geminiService.ts`

**Son Eklenen:**
- html2canvas dependency
- VisualCard keyword prop
- Download button
- Gemini prompt güncellemesi (keyword in visualText)

---

**Hazırlayan:** AI Assistant  
**Proje Durumu:** ✅ Production Ready
