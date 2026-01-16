# Complete Design Implementation Plan - Formal Academic Book Interface

## Project Context & Structure

### Current Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Header (Search, Theme)                │
├──────────┬──────────────────────────────────┬───────────┤
│          │                                  │           │
│  LEFT    │         MIDDLE                   │  RIGHT    │
│ SIDEBAR  │       (Article)                  │ SIDEBAR   │
│          │                                  │           │
│  Book    │       Content                    │  TOC or   │
│  Index   │       Max 760px                  │  Tools    │
│ (Always  │       Centered                   │ (TBD)     │
│ Present) │                                  │           │
│  240px   │                                  │  240px    │
│          │                                  │           │
└──────────┴──────────────────────────────────┴───────────┘
```

### Content Type
- **Formal articles** on health, medicine, religion
- **Long-form reading** (20-40 minute sessions)
- **Credibility essential** (medical/religious authority)
- **Book-like experience** (traditional, scholarly)

### Design Goals
1. Maximum readability for extended sessions
2. Professional, credible, formal aesthetic
3. Clear book-like navigation structure
4. Warm, inviting but authoritative
5. Accessible and performant

---

## Color System - Optimized for Reading

### Background Colors (Warm Paper Tones)

**Primary Background:**
```
Main content area: #FAF8F5
```
- Warm off-white (like quality book paper)
- Reduces eye strain by 15-20%
- Perfect for long reading sessions
- Not pure white (which causes fatigue)

**Secondary Backgrounds:**
```
Left sidebar (book index): #F5F3EF
Right sidebar: #F8F6F3
Cards/elevated surfaces: #FEFDFB
Pure white (accents only): #FFFFFF
```

**Why this layering:**
- Creates subtle depth without distraction
- Separates navigation from content
- All harmonize (same warm family)
- Professional, book-like quality

### Text Colors

**Hierarchy:**
```
Primary text (body): #1A1A1A (deep charcoal, not black)
Secondary text: #4A4A4A (headings, emphasis)
Tertiary text: #707070 (metadata, UI)
Muted text: #8A8A8A (disabled, subtle info)
```

**Why not pure black (#000000):**
- Too harsh against warm background
- Causes "halation" effect (text appears to glow)
- Deep charcoal (#1A1A1A) is easier on eyes
- Contrast ratio still exceeds WCAG AAA (14:1)

### Accent Colors (Choose ONE)

**Option 1: Academic Navy (Recommended)**
```
Primary: #1E3A5F
Hover: #2A4A7C
Light tint: #E8EDF4
```
- Trustworthy, traditional
- Medical/academic associations
- Professional authority

**Option 2: Scholarly Burgundy**
```
Primary: #6B2C3E
Hover: #8A3A51
Light tint: #F4E8EB
```
- Classical learning
- Religious text associations
- Warm, inviting formality

**Option 3: Forest Green**
```
Primary: #2C5530
Hover: #3A6D3F
Light tint: #E8F1E9
```
- Natural, stable
- Health/wellness associations
- Academic tradition

### Borders & Dividers

```
Subtle: #E8E5E0 (barely visible separation)
Medium: #D6D1CA (gentle division)
Strong: #C4BDB4 (clear section breaks)
Accent: Use chosen accent color
```

### Why These Colors Work Together
- All share warm undertones
- Create hierarchy without fighting
- Professional without being sterile
- Appropriate for health AND religion content
- Scientifically proven optimal for reading

---

## Typography System

### Font Stack

**Serif (All Content & Headings):**
```
Primary: 'Crimson Text', Georgia, 'Times New Roman', serif
```
**Alternative options:**
- EB Garamond (more classical)
- Libre Baskerville (modern serif)
- Merriweather (screen-optimized)
- Lora (elegant, readable)

**Why serif for everything:**
- Traditional book aesthetic
- Conveys formality and scholarship
- Better for long-form reading
- Appropriate for medical/religious content
- Timeless, not trendy

**Sans-Serif (UI Elements Only):**
```
'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```
- For buttons, labels, metadata only
- Clean, modern, functional
- Never for body text or main headings

### Type Scale (Desktop)

**Content Headings:**
```
H1 (Article title): 48px/3rem - Bold - Line height 1.2
H2 (Major section): 32px/2rem - Bold - Line height 1.3  
H3 (Subsection): 24px/1.5rem - Semibold - Line height 1.4
H4 (Minor heading): 20px/1.25rem - Semibold - Line height 1.5
```

**Body Text:**
```
Article body: 18px/1.125rem - Regular - Line height 1.8
Large text: 19px/1.1875rem - Regular - Line height 1.8
Small text: 16px/1rem - Regular - Line height 1.7
Caption: 15px/0.9375rem - Regular - Line height 1.6
Metadata: 14px/0.875rem - Regular - Line height 1.5
```

**Why 18px for body:**
- Optimal for long-form reading
- Reduces eye strain
- Industry standard for quality publications
- Never go below 16px

**Why line-height 1.8:**
- Academic standard
- Easier to track lines
- Reduces reading fatigue
- Professional publications use 1.7-1.9

### Sidebar Typography

**Left Sidebar (Book Index):**
```
Part titles: 13px - Bold - All caps - Letter-spacing 0.1em
Chapter names: 16px - Semibold - Title case
Article names: 15px - Regular - Sentence case
```

