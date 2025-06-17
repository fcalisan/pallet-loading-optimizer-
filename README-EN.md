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
