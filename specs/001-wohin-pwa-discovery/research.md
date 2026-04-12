# Research: wohin-pwa-discovery (Sun-Drenched Social)

## Research Tasks

### 1. Tonal Layering System (No-Line Rule)
- **Question**: How to implement the hierarchy of surfaces without borders in Tailwind?
- **Decision**: Define CSS variables for each surface level in `global.css` and map them to Tailwind's `backgroundColor`.
- **Rationale**: This allows for consistent tonal shifts (Base, Level 1, Level 2) and easy maintenance of the "No-Line" rule.
- **Implementation**:
  ```css
  :root {
    --color-surface: #fefcf4;
    --color-surface-container-low: #fbf9f1;
    --color-surface-container-lowest: #ffffff;
    --color-surface-container-high: #f1efdf;
  }
  ```

### 2. Typography: Plus Jakarta Sans & Be Vietnam Pro
- **Question**: Best way to load and use these fonts for high-contrast scaling?
- **Decision**: Use `@fontsource` packages or Google Fonts with Tailwind `fontFamily` extension.
- **Rationale**: Ensures fast loading and easy application via `font-display` and `font-body` classes.
- **Hierarchy**: Use `text-7xl` or `text-8xl` for `display-lg` to create the requested massive contrast against `body-md` (`text-base`).

### 3. Glass & Gradient Surfaces
- **Question**: How to implement the "juicy" peach gradient and glass navigation?
- **Decision**: Tailwind `bg-gradient-to-r` with `from-[#9c4f25]` to `to-[#ff9e6d]`. Use `backdrop-blur-md` for glass effects.
- **Rationale**: Matches the "Sun-Drenched" aesthetic while keeping implementation lightweight.

### 4. Custom Map Styling (MapLibre)
- **Question**: How to style MapLibre to match the cream/warm theme?
- **Decision**: Use a custom MapTiler or Mapbox style that emphasizes warm tones and minimizes heavy lines/borders.
- **Rationale**: A default "dark" or "standard blue" map would clash with the "The Radiant Curator" vision.
- **Technical Note**: Markers should use the "Pill" architecture or "Fluid Bubbles" as defined in the strategy.

### 5. Ambient Shadows (6% Opacity)
- **Question**: How to define the ultra-diffused shadow in Tailwind?
- **Decision**: Custom box-shadow in `tailwind.config.ts`.
- **Specs**: `box-shadow: 0 12px 24px 0 rgba(56, 56, 51, 0.06);`
