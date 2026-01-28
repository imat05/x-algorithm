# Kurulum ve Çalıştırma Adımları

## 🚀 Hızlı Başlangıç

### 1. Projeyi İndirin
```bash
# Eğer git kullanıyorsanız:
git clone <repo-url>
cd x-algorithm-viral-puanlayıcı
```

### 2. Node.js Kontrolü
```bash
node --version  # v18+ olmalı
npm --version
```

Node.js yoksa: https://nodejs.org adresinden indirin.

### 3. Bağımlılıkları Kurun
```bash
npm install
```

> **Not:** İlk kurulumda TailwindCSS, PWA ve diğer paketler otomatik kurulur. Kurulum birkaç dakika sürebilir.

### 4. Development Server'ı Başlatın
```bash
npm run dev
```

Tarayıcınızda otomatik açılacak: `http://localhost:3000`

### 5. API Key Ayarlayın (İlk Kullanımda)

Uygulama ilk açıldığında API key ayarlama ekranı otomatik açılacaktır.

#### 5.1 Google AI Studio'dan Ücretsiz API Key Alın:
1. [Google AI Studio](https://aistudio.google.com/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API key'inizi kopyalayın (AIza... ile başlar)

#### 5.2 API Key'i Uygulamaya Girin:
1. Sağ üstteki **Ayarlar** (⚙️) butonuna tıklayın
2. API key'inizi yapıştırın
3. "Kaydet" butonuna tıklayın

> ✅ **API Key Güvenliği:** API key'iniz SADECE tarayıcınızın localStorage'ında saklanır. Hiçbir sunucuya gönderilmez. Her kullanıcı kendi API key'ini kullanır.

---

## 📱 PWA Olarak Test Etme

### Chrome/Edge'de Test:
1. `npm run build` ile production build oluşturun
2. `npm run preview` ile preview server'ı başlatın
3. Chrome DevTools'u açın (F12)
4. "Application" sekmesine gidin
5. "Service Workers" ve "Manifest" bölümlerini kontrol edin
6. Sağ üstte "Install App" ikonu görünecek

### Mobilde Test:
1. Telefonunuzda Chrome/Safari açın
2. Preview URL'i girin (ör: http://192.168.1.100:4173)
3. Tarayıcı menüsünden "Add to Home Screen" seçin
4. Ana ekranda app icon'u belirecek

---

## 🛠️ Production Build

### Build Oluşturma:
```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşur:
- HTML, CSS, JS dosyaları minified
- Service Worker otomatik oluşturulur
- PWA manifest dahil edilir
- Assets optimize edilir

### Production Preview:
```bash
npm run preview
```

---

## 🔧 Sorun Giderme

### Sorun 1: "npm install" Hatası
```bash
# Cache'i temizleyin:
npm cache clean --force

# node_modules'ü silin ve tekrar kurun:
rmdir /s /q node_modules
npm install
```

### Sorun 2: PowerShell Script Hatası
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Sorun 3: Port 3000 Kullanımda
`vite.config.ts` içinde port'u değiştirin:
```typescript
server: {
  port: 3001, // veya başka bir port
}
```

### Sorun 4: API Key Çalışmıyor
- Sağ üstteki **Ayarlar** (⚙️) butonuna tıklayın
- API key'inizi doğru girdiğinizden emin olun
- API key'in `AIza` ile başladığını kontrol edin
- API key'in Google AI Studio'dan doğru kopyalandığını kontrol edin
- Browser'ı yenileyin (F5) ve tekrar deneyin
- Browser console'da (F12) hata olup olmadığını kontrol edin

### Sorun 5: TailwindCSS Stilleri Yüklenmiyor
- `index.tsx` dosyasında `import './index.css'` satırının olduğunu kontrol edin
- Browser cache'i temizleyin (Ctrl+Shift+R)
- `npm run dev` ile tekrar başlatın

### Sorun 6: PWA Çalışmıyor
- PWA sadece **production build**'de çalışır
- `npm run build && npm run preview` ile test edin
- HTTPS veya localhost gereklidir (HTTP'de çalışmaz)

---

## 📝 Komutlar Özeti

| Komut | Açıklama |
|-------|----------|
| `npm install` | Bağımlılıkları kur |
| `npm run dev` | Development server başlat |
| `npm run build` | Production build oluştur |
| `npm run preview` | Production build'i preview et |

---

## 🎯 Sonraki Adımlar

Kurulum tamamlandıktan sonra:

1. **Test Edin:** Bir gönderi yazın ve "Puanla" butonuna tıklayın
2. **Dilleri Deneyin:** Sağ üstteki TR/EN butonuyla dil değiştirin
3. **PWA Kurun:** `npm run build && npm run preview` sonrası "Install App" yapın
4. **Özelleştirin:** `tailwind.config.js` ve `vite.config.ts` dosyalarını düzenleyin

---

## 🔐 Güvenlik Notları

> ⚠️ Bu uygulama **client-side** çalışır ve her kullanıcı kendi API key'ini kullanır.

**Güvenlik Özellikleri:**
1. ✅ API key **sadece tarayıcıda** (localStorage) saklanır
2. ✅ API key **hiçbir sunucuya gönderilmez**
3. ✅ Her kullanıcı **kendi Google hesabından** ücretsiz key alır
4. ✅ API key'ler **cihaza özel** - paylaşılmaz

**Production için öneriler:**
1. API key'e Google Cloud Console'dan **rate limit** ekleyin
2. API key'i sadece belirli **domain'lere** kısıtlayın
3. Üretim ortamında **farklı API key** kullanın
4. **API usage** takibini düzenli kontrol edin

---

## 📚 Daha Fazla Bilgi

- [Vite Dokümantasyonu](https://vitejs.dev/)
- [TailwindCSS Dokümantasyonu](https://tailwindcss.com/)
- [PWA Rehberi](https://web.dev/progressive-web-apps/)
- [Google AI Studio](https://ai.google.dev/)
