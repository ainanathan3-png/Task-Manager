# Task Manager

A modern, minimal, front-end-only task management application with a clean UI and smooth interactions. All data is stored locally in the browser using LocalStorage, ensuring tasks persist between page refreshes.

## Features

✨ **Core Functionality**
- ✅ Add new tasks instantly
- ✏️ Edit existing tasks with a modal interface
- 🗑️ Delete tasks with smooth animations
- ☑️ Mark tasks as complete/incomplete
- 🔍 Search tasks by title in real-time
- 🎯 Filter tasks (All, Active, Completed)
- 📊 Display total tasks and completed count
- 🧹 Clear all completed tasks at once

🎨 **Design & UX**
- Minimalist aesthetic with generous spacing
- Modern glassmorphism UI elements
- Soft gradient color palette (purples and blues)
- Smooth animations for all interactions
- Responsive design (desktop, tablet, mobile)
- Light mode with high contrast text
- Professional typography with system fonts

⚡ **Technical**
- Pure vanilla JavaScript (no dependencies)
- LocalStorage for persistent data
- Semantic HTML with ARIA labels
- CSS animations and transitions
- Mobile-first responsive design
- XSS protection with HTML escaping

## Getting Started

### Installation

No installation or build process required! This is a static site.

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start managing your tasks!

### File Structure

```
Task Manager/
├── index.html    # Semantic HTML structure
├── styles.css    # Modern styling with animations
├── script.js     # Task management logic
└── README.md     # This file
```

## Usage

### Adding Tasks
1. Type your task description in the input field
2. Press Enter or click the + button
3. Task appears at the top of the list with a timestamp

### Editing Tasks
1. Click the ✏️ edit button on any task
2. Modify the text in the modal
3. Click Save or press Enter
4. Changes are instantly saved

### Completing Tasks
- Click the checkbox next to a task to mark it complete/incomplete
- Completed tasks appear with strikethrough text and reduced opacity

### Searching Tasks
- Type in the search field to filter tasks by title
- Search works across all filter states
- Press clear search to show all matching tasks

### Filtering Tasks
- **All**: View all tasks
- **Active**: Show only incomplete tasks
- **Completed**: Show only completed tasks

### Managing Tasks
- Click 🗑️ to delete a task (with animation)
- Click "Clear completed" to delete all completed tasks at once
- Stats at the top show total and completed task counts

## Data Storage

All tasks are automatically saved to your browser's LocalStorage. This means:
- ✅ Tasks persist when you close and reopen the browser
- ✅ Data stays on your computer (no cloud sync)
- ✅ Clearing browser cache will delete tasks
- ✅ Works offline completely

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Shortcuts

- **Enter** in task input: Add task
- **Enter** in edit modal: Save changes
- **Escape** in edit modal: Cancel editing

## Design Details

### Color Palette
- Primary Gradient: `#667eea` to `#764ba2` (purple-blue)
- Background: Soft gradient light grays
- Text: Dark slate (`#2d3748`)
- Accents: Soft blues and grays

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- Headings: 600 weight, tight letter spacing
- Body: Regular weight, 0.95rem base size

### Spacing & Sizing
- Container max-width: 700px
- Padding: 1.5rem desktop, 1rem tablet, 0.75rem mobile
- Border radius: 1.25-1.5rem for cards, 0.875rem for inputs
- Gap between items: 0.75rem

### Animations
- Task appear: `slideIn` 0.3s
- Task delete: `slideOut` 0.3s
- Section load: `slideUp`/`slideDown` with staggered timing
- Hover effects: `translateY` and shadow changes
- Smooth transitions: 0.3s ease default

## Performance

- ⚡ Instant interactions (no server calls)
- 📱 Lightweight (single HTML, CSS, JS files)
- 🎯 Minimal DOM operations
- 🔒 No external dependencies
- 📦 ~50KB total size (uncompressed)

## Accessibility

- Semantic HTML structure
- ARIA labels for all interactive elements
- Keyboard navigation support
- High contrast text (WCAG AA compliant)
- Focus states on all interactive elements

## Future Enhancements (Optional)

Possible additions without changing core architecture:
- Task categories/tags
- Due dates and reminders
- Task priorities
- Recurring tasks
- Export/Import functionality
- Dark mode toggle
- Advanced search filters
- Analytics dashboard

## License

This project is free to use and modify for personal or commercial purposes.

## Notes

- LocalStorage typically has a 5-10MB limit per domain
- This app uses minimal storage (~0.5KB per task average)
- No analytics or tracking of any kind
- No third-party scripts or services
- 100% privacy - your data never leaves your device
