# Components Structure

Struktur komponen telah direfactor untuk memisahkan concerns dan meningkatkan reusability.

## Folder Organization

```
components/
├── shared/              # Reusable UI components
│   ├── Card.jsx        # Card, SummaryCard, LockedCard
│   ├── Button.jsx      # Button, IconButton
│   ├── Input.jsx       # Input, TextArea
│   ├── Section.jsx     # Section, FieldGroup, PageHeader
│   ├── Badge.jsx       # Badge, PlanBadge, StatusBadge
│   └── index.js        # Central export
│
├── features/           # Feature-specific components
│   ├── ProgressBar.jsx # Reusable progress bar
│   ├── DonutGauge.jsx  # Reusable donut chart
│   └── index.js        # Central export
│
├── layouts/            # Layout wrappers (untuk future use)
├── pages/              # Page-level components (untuk future use)
│
├── Dashboard.jsx       # Main dashboard page
├── Budget.jsx          # Budget tracker page
├── Profile.jsx         # Profile & settings page
├── Savings.jsx         # Savings page
├── Notes.jsx           # Notes page
├── Charts.jsx          # Charts page
├── Timeline.jsx        # Timeline page
├── Onboarding.jsx      # Onboarding page
├── AuthPage.jsx        # Auth page
├── MobileHeader.jsx    # Mobile header
├── MobileNav.jsx       # Mobile navigation
└── admin/              # Admin components
    └── AdminPanel.jsx
```

## Usage Guidelines

### Shared Components

Gunakan shared components untuk UI elements yang reusable:

```jsx
import { Card, Button, Input, Section, Badge } from './shared'

// Card
<Card hover>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Button
<Button variant="primary" size="md">Click me</Button>

// Input
<Input label="Name" placeholder="Enter name" />

// Section
<Section icon={<Icon />} title="Section Title">
  Content here
</Section>

// Badge
<Badge variant="success">Success</Badge>
```

### Feature Components

Gunakan feature components untuk specific features:

```jsx
import { ProgressBar, DonutGauge } from './features'

// Progress Bar
<ProgressBar percentage={75} label="Budget Used" />

// Donut Gauge
<DonutGauge percentage={60} color="var(--color-accent)" label="Progress" />
```

## Styling Guidelines

### ✅ DO

- Gunakan Tailwind classes dengan CSS variables
- Gunakan `text-text`, `bg-primary`, `border-border`, dll
- Gunakan `shadow-sm`, `shadow-md`, `shadow-gold`
- Gunakan `rounded-xl`, `rounded-2xl`

### ❌ DON'T

- Jangan gunakan inline styles untuk styling umum
- Jangan hardcode warna - gunakan CSS variables
- Jangan duplikasi styling - extract ke shared components

### CSS Variables Available

```css
/* Colors */
--color-primary, --color-primary-dark, --color-primary-light
--color-accent, --color-accent-dark, --color-accent-light
--color-success, --color-success-light
--color-warning, --color-warning-light
--color-danger, --color-danger-light
--color-text, --color-text-muted, --color-text-subtle
--color-bg, --color-surface, --color-border, --color-border-soft

/* Shadows */
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-gold
```

## Component Examples

### Card with Hover Effect
```jsx
<Card hover>
  <h3 className="text-sm font-semibold text-text">Title</h3>
  <p className="text-xs text-text-subtle">Subtitle</p>
</Card>
```

### Button Variants
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="gold">Gold</Button>
<Button variant="ghost">Ghost</Button>
```

### Input with Icon
```jsx
<Input
  label="Location"
  placeholder="Enter location"
  icon={MapPin}
  disabled={!editing}
/>
```

### Section with Icon
```jsx
<Section icon={<Heart size={16} />} title="Personal Info">
  <FieldGroup label="Name">
    <Input type="text" placeholder="Your name" />
  </FieldGroup>
</Section>
```

## Future Improvements

- [ ] Create layout components for common page layouts
- [ ] Create page wrapper components
- [ ] Add more feature components (charts, tables, etc.)
- [ ] Create form builder utilities
- [ ] Add animation utilities
