# Lojistik Yükleme Optimizasyon Paneli

Bu proje, lojistik sektöründe palet yükleme operasyonlarını optimize etmek için geliştirilmiş bir web uygulamasıdır. Vue.js 3 ve Element Plus UI framework'ü kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 📦 Palet Yönetimi

- **Palet Girişi**: Farklı boyutlarda paletler ekleyebilme
- **Dorse Sınır Kontrolü**: Paletlerin dorse ölçülerine uygunluk kontrolü
- **İstiflenebilirlik**: Paletlerin üst üste yüklenip yüklenemeyeceğini belirtme
- **Akıllı Random Palet Üretimi**: Otomatik palet veri oluşturma

### 🚛 Yükleme Planlama

- **3D Görselleştirme**: Three.js ile geliştirilmiş interaktif 3D görünüm
- **Optimizasyon Algoritması**: Paletlerin dorsede en verimli yerleşimi
- **Dorse Tipi Seçimi**: Farklı dorse tiplerini destekleme
- **Gerçek Zamanlı Analiz**: Yükleme verimliliği hesaplama

### 📊 Proje Yönetimi

- **Proje Kaydetme**: Yükleme planlarını proje olarak saklama
- **Proje Düzenleme**: Mevcut projeleri güncelleme
- **Proje Silme**: Gereksiz projeleri temizleme
- **Proje Seçimi**: Aktif proje yönetimi

### 📈 Raporlama

- **PDF Rapor Üretimi**: Detaylı analiz raporları
- **Görsel Raporlar**: Grafikler ve tablolar
- **İstatistiksel Analiz**: Yükleme verimliliği metrikleri
- **Excel/CSV Dışa Aktarma**: Veri analizi için dışa aktarım

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: Vue.js 3 (Composition API)
- **UI Framework**: Element Plus
- **3D Görselleştirme**: Three.js
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **PDF Üretimi**: jsPDF + jsPDF AutoTable
- **Canvas İşlemleri**: html2canvas

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn

## 🔧 Kurulum

1. Projeyi klonlayın:

```bash
git clone <repository-url>
cd test-yukleme-project
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın.

## 🏗️ Build ve Deploy

Prodüksiyon için build almak:

```bash
npm run build
```

Build dosyalarını önizlemek:

```bash
npm run preview
```

## 📁 Proje Yapısı

```
src/
├── components/          # Vue bileşenleri
│   └── Gorselleme.vue  # 3D görselleştirme bileşeni
├── views/              # Sayfa görünümleri
│   ├── HomeView.vue          # Ana sayfa
│   ├── PaletGirisiView.vue   # Palet girişi
│   ├── YuklemePlanlamaView.vue # Yükleme planlama
│   ├── ProjeYonetimiView.vue   # Proje yönetimi
│   └── RaporlarView.vue        # Raporlar
├── stores/             # Pinia store'ları
├── router/             # Vue Router yapılandırması
├── services/           # API servisleri
└── assets/             # Statik dosyalar
```

## 🎯 Kullanım

### 1. Palet Girişi

- "Palet Girişi" sayfasına gidin
- Palet adı, ölçüleri, adedi, ağırlığı girin
- İstiflenebilirlik özelliğini belirtin
- "Palet Ekle" butonuna tıklayın

### 2. Yükleme Planlama

- "Yükleme Planlama" sayfasına gidin
- Dorse tipini seçin
- Paletleri seçin veya tümünü dahil edin
- "Optimizasyon Çalıştır" butonuna tıklayın
- 3D görünümde sonucu inceleyin

### 3. Proje Yönetimi

- Yükleme planınızı proje olarak kaydedin
- Mevcut projeleri yönetin
- Proje detaylarını görüntüleyin

### 4. Raporlar

- Detaylı analiz raporları oluşturun
- PDF formatında dışa aktarın
- İstatistikleri inceleyin

## 🔍 Önemli Özellikler

### Dorse Tipleri

- **Standart Dorse**: 247x1360x300 cm
- **Mega Dorse**: Büyük ölçülü taşımacılık
- **Jumbo Dorse**: Ekstra büyük kapasiteli
- **Küçük Dorse**: Kompakt taşımacılık
- **Özel Ölçü**: Kullanıcı tanımlı boyutlar

### Optimizasyon Algoritması

- **Alan Verimliliği**: Dorse alanını maksimum kullanma
- **Hacim Optimizasyonu**: 3D alan kullanımı
- **İstiflenebilirlik**: Güvenli istif kontrolü
- **Ağırlık Dağılımı**: Dengeli yük dağıtımı

## 🐛 Bilinen Sorunlar

- Safari tarayıcısında 3D görünüm performans sorunları yaşanabilir
- Büyük veri setlerinde render süreleri artabilir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**Geliştirici Notları**:

- Proje Vue 3 Composition API kullanmaktadır
- Element Plus bileşenleri responsive tasarım için optimize edilmiştir
- Three.js performansı için WebGL 2.0 desteği önerilir