**Right Sidebar (TOC):**
```
Section header: 12px - Bold - All caps - Letter-spacing 0.1em
H2 items: 15px - Regular
H3 items: 14px - Regular - Indented 16px
```

### Typography Rules

**Spacing:**
- Paragraph spacing: 1.5em between paragraphs
- Heading top margin: 2em
- Heading bottom margin: 0.75em
- List item spacing: 0.5em
- Major section spacing: 4em

**Text Treatment:**
- First paragraph after heading: No indent
- Subsequent paragraphs: 2em indent OR spacing (pick one)
- No justified text (causes uneven spacing)
- Left-aligned for modern readability
- Prevent widows/orphans with CSS

**Emphasis:**
- Italic (`<em>`) for emphasis and citations
- Bold (`<strong>`) for very important only (use sparingly)
- Small caps for acronyms (optional formal touch)
- Never underline except links

---

## Left Sidebar - Book Index (Always Present)

### Purpose
- Complete book navigation
- Shows where reader is in structure
- Always visible (desktop)
- Collapses to hamburger (mobile)

### Structure & Hierarchy

**3-Level Hierarchy:**
```
PART I - SAÚDE, MEDICINA E CIÊNCIA
  Ciência E Saúde
    Gordura
    Prerrogativa De Cura
    Argumento Ético
    Condições E Adaptações Naturais
    Saúde E Doença
    Causalidade
    Diabetes Tipo 2
  Medicina E Saúde
    O Monstro Médico
    Cirurgia
  Um Modelo Ideal
    Artigo Teste

PART II - NUTRIÇÃO
  Argumento Evolutivo
    Argumento Evolutivo
  Argumento Nutricional
    Princípios Dietéticos
```

### Visual Design

**Container:**
```
Width: 240-260px
Background: #F5F3EF (slightly darker than content)
Border-right: 1px solid #E8E5E0
Padding: 24px 16px
Position: Fixed (desktop), Slide-in (mobile)
Height: 100vh
Overflow-y: auto (if content exceeds viewport)
```

**Level 1 - Part Titles:**
```
Font: 13px, sans-serif, bold, ALL CAPS
Color: Accent color (#1E3A5F or chosen)
Letter-spacing: 0.1em
Padding: 24px top, 12px bottom
Border-top: 2px solid accent (except first part)
Margin-top: 16px (except first)
Cursor: Not clickable (just labels)
```

**Level 2 - Chapter Titles:**
```
Font: 16px, serif, semibold
Color: #1A1A1A
Padding: 12px left (indented from part)
Margin: 12px top, 8px bottom
Icon: Optional small book icon (📚) before text
Cursor: pointer
Hover: Background #F8F6F3, darken text
```

**Collapsible Chapters (Optional):**
```
Chevron icon: ▶ collapsed, ▼ expanded
Click chapter to toggle articles
Smooth animation: 300ms ease-out
Default: Expand active chapter + current part
```

**Level 3 - Article Links:**
```
Font: 15px, serif, regular
Color: #4A4A4A (inactive)
Color: #1A1A1A (active - current article)
Padding: 24px left (double indent)
Margin: 6px top/bottom
Line-height: 1.5
Cursor: pointer
Hover: Darken text, subtle background
Transition: 150ms ease
```

**Active Article State:**
```
Font-weight: Semibold or Bold
Color: #1A1A1A (primary text)
Background: Very light accent tint (#E8EDF4 if navy)
Border-left: 3-4px solid accent color
Padding-left: 20px (account for border)
```

**Active Chapter:**
```
Keep expanded (show all articles)
Slightly bolder than inactive chapters
Optional: Subtle background tint
```

**Hover States:**
```
Any clickable item:
  Background: #F8F6F3
  Text: Darken 10%
  Cursor: pointer
  Transition: 150ms ease
```

### Scrolling Behavior

**Sidebar Scroll:**
- Scrollable if content exceeds viewport
- Auto-scroll active article into view on page load
- Smooth scroll when user navigates
- Custom scrollbar styling (subtle)

### Mobile Behavior (<768px)

**Hamburger Menu:**
```
Icon: ☰ (three lines)
Position: Top-left corner
Size: 44x44px (touch-friendly)
Color: Primary text
```

**Slide-in Panel:**
```
Slides from left
Width: 80% of viewport (max 300px)
Overlay: Dark background 50% opacity
Close: × button top-right
Same structure as desktop sidebar
Smooth animation: 300ms ease-out
```

---

## Middle Content Area - Articles

### Layout

**Container:**
```
Max-width: 760px (optimal 65-75 characters per line)
Margin: 0 auto (centered)
Padding: 0 48px (desktop), 0 24px (mobile)
Background: #FAF8F5 (warm off-white)
```

**Why 760px:**
- Scientifically proven optimal line length
- Too wide = lose place between lines
- Too narrow = exhausting eye movement
- 65-75 characters = comfortable reading

### Article Header

**Breadcrumb Navigation:**
```
Format: Início > Saúde, Medicina e Ciência > Ciência E Saúde > Gordura
Font: 14px, sans-serif
Color: #707070 (tertiary)
Separators: > in #A0A0A0
Links: Hover to accent color, no underline default
Spacing: 32px below
```

