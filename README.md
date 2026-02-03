# 🏋️ TABATA Timer – Cyberpunk Edition

Intervalový časovač pro Tabata trénink s cyberpunkovým designem.

![Tabata Timer Preview](https://via.placeholder.com/600x400/000000/00ffff?text=TABATA+CYBERPUNK+TIMER)

---

## ✨ Funkce

- ⏱️ Nastavitelné intervaly cvičení a odpočinku
- 🔢 Nastavitelný počet kol a sérií
- ⏸️ Pauza mezi sériemi (nastavitelná)
- 🟡 Přípravná fáze před začátkem cvičení
- 🔊 Zvukové oznámení (zapnutí/vypnutí)
- 📊 Vizuální kruhový progress bar s neonovým efektem
- 📱 Plně responzivní – funguje na mobilu i desktopě
- 🌙 Wake Lock API – displej nezhasne na mobilu

---

## 🚀 Jak spustit lokálně

### 1. Prerequisity

Ujisti se, že máš nainstalovaný:
- [Node.js](https://nodejs.org/) (v18 nebo novější)
- [npm](https://www.npmjs.com/) (dodá se s Node.js)

### 2. Klonování repozitáře

```bash
git clone https://github.com/TVOJE_JMÉNO/tabata-timer.git
cd tabata-timer
```

### 3. Instalace závislostí

```bash
npm install
```

### 4. Spuštění aplikace

```bash
npm run dev
```

Aplikace bude dostupná na: **http://localhost:3000**

---

## 📁 Struktura projektu

```
tabata-timer/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.jsx            # Hlavní komponenta aplikace
│   ├── index.css          # Globální styly (Tailwind)
│   └── main.jsx           # Entry point
├── index.html             # HTML šablona
├── package.json           # Závislosti a skripty
├── postcss.config.js      # PostCSS konfigurace
├── tailwind.config.js     # Tailwind CSS konfigurace
├── vite.config.js         # Vite konfigurace
└── README.md              # Tento soubor
```

---

## 🛠️ Technologie

| Technologie | Účel |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Ikony |

---

## 📦 Deploy na GitHub Pages

### Automaticky pomocí GitHub Actions

1. Přejdi do repozitáře → **Settings** → **Pages**
2. Vyber **Actions** jako source
3. Přejdi do **Actions** → **New Workflow** a nahraj soubor `.github/workflows/deploy.yml` (viz níže)
4. Potvrdíš commit – aplikace se automaticky nasadí

### Manuálně

```bash
npm run build
npm run deploy
```

---

## ⚙️ Konfigurace

Všechny výchozí hodnoty lze změnit přímo v aplikaci přes nastavení (ikona ⚙️):

| Parametr | Výchozí hodnota | Min | Max |
|---|---|---|---|
| Příprava | 10 s | 5 s | 60 s |
| Cvičení | 20 s | 5 s | 180 s |
| Odpočinek | 10 s | 5 s | 180 s |
| Počet kol | 8 | 1 | 20 |
| Počet sérií | 1 | 1 | 10 |
| Pauza mezi sériemi | 60 s | 10 s | 300 s |

---

## 📜 Licence

Tento projekt je pod licencí **MIT**.
