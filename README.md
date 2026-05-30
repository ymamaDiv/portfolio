# Cloud & Technical Solutions Portfolio

A futuristic, premium animated single-page portfolio for an IT graduate specializing in cloud computing and technical solutions.

## Features

- Smooth page-load intro animation
- Hero staggered fade-in with letter-by-letter headline reveal
- Floating neon particle network background
- Animated glowing grid lines
- Parallax scrolling on hero elements
- Scroll-triggered section reveals (slide up + fade)
- Interactive glassmorphism cards with hover glow and scale
- Pulse-glow button hover effects
- Horizontal timeline with drawing progress line
- Mouse-follow ambient glow
- Shifting background gradient
- Smooth scrolling site-wide

## Getting Started

No build step required. Open `index.html` in a browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Structure

```
MyPortfolio/
├── index.html      # Main page
├── css/
│   └── styles.css  # Visual design & CSS animations
├── js/
│   └── main.js     # Particles, scroll effects, interactions
└── README.md
```

## Customization

- Update contact email and social links in `index.html` (Contact section).
- Edit project descriptions, skills, and timeline entries in `index.html`.
- Adjust colors in `:root` variables in `css/styles.css`.

## Browser Support

Modern browsers (Chrome, Firefox, Edge, Safari). Respects `prefers-reduced-motion` for accessibility.