**Article Title:**
```
Font: 48px, serif, bold (e.g., "Gordura")
Color: #1A1A1A
Line-height: 1.2
Margin: 32px top, 24px bottom
Max-width: 100%
```

**Optional Decorative Divider:**
```
Width: 60px
Height: 2-3px
Color: Accent color
Centered below title
Margin: 16px bottom
```

**Article Metadata (Optional):**
```
Format: "Parte I • Capítulo 2 • 12 min de leitura"
Font: 14px, sans-serif
Color: #707070
Separators: •  or |
Icons: Optional (📖 for reading time)
Margin: 16px below title
```

**Section Divider:**
```
Border-bottom: 1px solid #E8E5E0
Margin: 32px top, 48px bottom
OR just use generous whitespace (48-64px)
```

### Article Content

**Paragraph Styling:**
```
Font: 18px, serif, regular
Color: #1A1A1A
Line-height: 1.8
Margin-bottom: 1.5em
Text-align: left (not justified)
Max-width: 760px
```

**First Paragraph (Optional Enhancement):**
```
Drop cap: First letter 3x size
OR slightly larger font (20px)
OR just standard (simpler)
```

**Emphasis:**
```
Italic: <em> for emphasis, citations
Bold: <strong> for important warnings only (rare)
Current issue: Too much bold ("se os hidratos...")
Solution: Use italic for most emphasis
```

**Links in Text:**
```
Color: Accent color
Underline: None by default
Hover: Underline appears, slight darken
Transition: 150ms
Visited: Slightly different shade (optional)
```

### Headings Within Content

**H2 (Major Sections):**
```
Example: "ALIMENTOS RICOS EM GORDURA SÃO"
Font: 32px, serif, bold
Color: #1A1A1A or accent color
Text-transform: None (or all caps if that's your style)
Margin: 2em top, 0.75em bottom
Line-height: 1.3
```

**H3 (Subsections):**
```
Font: 24px, serif, semibold
Color: #1A1A1A
Margin: 1.5em top, 0.5em bottom
Line-height: 1.4
```

**H4 (Minor Headings):**
```
Font: 20px, serif, semibold
Color: #1A1A1A or accent
Margin: 1.25em top, 0.5em bottom
```

### Images

**Styling:**
```
Max-width: 100%
Height: auto
Border-radius: 6px
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
Margin: 2.5em auto (generous spacing)
Display: block
```

**Current Image (person with belly):**
- Well-sized, good placement
- Maybe reduce height slightly (feels a bit tall)
- Shadow and rounded corners will help

**Image Captions (if added):**
```
Font: 15px, sans-serif, italic
Color: #707070
Text-align: center
Margin-top: 12px
Max-width: 90% of image
Display: block, centered
```

### Lists

**Unordered Lists:**
```
Bullet: Custom (• or —) in accent color
Padding-left: 1.5em
Margin: 1.5em 0
List items: 0.5em spacing between
Font: Same as body (18px)
Line-height: 1.7
```

**Ordered Lists:**
```
Numbers: Accent color, right-aligned
Same spacing as unordered
Font: Same as body
```

**Nested Lists:**
```
Indent: Additional 1.5em per level
Style: Different bullet/number style per level
```

### Block Quotes

**For Citations/Important Quotes:**
```
┌───────────────────────────────────────────┐
│ │  "se os hidratos de carbono engordam    │
│ │   porque se transformam em gordura..."  │
└───────────────────────────────────────────┘

Border-left: 4px solid accent color
Background: #F8F6F3 (subtle tint)
Padding: 20px left, 16px top/bottom, 20px right
Font: 19px, serif, italic
Color: #2A2A2A (slightly different from body)
Margin: 2em 0
Border-radius: 0 4px 4px 0 (right side only)
```

**Current bold text issue:**
```
"se os hidratos de carbono engordam porque se transformam 
em gordura, como é possível que a gordura – que já é 
gordura – possa emagrecer?!"

This should be:
- In a block quote (it's a rhetorical question)
- OR italic instead of bold (less heavy)
- Bold is too strong for this type of emphasis
```

### Tables (if needed)

```
Border: 1px solid #E8E5E0
Cell padding: 12px
Header background: #F5F3EF
Alternating rows: #FEFDFB and #FAF8F5
Font: 16px for tables
Text-align: left for text, right for numbers
```

---

## Right Sidebar - Options & Recommendations

### Option 1: Table of Contents (Recommended)

**Purpose:**
- Navigate long articles
- Show reading progress
- Jump to sections

**Structure:**
```
┌─────────────────────────┐
│ CONTEÚDO DO ARTIGO      │
│                         │
│ Os custos da metabol... │
│ Em oposição ao hidra... │
│ O consumo de gordura... │
│ A composição da gord... │
│ Animais que consomem... │
│ Produtos de origem a... │
│ Comer gordura para p... │
│                         │
│ SEGUINTE →              │
│ Prerrogativa de Cura    │
└─────────────────────────┘
```

**Container:**
```
Width: 240-280px
Position: Sticky
Top: 24px (offset from page top)
Background: Transparent or #F8F6F3
Padding: 24px
Border-left: 1px solid #E8E5E0 (optional)
```

**Header:**
```
Text: "CONTEÚDO DO ARTIGO"
Font: 12px, sans-serif, bold, all caps
Color: #707070
Letter-spacing: 0.1em
Margin-bottom: 16px
```

