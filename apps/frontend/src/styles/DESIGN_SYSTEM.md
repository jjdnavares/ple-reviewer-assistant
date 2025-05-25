# PLE Reviewer Assistant Design System

## Color System

Based on our Tailwind configuration, we use the following color palette:

### Primary Colors
- Primary: Blue (`--primary`) - Used for main actions, links, and highlighting important information
- Secondary: Light Blue-Gray (`--secondary`) - Used for secondary actions and less important UI elements

### Semantic Colors
- Destructive: Red (`--destructive`) - Used for errors, warnings, and destructive actions
- Muted: Light Gray (`--muted`) - Used for background areas and subdued content
- Accent: Light Blue-Gray (`--accent`) - Used for accents and highlights

### Text Colors
- Foreground (`--foreground`) - Main text color
- Muted Foreground (`--muted-foreground`) - Secondary text color
- Primary Foreground (`--primary-foreground`) - Text on primary colored backgrounds

## Typography

### Headings
- H1: `text-3xl font-bold tracking-tight` - Main page titles
- H2: `text-2xl font-semibold` - Section titles
- H3: `text-xl font-medium` - Sub-section titles
- H4: `text-lg font-medium` - Minor headings

### Body Text
- Regular: `text-base` - Standard body text
- Small: `text-sm` - Smaller text for less important information
- Micro: `text-xs` - Very small text for metadata and footnotes

## Layout System

### Layout Components

Our application uses a modular layout system with several reusable layout components:

#### Base Layout (`BaseLayout`)
A flexible foundational layout that wraps the entire application.

```tsx
<BaseLayout 
  showNavbar={true} 
  showFooter={true}
  showThemeToggle={true}
  className="custom-class"
  mainClassName="main-content-class"
>
  {children}
</BaseLayout>
```

#### Dashboard Layout (`DashboardLayout`)
Specialized layout for the dashboard with a sidebar navigation.

```tsx
<DashboardLayout>
  {dashboardContent}
</DashboardLayout>
```

#### Content Layout (`ContentLayout`)
For content-heavy pages with optional sidebar and back navigation.

```tsx
<ContentLayout
  title="Page Title"
  description="Page description text"
  backHref="/previous-page"
  backLabel="Back to Previous"
  actions={<Button>Action</Button>}
  sidebar={<SidebarContent />}
  sidebarPosition="left" // or "right"
>
  {mainContent}
</ContentLayout>
```

#### Auth Layout (`AuthLayout`)
Specialized layout for authentication pages like login and register.

```tsx
<AuthLayout
  title="Sign In"
  description="Enter your credentials to access your account"
>
  <LoginForm />
</AuthLayout>
```

### Page Container (`PageContainer`)
A flexible container for page content with configurable width and padding.

```tsx
<PageContainer
  maxWidth="xl" // "sm", "md", "lg", "xl", "2xl", "full", "none"
  noPadding={false}
  withBackground={true}
  className="custom-class"
>
  {pageContent}
</PageContainer>
```

### Spacing Guidelines

- Standard page padding: `p-4 sm:p-6`
- Content max width: Based on `maxWidth` prop in PageContainer
- Vertical spacing between sections: `space-y-6`

### Cards
- Standard card: `<Card>` component
- Content padding: `p-6`
- Spacing between cards: `gap-6`

### Grids
- Default grid: `grid gap-6`
- Two-column grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Three-column grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Four-column grid: `grid grid-cols-2 md:grid-cols-4 gap-4`

## UI Components

### Buttons
- Primary: `<Button>` - Main actions
- Secondary: `<Button variant="outline">` - Secondary actions
- Destructive: `<Button variant="destructive">` - Destructive actions
- Ghost: `<Button variant="ghost">` - Subtle actions

### Navigation
- Tab navigation: `<Tabs>` component
- Breadcrumbs: Links with separator
- Back button: `<Button variant="outline" size="sm">`

## Spacing System

- Extra small: `2px` (`p-0.5`, `m-0.5`)
- Small: `4px` (`p-1`, `m-1`)
- Medium: `8px` (`p-2`, `m-2`)
- Large: `16px` (`p-4`, `m-4`)
- Extra large: `24px` (`p-6`, `m-6`)

## Responsive Breakpoints

- sm: `640px`
- md: `768px`
- lg: `1024px`
- xl: `1280px`
- 2xl: `1400px`

## Theme Management

The application uses `next-themes` for theme switching functionality. A `ThemeToggle` component allows users to switch between light, dark, and system themes.

```tsx
<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
  {children}
</ThemeProvider>
```

## Consistent UI Patterns

### Page Headers
```tsx
<PageHeader title="Page Title" description="Page description" actions={<Button>Action</Button>} />
```

### Section Headers
```tsx
<SectionHeader title="Section Title" description="Section description" />
```

### Data Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {description && <CardDescription>{description}</CardDescription>}
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
  {footer && (
    <CardFooter>
      {footer}
    </CardFooter>
  )}
</Card>
```

### Stats Display
```tsx
<StatCard
  title="Stats Title"
  value={42}
  description="Stat description"
  icon={<Icon />}
/>
```
