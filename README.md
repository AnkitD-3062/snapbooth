# SnapBooth

SnapBooth is a browser-based digital photo booth built with React and Vite.

## Features

- Live camera preview
- Four-shot automatic capture flow
- Real-time filter selection
- Photo strip review and download
- Responsive layout for desktop and mobile

## Tech Stack

- React 18
- Vite 5
- CSS modules
- html2canvas

## Getting Started

Prerequisites:

- Node.js 18 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
  hooks/
  styles/
  utils/
```

## Notes

- Camera access requires a supported browser.
- In production, camera access should be served over HTTPS.