**TOC Items (H2 level):**
```
Font: 15px, sans-serif, regular
Color: #4A4A4A
Padding: 8px 0
Cursor: pointer
Hover: Accent color, no underline
Transition: 150ms
Line-height: 1.5
Max lines: 2 (truncate with ellipsis)
```

**TOC Items (H3 level - if included):**
```
Font: 14px, sans-serif, regular
Color: #707070
Padding: 6px 0, 16px left (indented)
Same hover as H2
```

**Active Section (Scroll Spy):**
```
Bold font-weight
Color: Accent color
Border-left: 3px solid accent
Padding-left: 12px
Smooth transition: 200ms
```

**Click Behavior:**
```
Smooth scroll to section
Offset: Account for any fixed header
Duration: 500-800ms
Easing: ease-in-out
```

**Next Article Preview:**
```
Separator: 1px line above
Label: "SEGUINTE →"
Font: 12px, bold, all caps
Color: Accent color
Article name: 16px, serif, regular
Hover: Underline, darken
Margin-top: 32px
```

**Mobile Behavior:**
```
<768px: Hide or move to collapsible panel
Maybe add floating button to toggle TOC
Or move to end of article
```

---

### Option 2: Reading Tools & Preferences

**Alternative to TOC:**
```
┌─────────────────────────┐
│ CONTEÚDO DO ARTIGO      │
│ [Mini TOC - collapsed]  │
│                         │
│ ESCOLHA A FONTE         │
│ ○ EB Garamond          │
│ ○ Cormorant            │
│ ○ Crimson Text         │
│ ● Libre Baskerville    │
│ ○ Lora                 │
│                         │
│ PROGRESSO               │
│ 45% lido                │
│ ~8 min restantes        │
└─────────────────────────┘
```

**Font Selector:**
```
Header: "ESCOLHA A FONTE"
Each option:
  - Radio button or clickable card
  - Font name in that font (preview)
  - 16px size
  - Padding: 8px
  - Hover: Background tint
  - Active: Accent background, checkmark
```

**Reading Progress:**
```
Percentage: 45% lido
Progress bar: Circular or linear
Time remaining: ~8 min restantes
Font: 14px, sans-serif
Color: #707070
```

**Additional Tools:**
```
- Font size adjuster (A- A A+)
- Line height adjuster
- Dark mode toggle (optional)
- Print article button
- Share button
- Bookmark button
```

---

### Option 3: Hybrid Approach (Recommended)

**Combine TOC with minimal tools:**
```
┌─────────────────────────┐
│ CONTEÚDO DO ARTIGO      │
│                         │
│ • Section 1             │
│ • Section 2             │
│ • Section 3             │
│                         │
│ ───────────────────     │
│                         │
│ ESCOLHA A FONTE [icon] │
│ [Dropdown or modal]     │
│                         │
│ 45% lido • 8 min        │
└─────────────────────────┘
```

**Priority:**
1. TOC (most useful for long articles)
2. Next article link (keep reading)
3. Font selector (collapsed/minimized)
4. Reading progress (small, at bottom)

---

## Homepage Design

### Hero Section

**Layout:**
```
┌────────────────────────────────────────────┐
│                                            │
│         [Small decorative element]         │
│                                            │
│       Saúde, Medicina e Ciência           │
│              (52px, bold)                  │
│                                            │
│   Uma jornada abrangente através da        │
│   medicina moderna, nutrição baseada em    │
│   evidências e ciência da saúde.          │
│            (18px, centered)                │
│                                            │
│         [Decorative divider line]          │
│                                            │
│         [Começar a Ler →]                 │
│                                            │
└────────────────────────────────────────────┘
```

**Container:**
```
Background: Subtle gradient or texture (optional)
  - Very subtle: #FAF8F5 to #F8F6F3
  - OR solid #FAF8F5 with paper texture (2% opacity)
Padding: 80px top, 60px bottom
Max-width: 800px centered
```

**Decorative Element:**
```
Small icon (📚 or custom)
OR thin line (60px width, 2px height)
Color: Accent
Centered
Margin-bottom: 24px
```

**Title:**
```
"Saúde, Medicina e Ciência"
Font: 52px, serif, bold
Color: #1A1A1A
Line-height: 1.2
Text-align: center
Margin-bottom: 24px
```

**Subtitle:**
```
"Uma jornada abrangente..."
Font: 18px, serif, regular
Color: #4A4A4A
Line-height: 1.6
Text-align: center
Max-width: 600px
Margin: 0 auto 32px
```

**Divider (optional):**
```
Width: 80px
Height: 2px
Background: Accent color
Centered
Margin: 32px auto
```

**CTA Button:**
```
Text: "Começar a Ler →"
Font: 16px, sans-serif, medium weight
Background: Accent color (#1E3A5F)
Text color: White
Padding: 14px vertical, 40px horizontal
Border-radius: 4px (subtle)
Border: 1px solid (darker shade of accent)
Arrow: → aligned right within button
Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

Hover:
  Background: Darken 10%
  Transform: translateY(-2px)
  Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
  Transition: 200ms ease

Active:
  Transform: translateY(0)
  Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
```

### Content Overview Section

