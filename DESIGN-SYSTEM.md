# Sotos Syndrome Fundraiser - Charity Tournament Design System

## Overview
This design system creates a compassionate, uplifting, and hope-filled UI specifically designed for the Sotos Syndrome fundraiser pickleball tournament. The design prioritizes warmth, accessibility, and community spirit while maintaining professional tournament management functionality.

## Design Philosophy

### Core Principles
- **Compassionate**: Soft, caring colors and gentle animations that provide comfort
- **Hopeful**: Light, airy aesthetic that inspires positivity and community spirit
- **Professional**: Clean, organized layout that efficiently manages tournament data
- **Accessible**: High contrast options, keyboard navigation, and screen reader support
- **Mobile-First**: Responsive design that works beautifully on all devices

### Emotional Goals
- Inspire generosity and community participation
- Provide comfort to families affected by Sotos Syndrome
- Create a welcoming environment for all skill levels
- Celebrate the spirit of giving through sport

## Color Palette

### Primary Colors - Soft Sage Green (Hope, Growth, Healing)
```css
--primary-50: #f0f9f0   /* Lightest - backgrounds */
--primary-100: #dcf2dc  /* Light - cards, hover states */
--primary-200: #bce5bc  /* Medium-light - borders */
--primary-300: #94d394  /* Medium - disabled states */
--primary-400: #6bb86b  /* Medium-dark - accents */
--primary-500: #4a9d4a  /* Main primary - buttons, brands */
--primary-600: #3a7d3a  /* Dark - text, active states */
--primary-700: #2f5f2f  /* Darker - headings */
--primary-800: #264826  /* Very dark */
--primary-900: #1f3a1f  /* Darkest */
```

### Secondary Colors - Warm Peach (Comfort, Care)
```css
--secondary-50: #fef7f0   /* Lightest */
--secondary-100: #fdebd7  /* Light */
--secondary-200: #fbd3af  /* Medium-light */
--secondary-300: #f7b377  /* Medium */
--secondary-400: #f28b47  /* Medium-dark */
--secondary-500: #ee6725  /* Main secondary */
--secondary-600: #d4511b  /* Dark */
--secondary-700: #b13d19  /* Darker */
--secondary-800: #8e321e  /* Very dark */
--secondary-900: #732a1c  /* Darkest */
```

### Court Colors (Soft and Distinguishable)
```css
--court-1: #e1f5fe  /* Soft Sky Blue */
--court-2: #f3e5f5  /* Soft Lavender */
--court-3: #e8f5e8  /* Soft Mint */
--court-4: #fff3e0  /* Soft Apricot */
--court-5: #fce4ec  /* Soft Rose */
```

### Background Gradients
```css
--gradient-main: linear-gradient(135deg, #f0f9f0 0%, #fef7f0 50%, #e1f5fe 100%)
--gradient-card: linear-gradient(135deg, #ffffff 0%, #f9fffe 100%)
--gradient-court: linear-gradient(135deg, var(--primary-100) 0%, var(--secondary-100) 100%)
```

## Typography

### Font Families
- **Primary Font**: Nunito - Friendly, rounded, approachable for headings and emphasis
- **Secondary Font**: Inter - Clean, highly readable for body text and data

### Typography Scale
```css
.text-hero: 2.5rem, line-height: 1.2, weight: 700
.text-title: 2rem, line-height: 1.3, weight: 600
.text-subtitle: 1.5rem, line-height: 1.4, weight: 600
.text-body: 1rem, line-height: 1.6, weight: 400
.text-small: 0.875rem, line-height: 1.5, weight: 400
.text-caption: 0.75rem, line-height: 1.4, weight: 500
```

## Component Library

### 1. Tournament Header (`CharityTournamentHeader`)
**Purpose**: Main tournament branding and basic info display
**Features**:
- Large, prominent "SOTOS SYNDROME FUNDRAISER" title
- Decorative gradient line divider
- Info cards with tournament statistics
- Floating pickleball icons for visual interest

**Usage**:
```jsx
<CharityTournamentHeader 
  totalPlayers={22}
  totalRounds={10}
  courtsPerRound={5}
  accuracy={97}
/>
```

### 2. Court Cards (`CourtCard`)
**Purpose**: Display individual court matches with score inputs
**Features**:
- Color-coded by court number
- Gentle hover animations
- Team player numbers with soft gradients
- Accessible score inputs with focus states

**Usage**:
```jsx
<CourtCard 
  courtNumber={1}
  team1Players={[14, 11]}
  team2Players={[12, 22]}
  team1Score={score1}
  team2Score={score2}
  onTeam1ScoreChange={handleScore1Change}
  onTeam2ScoreChange={handleScore2Change}
/>
```

### 3. Player Numbers (`PlayerNumber`)
**Purpose**: Display player identifiers with team color coding
**Features**:
- Gradient backgrounds for team differentiation
- Hover animations with gentle scaling
- Subtle shimmer effect on interaction

### 4. Round Selector (`RoundSelector`)
**Purpose**: Navigation between tournament rounds
**Features**:
- Clear active state indicators
- Gentle hover transitions
- Responsive layout for mobile

