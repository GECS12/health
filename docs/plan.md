## Step-by-Step Implementation Plan (Text Only)

---

### **Phase 1: Fix the Homepage Issue** (30 min)

**Current Problem:**
- When you visit localhost:3000, it automatically shows "Prerrogativa de Cura" article
- Should show either a landing page or the Introduction section

**Steps to Fix:**
1. Open the main page file for the reader section
2. Check if it's redirecting to the first article automatically
3. Change it to either:
   - Show a welcome/landing page with book info
   - Redirect to "Introdução" instead
   - Show a table of contents overview
4. Test that localhost:3000 now shows the correct page

---

### **Phase 2: Design the Citation System** (15 min planning)

**Decide on citation style:**
1. Choose format: Numbered [1], Author-Year (Silva, 2020), or Footnotes
2. Decide where citations appear:
   - Inline with text?
   - End of article?
   - Both?
3. Plan bibliography location:
   - Per article (local)
   - Global page (all citations together)
   - Both options available

**My Recommendation:**
- Use numbered citations [1] [2] in text
- Hover shows quick preview (author, year, title)
- Click jumps to full reference at article bottom
- Also have global bibliography page for all sources

---

### **Phase 3: Add Citation Data Structure to Sanity CMS** (45 min)

**What you're building:**
A place to store all your bibliographic information

**Create Citation Schema:**
1. Go to Sanity schema folder
2. Create new schema for citations
3. Define what information each citation needs:
   - Authors (list of names)
   - Publication year
   - Article/book title
   - Journal or publisher name
   - URL/DOI if available
   - Unique key (like "Silva2020" or "1")
   - Page numbers if relevant
4. Add this to your schema index so Sanity recognizes it
5. Restart Sanity Studio to see the new citation type

**Result:** You can now add citations in Sanity admin panel

---

### **Phase 4: Connect Citations to Articles** (1 hour)

**Two types of connections needed:**

**A. Inline Citations (in the text):**
1. Modify the article content structure
2. Add ability to insert citation markers while writing
3. When writing in Sanity, you can highlight text and add citation
4. Citation marker appears in text: "gordura engorda [1]"
5. Link citation marker to actual citation data

**B. Article Bibliography:**
1. Add "References" section to article structure
2. For each article, select which citations it uses
3. This creates a list of citations per article
4. These will display at bottom of article

---

### **Phase 5: Create Citation Display Components** (1.5 hours)

**Build three display components:**

**A. Inline Citation Marker:**
- Shows [1] or [Silva2020] in text
- Hoverable (shows preview on mouse hover)
- Clickable (jumps to full reference below)
- Styled to stand out but not distract

**B. Citation Tooltip:**
- Appears when hovering over citation marker
- Shows quick info: "Silva, J. (2020). Metabolismo da Gordura"
- Disappears when mouse moves away
- Positioned nicely (not cut off by screen edge)

**C. Bibliography Section:**
- Displays at end of article
- Shows full citation details
- Formatted in standard academic style
- Each citation has ID matching inline markers
- Optional: links to external sources

---

### **Phase 6: Update Content Renderer** (45 min)

**Modify how articles display:**
1. Find where article content is rendered
2. Add handling for citation marks
3. When citation marker found, render inline citation component
4. Pass citation data from Sanity to component
5. Test that citations appear correctly in text

**Ensure:**
- Citations don't break text flow
- Hover works smoothly
- Click scrolls to reference smoothly
- Mobile-friendly (tooltip works on touch)

---

### **Phase 7: Add Bibliography to Article Pages** (30 min)

**At bottom of each article:**
1. Check if article has references
2. If yes, add "Referências" section
3. Display all citations used in that article
4. Order them by appearance or alphabetically
5. Add visual separation (border, spacing)
6. Style to match academic format

**Features to add:**
- Highlight when user scrolls to it from inline citation
- External links open in new tab
- Clear, readable formatting
- Responsive on mobile

---

### **Phase 8: Create Global Bibliography Page** (45 min)

**New page showing all citations:**
1. Create new route/page called "Bibliografia"
2. Fetch all citations from entire book
3. Display alphabetically or by category
4. Add to main navigation (sidebar)
5. Make it searchable (optional but useful)

**Organization options:**
- Alphabetical by author
- Grouped by topic/chapter
- Chronological by publication year
- Searchable/filterable list

---

### **Phase 9: Update Navigation** (15 min)

**Add bibliography to sidebar:**
1. Find navigation configuration
2. Add "Bibliografia" link
3. Place it logically (at end? separate section?)
4. Add icon if using icons
5. Ensure it's accessible from all pages

---

### **Phase 10: Styling & Polish** (1 hour)

**Make citations look professional:**
1. Choose accent color for citation markers
2. Style hover tooltips (shadow, border, etc.)
3. Format bibliography section beautifully
4. Add smooth scroll animations
5. Ensure print-friendly (for PDF export)
6. Test accessibility (screen readers)

**Typography considerations:**
- Citation numbers: superscript or brackets?
- Font size for references
- Line spacing in bibliography
- Clear visual hierarchy

---

### **Phase 11: Testing & Refinement** (1 hour)

**Test everything:**
1. Add test citations in Sanity
2. Write sample article with multiple citations
3. Check hover tooltips work
4. Verify links to references work
5. Test on mobile devices
6. Check page load speed
7. Verify bibliography page loads correctly

**Test edge cases:**
- Very long author lists
- Missing citation data
- Multiple citations in one sentence
- Citations in headings or special text

---

### **Phase 12: Content Migration** (Time varies)

**Add real citations to existing content:**
1. Go through each article
2. Identify quotes and claims needing citations
3. Add citation data in Sanity
4. Link citations to text
5. Build bibliography for each article
6. Verify accuracy

**Tips:**
- Start with one article completely
- Create template for common citation types
- Keep consistent formatting
- Double-check accuracy

---

## Priority Order

**Must Have (Minimum Viable):**
1. Fix homepage (Phase 1)
2. Citation schema (Phase 3)
3. Basic inline citations (Phase 4-5)
4. Article bibliographies (Phase 7)

**Should Have:**
5. Citation tooltips (Phase 5)
6. Global bibliography page (Phase 8)

**Nice to Have:**
7. Search functionality
8. Citation export
9. Print optimization

---

## Estimated Total Time: 7-8 hours

- Setup & Planning: 1 hour
- Backend (Sanity): 2 hours
- Frontend (Components): 2.5 hours
- Testing & Polish: 1.5 hours
- Content Migration: Varies by book length

---

Would you like me to elaborate on any specific phase?