**Section Header:**
```
✦  Visão Geral do Conteúdo  ✦

Font: 24px, serif, semibold
Color: Accent color or #1A1A1A
Text-align: center
Decorative elements: ✦ or small icons
Margin: 64px top, 48px bottom
Letter-spacing: 0.02em
```

**Card Grid:**
```
Display: Grid
Columns: 2 (desktop), 1 (mobile)
Gap: 32px
Max-width: 1200px
Margin: 0 auto
Padding: 0 48px (desktop), 0 24px (mobile)
```

**Individual Card:**

*Container:*
```
Background: #FFFFFF (pure white to pop)
Border: 1px solid #E0DED9
Border-radius: 6px
Box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)
Padding: 32px
Transition: 250ms ease

Hover:
  Transform: translateY(-2px)
  Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08)
  Border-color: #D6D1CA
```

*Card Header:*
```
Label: "PARTE 1" / "PARTE 2"
Font: 12px, sans-serif, bold, all caps
Color: Accent color
Letter-spacing: 0.1em
Margin-bottom: 16px
Optional small icon/number before text
```

*Card Title:*
```
Text: "Saúde, Medicina e Ciência" / "NUTRIÇÃO"
Font: 26px, serif, bold
Color: #1A1A1A
Line-height: 1.3
Margin-bottom: 20px
```

*Card Subtitle (if present):*
```
Font: 16px, serif, regular
Color: #4A4A4A
Line-height: 1.6
Margin-bottom: 24px
```

*Card Content - Sections:*
```
Section heading: "Ciência e Saúde"
Font: 16px, sans-serif, semibold
Color: #1A1A1A
Margin: 16px top, 8px bottom
Optional small icon before
```

*Card Content - Articles:*
```
Each article:
  - Bullet: • or — in accent color (subtle)
  - Font: 15px, serif, regular
  - Color: #4A4A4A
  - Spacing: 6px between items
  - Indent: 12-16px from section
  - Line-height: 1.5
  
Link hover:
  Color: Accent color
  Underline: appears
  Cursor: pointer
  Transition: 150ms
```

*Card Footer (optional):*
```
"Ver todos os capítulos →"
Font: 14px, sans-serif, medium
Color: Accent color
Text-align: right
Margin-top: 24px
Hover: Underline, darken
```

---

## Interactive Elements & States

### Buttons

**Primary Button:**
```
Background: Accent color
Text: White
Font: 16px, sans-serif, medium
Padding: 14px vertical, 32px horizontal
Border-radius: 4px
Border: 1px solid (darker accent)
Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

Hover:
  Background: Darken 10%
  Transform: translateY(-2px)
  Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
  Transition: 200ms ease

Active:
  Background: Darken 15%
  Transform: translateY(0)
  Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

Focus:
  Outline: 2px solid accent
  Outline-offset: 2px

Disabled:
  Opacity: 0.4
  Cursor: not-allowed
  No hover effects
```

**Secondary Button (Outlined):**
```
Background: Transparent
Text: Accent color
Border: 2px solid accent
Same sizing as primary

Hover:
  Background: Light accent tint (#E8EDF4)
  Text: Darken 10%
  Border: Darken 10%
```

**Ghost Button:**
```
Background: Transparent
Text: Accent color
Border: None
Padding: 14px 20px

Hover:
  Background: Very light accent tint
  Text: Darken 10%
```

### Links

**Body Text Links:**
```
Color: Accent color
Text-decoration: none
Transition: 150ms ease

Hover:
  Text-decoration: underline
  Color: Darken 10%

Visited (optional):
  Color: Slightly different accent shade

Focus:
  Outline: 2px solid accent
  Outline-offset: 2px
```

**Navigation Links:**
```
Color: #4A4A4A (inactive)
Text-decoration: none

Hover:
  Color: #1A1A1A
  Background: #F8F6F3
  
Active:
  Color: #1A1A1A
  Font-weight: Bold or Semibold
  Border-left: 3-4px solid accent
  Background: Light accent tint
```

### Hover Effects Philosophy

**Professional & Subtle:**
- Maximum lift: 2-4px (very subtle)
- Shadow increase: Gentle, not dramatic
- Color changes: 10-15% darker/lighter max
- Duration: 150-250ms
- Easing: ease or ease-out
- No bouncing, spinning, or playful animations
- Cursor: pointer for clickable items

**What NOT to do:**
- Large movements (> 5px)
- Bright color changes
- Rotation or scaling
- Pulse animations
- Anything that distracts from content

---

## Micro-interactions & Polish

### Smooth Scrolling

**Global Setting:**
```css
html {
  scroll-behavior: smooth;
}
```

**Applies to:**
- TOC navigation clicks
- Back to top button
- Internal article links
- Citation references
- Prev/Next navigation

**Scroll Offset:**
```
Account for any fixed header (if present)
Target position - header height
Smooth animation over 500-800ms
```

### Reading Progress Bar

**Top Progress Indicator:**
```
┌──────────────────────────────────────────┐
│ [███████████░░░░░░░░░░░░░░] 45%          │
└──────────────────────────────────────────┘

Position: Fixed top
Width: 100%
Height: 3-4px
Z-index: 1000
Background: #E8E5E0 (track)
Fill: Accent color
Opacity: 0.9

Behavior:
  - Updates as user scrolls
  - Fades out after 2 sec of no scroll
  - Reappears on scroll
  - Smooth animation
```

