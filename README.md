# Student Project Planner

A React application for managing student projects, featuring task boards, project notes, deadline tracking, and team progress monitoring.

## Features

- Task management with drag-and-drop functionality
- Project notes with Markdown support
- Deadline countdown and visualization
- Team progress tracking
- Project status overview

## Technologies Used

- React
- Tailwind CSS
- Vite
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/student-project-planner.git
   cd student-project-planner
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Tailwind CSS Fixes

The following fixes were made to resolve Tailwind CSS issues:

1. **Configuration Files**: Renamed configuration files to use the `.cjs` extension for compatibility with ES modules.
   - `postcss.config.js` → `postcss.config.cjs`
   - `tailwind.config.js` → `tailwind.config.cjs`

2. **PostCSS Configuration**: Updated the PostCSS configuration to properly require Tailwind CSS and Autoprefixer.

3. **Vite Configuration**: Updated the Vite configuration to correctly use the PostCSS configuration.

4. **Component Structure**: Simplified component structure to ensure proper Tailwind CSS class usage.

5. **CSS Imports**: Ensured proper CSS import order in the main entry point.

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `data/`: Mock data for the application
  - `FinalApp.jsx`: Main application component
  - `index.css`: Global styles and Tailwind CSS imports

## License

MIT
