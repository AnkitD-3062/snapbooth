# SnapBooth

SnapBooth is a browser-based digital photo booth built with React and Vite. It gives users a lightweight studio-style flow: open the camera, capture a four-shot sequence, apply a mood filter, and export a polished photo strip.

## Highlights

- Live camera preview with in-browser capture
- Automatic four-shot countdown flow
- Filter selection before and after capture
- Review screen with downloadable photo strip output
- Responsive UI for desktop and mobile browsers

## Built With

- React 18
- Vite 5
- CSS Modules
- html2canvas

## Local Development

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/   UI screens and screen-specific styles
  hooks/        camera and booth sequencing logic
  styles/       global tokens, animations, and utilities
  utils/        photo-strip rendering helpers
```

## How It Works

1. The landing screen introduces the booth experience.
2. The booth screen requests camera access and manages the capture session.
3. The app captures four frames with timed countdowns.
4. The review screen lets the user change the filter and download the final strip.

## Notes

- Camera access requires a supported browser.
- In production, camera access should be served over HTTPS.
- `localhost` works for local camera testing during development.

## Status

This repository is ready for GitHub and set up for the next steps:

- deployment setup
- README polish with preview assets
- additional UI refinement