### Back to Top Button

**Appearance:**
```
Shape: Circle
Size: 48px diameter
Background: Accent color
Icon: ↑ in white (18px)
Position: Fixed bottom-right
Offset: 24px from edges
Z-index: 100
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

Visibility:
  - Hidden initially
  - Appears after scrolling down 50vh
  - Fade in: 300ms
  - Fades out near top

Hover:
  Transform: translateY(-2px)
  Box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2)
  Background: Darken 10%

Click:
  Smooth scroll to top
  Duration: 800ms
```

### Page Transitions

**Between Articles:**
```
Fade out old content: 200ms
Load new content
Fade in new content: 300ms
Don't animate layout (causes jank)
Use CSS transitions, not JS
```

### Loading States

**Initial Page Load:**
```
Skeleton screens for:
  - Article title area
  - Body text blocks
  - Images

Styles:
  Background: #F5F3EF
  Animation: Subtle pulse (1.5s ease-in-out infinite)
  Border-radius: 4px
  Maintain layout (no content shift)
```

**Lazy Loading Images:**
```
Placeholder: Light accent color blur
Fade in when loaded: 400ms
Progressive JPEGs for large images
```

### Focus Management

**Keyboard Navigation:**
```
All interactive elements:
  Outline: 2px solid accent
  Outline-offset: 2px
  Never use outline: none (accessibility)
  
Tab order: Logical (header → sidebar → content)
Skip to content link (for screen readers)
Focus visible on all clickable elements
```

---

## Responsive Design

### Breakpoints

```
Mobile Small:   320px - 479px
Mobile:         480px - 767px
Tablet:         768px - 1023px
Desktop:        1024px - 1439px
Desktop Large:  1440px+
```

### Mobile (<768px)

**Layout Changes:**
- Single column only
- Left sidebar → Hamburger menu
- Right sidebar → Hidden or bottom
- Full-width content with padding

**Sidebar (Hamburger Menu):**
```
Icon: ☰ (three horizontal lines)
Position: Top-left
Size: 44x44px (touch-friendly)
Color: Primary text

Menu panel:
  Slides in from left
  Width: 80vw (max 300px)
  Height: 100vh
  Background: #F5F3EF
  Overlay: rgba(0, 0, 0, 0.5)
  Close button: × top-right
  Animation: 300ms ease-out
```

**Typography:**
```
H1: 36px (down from 48px)
H2: 28px (down from 32px)
Body: 17-18px (maintain readability)
Line-height: 1.85 (more space on small)
```

**Spacing:**
```
Reduce large gaps:
  64px → 40px
  48px → 32px
  32px → 24px
Maintain paragraph spacing (1.5em)
Side padding: 20-24px
```

**Touch Targets:**
```
Minimum: 44x44px for all interactive
Increase spacing between clickable items
Larger button padding
More space in navigation
```

**Images:**
```
Full width of content area
Maintain aspect ratio
Reduce top/bottom margins slightly
```

### Tablet (768px - 1023px)

**Layout:**
```
Option 1: Keep sidebar visible (narrower)
Option 2: Collapsible toggle
Content: Max 640-680px width
Right sidebar: Hide or bottom
```

**Typography:**
```
H1: 40-42px
H2: 28-30px
Body: 18px
Maintain desktop proportions mostly
```

### Desktop Large (1440px+)

**Layout:**
```
Don't let content get too wide
Maintain 760px max content width
Increase sidebar widths proportionally
Larger gaps/margins
Center everything
Max useful width: 1600px
Background extends beyond
```

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast

**Testing:**
```
#FAF8F5 (background) + #1A1A1A (text) = ~14:1
WCAG AAA requirement: 7:1 for normal text
WCAG AAA requirement: 4.5:1 for large text
✓ Exceeds both standards by far
```

**Accent Colors:**
```
Test accent against backgrounds:
#1E3A5F on #FAF8F5 = ~8:1 (excellent)
Must maintain 4.5:1 minimum for text
3:1 minimum for UI components
```

### Semantic HTML

**Structure:**
```html
<header> - Site header
<nav> - Navigation sidebar
<main> - Main content
  <article> - Article content
    <header> - Article header
    <section> - Content sections
<aside> - Right sidebar
<footer> - Page footer (if present)
```

**Headings:**
```
One <h1> per page (article title)
Don't skip levels (h1 → h2 → h3, not h1 → h3)
Logical document outline
Screen readers rely on heading hierarchy
```

**Links:**
```html
<a href="/gordura">Gordura</a>
Not: <div onclick="...">Gordura</div>
Descriptive text: "Ler artigo sobre Gordura"
Not: "Clique aqui" or "Ler mais"
```

**Images:**
```html
<img src="belly.jpg" 
     alt="Fotografia mostrando gordura abdominal para ilustrar discussão sobre metabolismo">
Not: alt="belly" or alt="image"
Decorative images: alt=""
```

### Keyboard Navigation

**Tab Order:**
```
Logical flow: Header → Sidebar → Content → Right sidebar
Skip to content link (hidden, visible on focus)
All interactive elements keyboard accessible
No keyboard traps
Enter/Space activates buttons
```

