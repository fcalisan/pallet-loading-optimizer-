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

# Logistics Loading Optimization Panel

This project is a web application developed to optimize pallet loading operations in the logistics sector. It is built using Vue.js 3 and Element Plus UI framework.

## 🚀 Features

### 📦 Pallet Management

- **Pallet Entry**: Add pallets with different dimensions
- **Truck Size Validation**: Check pallet compliance with truck dimensions
- **Stackability**: Specify whether pallets can be stacked
- **Smart Random Pallet Generation**: Automatic pallet data creation

### 🚛 Loading Planning

- **3D Visualization**: Interactive 3D view developed with Three.js
- **Optimization Algorithm**: Most efficient pallet placement in trucks
- **Truck Type Selection**: Support for different truck types
- **Real-time Analysis**: Loading efficiency calculation

### 📊 Project Management

- **Project Saving**: Save loading plans as projects
- **Project Editing**: Update existing projects
- **Project Deletion**: Clean up unnecessary projects
- **Project Selection**: Active project management

### 📈 Reporting

- **PDF Report Generation**: Detailed analysis reports
- **Visual Reports**: Charts and tables
- **Statistical Analysis**: Loading efficiency metrics
- **Excel/CSV Export**: Data export for analysis

## 🛠️ Technologies Used

- **Frontend**: Vue.js 3 (Composition API)
- **UI Framework**: Element Plus
- **3D Visualization**: Three.js
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **PDF Generation**: jsPDF + jsPDF AutoTable
- **Canvas Operations**: html2canvas

## 📋 Requirements

- Node.js 18+
- npm or yarn

## 🔧 Installation

1. Clone the project:

```bash
git clone <repository-url>
cd test-yukleme-project
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

## 🏗️ Build and Deploy

To build for production:

```bash
npm run build
```

To preview build files:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   └── Gorselleme.vue  # 3D visualization component
├── views/              # Page views
│   ├── HomeView.vue          # Home page
│   ├── PaletGirisiView.vue   # Pallet entry
│   ├── YuklemePlanlamaView.vue # Loading planning
│   ├── ProjeYonetimiView.vue   # Project management
│   └── RaporlarView.vue        # Reports
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
├── services/           # API services
└── assets/             # Static files
```

## 🎯 Usage

### 1. Pallet Entry

- Go to "Pallet Entry" page
- Enter pallet name, dimensions, quantity, weight
- Specify stackability feature
- Click "Add Pallet" button

### 2. Loading Planning

- Go to "Loading Planning" page
- Select truck type
- Choose pallets or include all
- Click "Run Optimization" button
- Review the result in 3D view

### 3. Project Management

- Save your loading plan as a project
- Manage existing projects
- View project details

### 4. Reports

- Generate detailed analysis reports
- Export in PDF format
- Review statistics

## 🔍 Key Features

### Truck Types

- **Standard Truck**: 247x1360x300 cm
- **Mega Truck**: Large-scale transportation
- **Jumbo Truck**: Extra large capacity
- **Small Truck**: Compact transportation
- **Custom Size**: User-defined dimensions

### Optimization Algorithm

- **Area Efficiency**: Maximum truck area utilization
- **Volume Optimization**: 3D space usage
- **Stackability**: Safe stacking control
- **Weight Distribution**: Balanced load distribution

## 🐛 Known Issues

- Performance issues may occur in 3D view on Safari browser
- Render times may increase with large datasets

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

You can open an issue for questions about the project.

---

**Developer Notes**:

- Project uses Vue 3 Composition API
- Element Plus components are optimized for responsive design
- WebGL 2.0 support is recommended for Three.js performance