### 5. Standings Table (`StandingsTable`)
**Purpose**: Display player rankings and statistics
**Features**:
- Gradient table headers
- Row hover effects
- Special indicators for iron players and top performers
- Responsive horizontal scrolling

### 6. Submit Button (`SubmitButton`)
**Purpose**: Primary action button for submitting scores
**Features**:
- Gradient background with shimmer animation
- Loading states with gentle spinner
- Disabled state handling
- "With Care" messaging for emotional connection

### 7. Footer (`CharityFooter`)
**Purpose**: Branding and contact information
**Features**:
- FAIR-PLAY branding with pickleball icon
- QR code placeholder with contact details
- Charity message with heart emoji
- Subtle background gradients

## Animation Guidelines

### Micro-Interactions
- **Hover States**: Gentle scale transforms (1.05x max)
- **Button Presses**: Subtle downward movement (-2px)
- **Loading States**: Soft pulse animations (3s duration)
- **Focus States**: Ring animations with brand colors

### Transition Timing
- **Fast**: 0.15s - immediate feedback (button clicks)
- **Medium**: 0.3s - hover states and focus changes
- **Slow**: 0.5s - page transitions and complex animations

### Easing Functions
- **Primary**: cubic-bezier(0.4, 0, 0.2, 1) - smooth and natural
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55) - playful interactions

## Accessibility Features

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- High contrast mode support with enhanced borders
- Color-blind friendly palette with shape/icon differentiation

### Keyboard Navigation
- Full keyboard navigation support
- Clear focus indicators (3px primary color outline)
- Logical tab order through all interactive elements

### Screen Readers
- Semantic HTML structure
- ARIA labels for interactive elements
- Screen reader friendly table headers

### Motion Sensitivity
- Reduced motion support (prefers-reduced-motion: reduce)
- Optional animation disabling
- Essential animations only when motion is reduced

## Responsive Breakpoints

```css
/* Mobile First Approach */
.container { max-width: 100% }

/* Tablet */
@media (min-width: 768px) {
  .court-grid { grid-template-columns: repeat(2, 1fr) }
}

/* Desktop */
@media (min-width: 1024px) {
  .court-grid { grid-template-columns: repeat(3, 1fr) }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .court-grid { grid-template-columns: repeat(5, 1fr) }
}
```

## Implementation Guidelines

### File Structure
```
/charity-tournament-ui/
├── index-charity-design.html    # Main HTML with embedded styles
├── charity-styles.css           # Additional custom styles
├── components.jsx               # React component library
├── DESIGN-SYSTEM.md            # This documentation
└── assets/
    └── fonts/                   # Custom font files if needed
```

### Quick Start with Existing App

1. **Replace existing `index.html`** with `index-charity-design.html`
2. **Add `charity-styles.css`** as additional stylesheet
3. **Update JavaScript** to use new class names and structure
4. **Test accessibility** with keyboard navigation and screen readers

### Customization Options

#### Color Variations
- Adjust CSS custom properties for different charity themes
- Maintain contrast ratios when changing colors
- Test with colorblind simulation tools

#### Typography Adjustments
- Scale font sizes proportionally using CSS `calc()`
- Maintain line-height ratios for readability
- Consider dyslexia-friendly fonts if needed

#### Animation Preferences
- Add `data-reduce-motion` attribute for user preferences
- Provide toggle in settings for animation control
- Respect system preferences automatically

## Brand Integration

### FAIR-PLAY Branding
- Consistent logo placement in footer
- QR code integration with contact information
- Professional presentation while maintaining charity warmth

### Charity Messaging
- Subtle integration of cause awareness
- Non-intrusive donation encouragement
- Focus on community and hope themes

## Performance Considerations

### Loading Optimization
- Lazy load non-critical animations
- Optimize gradient usage for mobile devices
- Use CSS transforms for better performance

### Mobile Performance
- Touch-friendly button sizes (minimum 44px)
- Optimized tap targets with adequate spacing
- Smooth scrolling and gesture support

## Testing Checklist

### Visual Testing
- [ ] All colors meet contrast requirements
- [ ] Gradients render correctly on all browsers
- [ ] Icons display properly at all sizes
- [ ] Responsive layout works on all breakpoints

### Functional Testing
- [ ] All buttons provide appropriate feedback
- [ ] Form inputs handle validation gracefully
- [ ] Loading states are clear and informative
- [ ] Error messages are compassionate and helpful

### Accessibility Testing
- [ ] Screen reader navigation is logical
- [ ] Keyboard-only navigation works completely
- [ ] High contrast mode is supported
- [ ] Color-blind users can distinguish all elements

### Performance Testing
- [ ] Page loads quickly on mobile networks
- [ ] Animations don't cause janky scrolling
- [ ] Memory usage remains reasonable
- [ ] Battery impact is minimal

## Future Enhancements

### Potential Additions
- Dark mode support for evening tournaments
- Customizable team colors for different charity events
- Animated celebration effects for completed rounds
- Social sharing components with charity messaging
- Donation progress tracking integration

### Scalability Considerations
- Component library extensibility
- Theme system for different charities
- Internationalization support
- Admin customization interface

This design system provides a comprehensive foundation for creating a compassionate, professional, and effective charity tournament application that honors the cause while delivering excellent user experience.