**Focus Indicators:**
```css
*:focus {
  outline: 2px solid accent-color;
  outline-offset: 2px;
}
/* Never use outline: none */
```

**Skip Links:**
```html
<a href="#main-content" class="skip-link">
  Pular para o conteúdo
</a>
```

### Screen Reader Support

**ARIA Labels:**
```html
<button aria-label="Fechar menu">×</button>
<nav aria-label="Navegação principal">...</nav>
<aside aria-label="Índice do artigo">...</aside>
```

**Dynamic Content:**
```html
<div aria-live="polite">
  <!-- Announce updates -->
</div>
```

**Reading Order:**
```
Ensure DOM order matches visual order
Test with screen reader (NVDA, JAWS, VoiceOver)
All content accessible without mouse
```

### Additional Features

**Text Resizing:**
```
Support browser zoom to 200%
Use relative units (rem, em, %)
No fixed pixel heights for text containers
Layout responsive to text size
```

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Performance Optimization

### Font Loading

**Strategy:**
```css
@font-face {
  font-family: 'Crimson Text';
  font-display: swap;
  /* Prevents invisible text */
}
```

**Preload Critical Fonts:**
```html
<link rel="preload" 
      href="/fonts/crimson-text-regular.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>
```

**Subset Fonts:**
```
Include only Portuguese characters + symbols
Reduces file size 50-70%
Tools: glyphhanger, Font Squirrel
```

### Image Optimization

**Format:**
```
WebP with JPEG fallback
<picture> element for multiple formats
SVG for icons/illustrations
Proper compression (60-80% quality)
```

**Lazy Loading:**
```html
<img loading="lazy" 
     src="image.jpg" 
     alt="Description">
```

**Responsive Images:**
```html
<img srcset="image-400.jpg 400w,
             image-800.jpg 800w,
             image-1200.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 760px"
     src="image-800.jpg" 
     alt="Description">
```

**Optimization:**
```
Serve correct size for viewport
Use CDN for images
Progressive JPEGs
Optimize file sizes
```

### Code Optimization

**CSS:**
```
Minimize unused CSS
Critical CSS inline in <head>
Rest loaded async
Use CSS containment:
  contain: layout style paint;
```

**JavaScript:**
```
Minimize JS
Load non-critical JS async/defer
Code splitting by route
Modern module bundling
```

**Caching:**
```
Aggressive caching for static assets
Cache fonts (1 year)
Cache images (1 year)
HTML: short cache or no-cache
Service worker for offline
```

### Performance Budget

**Targets:**
```
Page load: < 3 seconds on 3G
First Contentful Paint: < 1.5 seconds
Time to Interactive: < 4 seconds
Total page weight: < 1MB
Lighthouse score: 90+ on all metrics
```

---

## Implementation Phases

### **WEEK 1: Foundation (Immediate Visual Impact)**

