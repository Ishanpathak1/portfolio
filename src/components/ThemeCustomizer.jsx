import { useState, useEffect } from 'react';

// Default theme options
const FONT_OPTIONS = [
  { name: 'Inter', value: 'font-sans' },
  { name: 'Fira Code', value: 'font-mono' },
  { name: 'Georgia', value: 'font-serif' }
];

const COLOR_THEMES = [
  { 
    name: 'Blue (Default)', 
    primary: '#3b82f6',
    primaryDark: '#1d4ed8',
    background: {
      light: '#ffffff',
      dark: '#111827'
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6'
    }
  },
  { 
    name: 'Purple', 
    primary: '#8b5cf6',
    primaryDark: '#6d28d9',
    background: {
      light: '#ffffff',
      dark: '#0f172a'
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6'
    }
  },
  { 
    name: 'Green', 
    primary: '#10b981',
    primaryDark: '#059669',
    background: {
      light: '#ffffff',
      dark: '#111827'
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6'
    }
  },
  { 
    name: 'Pink', 
    primary: '#ec4899',
    primaryDark: '#db2777',
    background: {
      light: '#ffffff',
      dark: '#1a1a2e'
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6'
    }
  },
  { 
    name: 'Amber', 
    primary: '#f59e0b',
    primaryDark: '#d97706',
    background: {
      light: '#ffffff',
      dark: '#1c1917'
    },
    text: {
      light: '#1f2937',
      dark: '#f3f4f6'
    }
  }
];

const SPACINGS = [
  { name: 'Comfortable (Default)', value: '1' },
  { name: 'Compact', value: '0.85' },
  { name: 'Spacious', value: '1.15' }
];

// Creates a CSS variable string from a theme object
const createCssVariables = (theme, spacing) => {
  return `
    --color-primary: ${theme.primary};
    --color-primary-dark: ${theme.primaryDark};
    --color-background-light: ${theme.background.light};
    --color-background-dark: ${theme.background.dark};
    --color-text-light: ${theme.text.light};
    --color-text-dark: ${theme.text.dark};
    --spacing-factor: ${spacing};
  `;
};

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [selectedSpacing, setSelectedSpacing] = useState(SPACINGS[0].value);
  const [animations, setAnimations] = useState(true);
  
  // Apply theme changes when settings change
  useEffect(() => {
    // Apply CSS variables to document root
    document.documentElement.style.cssText = createCssVariables(selectedTheme, selectedSpacing);
    
    // Apply font class
    document.body.className = document.body.className
      .replace(/font-(sans|serif|mono)/g, '')
      .trim();
    document.body.classList.add(selectedFont);
    
    // Apply animations setting
    if (animations) {
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.classList.add('no-animations');
    }
    
    // Save preferences to localStorage
    localStorage.setItem('portfolio-theme', JSON.stringify({
      font: selectedFont,
      theme: selectedTheme.name,
      spacing: selectedSpacing,
      animations
    }));
  }, [selectedFont, selectedTheme, selectedSpacing, animations]);
  
  // Load saved preferences on component mount
  useEffect(() => {
    try {
      const savedPrefs = JSON.parse(localStorage.getItem('portfolio-theme'));
      if (savedPrefs) {
        // Apply saved font
        if (savedPrefs.font) {
          setSelectedFont(savedPrefs.font);
        }
        
        // Apply saved theme
        if (savedPrefs.theme) {
          const theme = COLOR_THEMES.find(t => t.name === savedPrefs.theme);
          if (theme) setSelectedTheme(theme);
        }
        
        // Apply saved spacing
        if (savedPrefs.spacing) {
          setSelectedSpacing(savedPrefs.spacing);
        }
        
        // Apply saved animation preference
        if (savedPrefs.hasOwnProperty('animations')) {
          setAnimations(savedPrefs.animations);
        }
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Theme Customizer Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
        aria-label="Customize Theme"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
          />
        </svg>
      </button>
      
      {/* Theme Customizer Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Customize Theme</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Color Theme */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-full h-8 rounded-full border-2 ${
                    selectedTheme.name === theme.name 
                      ? 'border-gray-900 dark:border-white' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  title={theme.name}
                  aria-label={`Select ${theme.name} theme`}
                />
              ))}
            </div>
          </div>
          
          {/* Font Family */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border-0"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Spacing */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Spacing</label>
            <select
              value={selectedSpacing}
              onChange={(e) => setSelectedSpacing(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border-0"
            >
              {SPACINGS.map((spacing) => (
                <option key={spacing.value} value={spacing.value}>
                  {spacing.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Animations */}
          <div className="flex items-center">
            <input
              id="animations"
              type="checkbox"
              checked={animations}
              onChange={(e) => setAnimations(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="animations" className="ml-2 block text-sm">
              Enable animations
            </label>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={() => {
              setSelectedFont(FONT_OPTIONS[0].value);
              setSelectedTheme(COLOR_THEMES[0]);
              setSelectedSpacing(SPACINGS[0].value);
              setAnimations(true);
            }}
            className="mt-4 w-full py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      )}
    </div>
  );
} 