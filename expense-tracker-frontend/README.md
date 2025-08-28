# Expense Tracker Frontend

A responsive React application for tracking personal expenses with mobile-first design.

## 🚀 Responsive Design Features

### Mobile-First Approach
- **Mobile-first CSS**: Base styles designed for mobile devices (320px+)
- **Progressive enhancement**: Features scale up for larger screens
- **Touch-friendly**: Optimized touch targets (44px minimum)

### Responsive Breakpoints
- **Mobile**: 320px - 767px (xs)
- **Tablet**: 768px - 1023px (sm)
- **Desktop**: 1024px - 1439px (md)
- **Large Desktop**: 1440px+ (lg)

### Key Responsive Components

#### Navigation
- **Mobile**: Hamburger menu with slide-out drawer
- **Desktop**: Horizontal navigation bar
- **Adaptive**: Responsive button sizes and spacing

#### Forms
- **Mobile**: Stacked layout with larger touch targets
- **Desktop**: Optimized spacing and layout
- **Validation**: Real-time form validation with mobile-friendly error display

#### Cards & Lists
- **Mobile**: Single column layout
- **Tablet**: Two column grid
- **Desktop**: Multi-column grid with optimal spacing

#### Charts & Visualizations
- **Mobile**: Simplified charts with touch interactions
- **Desktop**: Full-featured charts with hover effects

## 📱 Mobile Optimizations

### Touch Experience
- Minimum 44px touch targets
- Swipe gestures for navigation
- Touch-friendly form controls
- Optimized scrolling

### Performance
- Lazy loading for large lists
- Optimized images and icons
- Efficient re-rendering
- Mobile-optimized animations

### Accessibility
- Screen reader support
- High contrast mode
- Reduced motion support
- Focus management

## 🎨 Design System

### CSS Variables
```css
:root {
  --primary-color: #1976d2;
  --spacing-xs: 0.25rem;
  --spacing-md: 1rem;
  --border-radius-md: 8px;
  --shadow-md: 0 3px 6px rgba(0,0,0,0.16);
}
```

### Responsive Utilities
- `.container` - Responsive container with max-width
- `.grid` - Responsive grid system
- `.mobile-stack` - Stack elements vertically on mobile
- `.hide-mobile` / `.show-mobile` - Conditional display

## 🛠️ Technical Implementation

### Material-UI Integration
- Responsive breakpoints using `useMediaQuery`
- Adaptive component sizing
- Mobile-optimized spacing
- Touch-friendly interactions

### CSS Grid & Flexbox
- Responsive grid layouts
- Flexible container sizing
- Mobile-first grid systems
- Adaptive spacing

### Performance Optimizations
- CSS-in-JS with Material-UI
- Efficient re-rendering
- Optimized bundle size
- Progressive enhancement

## 📱 Mobile Testing

### Device Testing
- Tested on iOS Safari
- Tested on Android Chrome
- Responsive design validation
- Touch interaction testing

### Browser Support
- Chrome (mobile & desktop)
- Safari (mobile & desktop)
- Firefox (mobile & desktop)
- Edge (desktop)

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Mobile Testing
1. Use browser dev tools device simulation
2. Test on actual mobile devices
3. Validate touch interactions
4. Check responsive breakpoints

## 📋 Component Guidelines

### Responsive Props
```jsx
// Use responsive spacing
sx={{ 
  px: { xs: 2, sm: 3, md: 4 },
  fontSize: { xs: '1rem', sm: '1.25rem' }
}}

// Use responsive breakpoints
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

### Mobile-First CSS
```css
/* Base styles for mobile */
.component {
  padding: 1rem;
  font-size: 1rem;
}

/* Enhance for larger screens */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}
```

## 🔧 Customization

### Theme Overrides
- Custom breakpoints
- Responsive spacing
- Mobile-specific colors
- Adaptive typography

### Component Modifications
- Responsive layouts
- Mobile interactions
- Touch optimizations
- Performance improvements

## 📚 Resources

- [Material-UI Responsive Design](https://mui.com/material-ui/customization/breakpoints/)
- [Mobile-First CSS](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

**Built with React, Material-UI, and mobile-first design principles**
