# Physics Portfolio

Interactive physics simulations and teaching demos — built with React + Vite, deployed via GitHub Actions to GitHub Pages.

## Stack

- React 18 + React Router (HashRouter for static hosting)
- Vite 5
- Pure Canvas API for all simulations (no physics libraries)
- CSS Modules
- GitHub Actions → GitHub Pages

## Simulations

| Sim | Physics | Key technique |
|-----|---------|---------------|
| Orbital Mechanics | Newtonian gravity | RK4, Verlet, Euler integrators |
| E&M Fields | Coulomb's law | Marching squares equipotentials, field line tracing |
| Wave Lab | SHM, wave optics, Fourier | Phase space portrait, double-slit interference |
| Mechanics Toolkit | Projectile, collisions | Drag comparison, elastic collision with readout |

## Local development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** → select `GitHub Actions`
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically

The site will be live at `https://<your-username>.github.io/physics-portfolio/`

> **Note:** `vite.config.js` sets `base: '/physics-portfolio/'` — change this to match your repo name if different.

## Project structure

```
src/
  components/
    Nav.jsx / Nav.module.css
  pages/
    Home.jsx / Home.module.css
    Projects.jsx / Projects.module.css
    SimulationPage.jsx / SimulationPage.module.css
    Teaching.jsx / Teaching.module.css
  simulations/
    OrbitalSim.jsx
    EMSim.jsx
    WaveSim.jsx
    MechanicsSim.jsx
    Sim.module.css        ← shared sim controls CSS
  App.jsx
  main.jsx
  index.css
.github/workflows/deploy.yml
vite.config.js
index.html
```
