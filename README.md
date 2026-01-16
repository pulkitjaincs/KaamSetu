# KaamSetu 💼

A premium job portal for the blue-collar workforce, connecting skilled workers with employers across industries like hospitality, construction, manufacturing, logistics, and more.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)

## ✨ Features

- **Modern UI/UX** - Apple/Linear-inspired interface with premium animations
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Spring-based easing curves and layered transitions

## 🎨 Design Highlights

### Animations
| Action | Animation |
|--------|-----------|
| First Open | Scale up from 92% with shadow build and content reveal |
| Switch Listing | Subtle 0.3s slide with content refresh |
| Close | Scale down to 95% with fade out |
| Card Hover | 1.05x scale with shadow lift |

### Components
- **Navbar** - Floating glass-panel with rounded corners, theme toggle, and responsive search
- **Cards** - Hover-interactive job cards with selection states
- **Listing** - Full job details with hero header and premium styling

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/pulkitjaincs/KaamSetu.git
cd KaamSetu

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
KaamSetu/
├── src/
│   ├── components/
│   │   ├── Card.jsx        # Job listing card
│   │   ├── Listing.jsx     # Job details panel
│   │   ├── Navbar.jsx      # Navigation with search & theme toggle
│   │   └── Footer.jsx      # Footer component
│   ├── App.jsx             # Main application layout
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles & animations
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Tech Stack

- **React 19** - UI library with hooks
- **Vite 6** - Next-gen frontend tooling
- **Bootstrap 5.3** - CSS framework
- **Bootstrap Icons** - Icon library
- **CSS Variables** - Theming system

## 🌙 Theme System

KaamSetu uses CSS custom properties for theming:

```css
:root {
  --bg-body: #fafafa;
  --bg-card: #ffffff;
  --text-main: #09090b;
  --text-muted: #71717a;
  /* ... */
}

[data-theme="dark"] {
  --bg-body: #09090b;
  --bg-card: #18181b;
  --text-main: #fafafa;
  /* ... */
}
```

## 📱 Responsive Behavior

| Screen Size | Layout |
|-------------|--------|
| Desktop (lg+) | Side-by-side: Job list + Details panel |
| Mobile | Single view with back navigation |

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📄 License

MIT © 2025

---

<p align="center">
  Made with ❤️ for the blue-collar workforce of India
</p>