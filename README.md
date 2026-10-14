# Cozy Cottage — Luxury Farmhouse & Nature Retreat 🌿🏡

> A cinematic luxury cottage and nature retreat web application featuring an interactive 3D estate model, live availability calendar, ambient audio, and immersive handcrafted guest experiences.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online%20%26%20Deployed-brightgreen?style=for-the-badge&logo=google-cloud&logoColor=white)](https://ais-pre-tjde7fvumtkryxp2rb44pk-723216292313.asia-east1.run.app)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🔗 Live Application

The application is deployed and accessible online:

👉 **[Launch Live Retreat Experience](https://ais-pre-tjde7fvumtkryxp2rb44pk-723216292313.asia-east1.run.app)**  
*Live preview URL:* `https://ais-pre-tjde7fvumtkryxp2rb44pk-723216292313.asia-east1.run.app`

---

## ✨ Features

- 🏛️ **Interactive 3D Estate Model**  
  Built with Three.js WebGL rendering. Features smooth orbit controls, architectural lighting, material rendering, and automatic landscape orientation for immersive mobile fullscreen viewing.

- 🏊 **6 Handcrafted Experiences**  
  Pixel-perfect square experience cards with deep-dive modals, high-resolution galleries, and instant footer quick-links:
  1. *Private Pool & Sun Deck*
  2. *2 Bedrooms & Living Room*
  3. *Foosball, Cricket & Board Games*
  4. *Green Party Lawn & Sit-Out*
  5. *Golden Hour & Sunset Views*
  6. *Campfire & Barbecue Setup*

- 📅 **Live Availability Calendar**  
  Clean booking calendar interface with visual status indicators:
  - 🟢 **Green**: Today's Date
  - ⚪ **White**: Available Dates
  - 🟡 **Accent**: Booked / Selected Dates

- 🎵 **Floating Ambient Audio & WhatsApp Concierge**  
  - Non-intrusive floating music control with natural forest soundscapes.
  - Floating direct-connect WhatsApp quick action for immediate reservations.

- 🌿 **Organic Flora Particles & Parallax Depth**  
  Subtle floating flora and leaf animations that create a peaceful, living nature aesthetic.

- 📍 **Location & Directions**  
  Grounded location details for Shamirpet, Hyderabad with live glowing status badge, landmark markers, and instant Google Maps directions.

- 📱 **Fully Responsive & Polished Typography**  
  Carefully styled using Tailwind CSS v4, combining elegant editorial serif headers (*Fraunces*) with crisp, modern sans-serif body (*Plus Jakarta Sans*).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (version 18 or higher) and npm installed on your machine.

- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/cozy-cottage.git
   cd cozy-cottage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:3000` to preview the retreat website.

---

## 📦 Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and creates optimized production assets in `/dist` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs TypeScript compiler type-checking without emitting files |
| `npm run clean` | Removes the compiled `dist/` directory |

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with meta tags & typography
├── package.json                 # Project dependencies and npm scripts
├── vite.config.ts               # Vite configuration and plugins
├── tsconfig.json                # TypeScript compiler configuration
└── src/
    ├── main.tsx                 # Application mount point
    ├── App.tsx                  # Primary page layout & section composition
    ├── index.css                # Global styles, Tailwind imports, font utilities
    └── components/
        └── cottage/
            ├── Navbar.tsx               # Sticky navigation with quick reserve CTA
            ├── HeroSection.tsx          # Cinematic hero with pulsing location flag
            ├── Estate3DSection.tsx      # Three.js 3D estate model with mobile landscape mode
            ├── ExperiencesSection.tsx   # 6 square experience divs with modal triggers
            ├── ExperienceModal.tsx      # Fullscreen media gallery and details modal
            ├── AvailabilitySection.tsx  # Interactive booking & status calendar
            ├── AboutSection.tsx         # Cottage story and architectural philosophy
            ├── ReviewsSection.tsx       # Verified guest testimonials & ratings
            ├── BookingSection.tsx       # Direct reservation and contact inquiry
            ├── Footer.tsx               # Footer with experiences links and location info
            ├── FloatingAudioButton.tsx  # Ambient retreat audio toggle
            ├── FloatingWhatsApp.tsx     # One-click WhatsApp concierge button
            ├── GlobalFloraFall.tsx      # Ambient falling leaf animation
            ├── ForestParallaxLayer.tsx  # Depth-enhanced backdrop effects
            └── ScrollProgressBar.tsx    # Reading and scroll position indicator
```

---

## 🌐 Deployment

### 🟢 Current Live Deployment
This web application is deployed and live at:
- **URL**: [https://ais-pre-tjde7fvumtkryxp2rb44pk-723216292313.asia-east1.run.app](https://ais-pre-tjde7fvumtkryxp2rb44pk-723216292313.asia-east1.run.app)
- **Status**: Active & Operational 🟢

### Deploy to Vercel
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **New Project**.
3. Import your `cozy-cottage` repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository in [Netlify](https://www.netlify.com/).
2. Set build command to `npm run build` and publish directory to `dist`.
3. Click **Deploy Site**.

### Deploy to GitHub Pages
1. In `vite.config.ts`, ensure `base: './'` is configured if serving from a subpath.
2. Run `npm run build` and publish the `dist` folder to your `gh-pages` branch.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