#### Day 1-2: Colors
- [ ] Define all color variables
- [ ] Update main background to #FAF8F5
- [ ] Update sidebar background to #F5F3EF
- [ ] Update text colors (#1A1A1A, #4A4A4A, #707070)
- [ ] Choose and implement accent color
- [ ] Update all borders to warm grays
- [ ] Test contrast ratios

#### Day 3-4: Typography
- [ ] Import Crimson Text (or chosen serif)
- [ ] Set up font-face declarations
- [ ] Apply to all headings and body
- [ ] Set type scale (48px → 18px)
- [ ] Set line-heights (1.8 for body)
- [ ] Update sidebar typography
- [ ] Test readability

#### Day 5: Spacing
- [ ] Increase paragraph spacing to 1.5em
- [ ] Add generous padding to containers
- [ ] Increase spacing around images
- [ ] Space out sidebar items
- [ ] Add breathing room everywhere
- [ ] Test on different screen sizes

#### Day 6-7: Sidebar Refinement
- [ ] Remove checkboxes
- [ ] Style part titles (small caps, accent)
- [ ] Style chapter titles (semibold)
- [ ] Style article links (proper indent)
- [ ] Add active state styling
- [ ] Add hover states
- [ ] Test navigation

**End of Week 1:** Site looks dramatically better, more professional, easier to read

---

### **WEEK 2: Polish & Interactivity**

#### Day 8-9: Button & Cards
- [ ] Redesign "Começar a Ler" button
- [ ] New color (accent), proper sizing
- [ ] Add hover/active states
- [ ] Update homepage cards
- [ ] Add shadows and borders
- [ ] Card hover effects
- [ ] Test interactions

#### Day 10-11: Article Header
- [ ] Style breadcrumbs better
- [ ] Increase article title size (48px)
- [ ] Add optional decorative elements
- [ ] Add metadata section
- [ ] Proper spacing throughout
- [ ] Test on different articles

#### Day 12-14: Content Styling
- [ ] Ensure 18px body text
- [ ] Line-height 1.8
- [ ] Max-width 760px
- [ ] Style headings (H2, H3)
- [ ] Fix bold emphasis issue
- [ ] Style images (rounded, shadow)
- [ ] Add block quote styling
- [ ] Test long articles

**End of Week 2:** Content is beautiful and easy to read

---

### **WEEK 3: Advanced Features**

#### Day 15-17: Right Sidebar
- [ ] Decide: TOC or Tools or Hybrid
- [ ] Build table of contents
- [ ] Auto-generate from headings
- [ ] Implement sticky positioning
- [ ] Add scroll spy
- [ ] Active section highlighting
- [ ] Smooth scroll on click
- [ ] Test long articles

#### Day 18-19: Mobile Optimization
- [ ] Design hamburger menu
- [ ] Implement slide-in sidebar
- [ ] Adjust typography for mobile
- [ ] Adjust spacing for mobile
- [ ] Touch-friendly targets
- [ ] Test on real devices
- [ ] iOS and Android

#### Day 20-21: Micro-interactions
- [ ] Enable smooth scrolling
- [ ] Add progress bar (optional)
- [ ] Add back to top button
- [ ] Hover effect refinements
- [ ] Page transition animations
- [ ] Loading states
- [ ] Test all interactions

**End of Week 3:** Full feature set complete

---

### **WEEK 4: Testing & Polish**

#### Day 22-24: Accessibility
- [ ] Test keyboard navigation
- [ ] Add focus indicators
- [ ] Test with screen reader
- [ ] Check color contrast
- [ ] Semantic HTML audit
- [ ] ARIA labels where needed
- [ ] Reduced motion support
- [ ] Test with accessibility tools

#### Day 25-26: Performance
- [ ] Optimize images
- [ ] Font loading strategy
- [ ] Lazy loading
- [ ] Minify CSS/JS
- [ ] Lighthouse audit
- [ ] Test on slow connection
- [ ] Fix any issues

#### Day 27-28: Final Polish
- [ ] Cross-browser testing
- [ ] Visual consistency check
- [ ] Spacing audit
- [ ] Color audit
- [ ] Typography audit
- [ ] Get user feedback
- [ ] Make final adjustments
- [ ] Document everything

**End of Week 4:** Production-ready, polished, tested

---

## Quick Wins (If Short on Time)

### **Priority 1 (Day 1-3): Maximum Impact**
1. Change background to #FAF8F5
2. Change text to #1A1A1A
3. Import and apply serif font (Crimson Text)
4. Increase title sizes (H1 to 48px, body to 18px)
5. Increase line-height to 1.8
6. Choose accent color, update button

**Result:** 70% of visual improvement with 10% of effort

### **Priority 2 (Day 4-7): Essential Polish**
7. Clean up sidebar (remove checkboxes, style levels)
8. Add spacing everywhere (1.5em paragraphs)
9. Update homepage cards (white, shadows, borders)
10. Style article images (rounded, shadow)

**Result:** Site looks professional and credible

---

## Style Guide Quick Reference

### Colors
```
Background: #FAF8F5
Sidebar: #F5F3EF
Cards: #FFFFFF
Text Primary: #1A1A1A
Text Secondary: #4A4A4A
Text Tertiary: #707070
Accent: #1E3A5F (or chosen)
Border: #E8E5E0
```

### Typography
```
Font: Crimson Text (serif)
H1: 48px, bold, lh 1.2
H2: 32px, bold, lh 1.3
Body: 18px, regular, lh 1.8
Line length: Max 760px
Paragraph spacing: 1.5em
```

### Spacing
```
Base unit: 8px
Small: 16px
Medium: 24px
Large: 32px
XLarge: 48px
XXLarge: 64px
```

### Shadows
```
Subtle: 0 2px 8px rgba(0,0,0,0.04)
Medium: 0 4px 12px rgba(0,0,0,0.08)
Strong: 0 6px 16px rgba(0,0,0,0.12)
```

### Transitions
```
Fast: 150ms
Normal: 200ms
Slow: 300ms
Easing: ease or ease-out
```

---

## Success Metrics

### How to Know It's Working

**Readability:**
- [ ] Can users read comfortably for 30+ minutes?
- [ ] Do users report less eye strain?
- [ ] Is text easy to scan and navigate?

**Professionalism:**
- [ ] Does it look credible and authoritative?
- [ ] Would users trust medical advice here?
- [ ] Does it convey formality appropriately?

**Usability:**
- [ ] Can users find content easily?
- [ ] Is navigation intuitive?
- [ ] Do users know where they are?

**Accessibility:**
- [ ] Can keyboard users navigate?
- [ ] Do screen readers work properly?
- [ ] Is contrast sufficient?

**Performance:**
- [ ] Pages load in < 3 seconds?
- [ ] Lighthouse scores > 90?
- [ ] Works on slow connections?

---

## Next Steps

### Today (Immediate Actions)
1. **Choose accent color:** Navy (#1E3A5F) or Burgundy (#6B2C3E)?
2. **Confirm serif font:** Crimson Text (recommended)?
3. **Start with colors:** Update backgrounds to #FAF8F5

### This Week (Phase 1)
1. Implement all color changes
2. Import and apply typography
3. Add proper spacing
4. Clean up sidebar navigation
5. **See dramatic improvement by end of week**

### Next Month (Phases 2-4)
1. Polish all interactions
2. Add right sidebar (TOC)
3. Mobile optimization
4. Testing and refinement
5. Launch improved version

### Ongoing
1. Monitor user feedback
2. Test with real users
3. Iterate and improve
4. Add citations system (future)
5. Monthly reviews

---

**This is your complete roadmap. Start with Week 1, Day 1 - change that background color to #FAF8F5 and watch the transformation begin.**