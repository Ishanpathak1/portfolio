import { useState, useEffect, useRef } from 'react';
import Terminal, { executeCommand, COMMANDS } from './Terminal';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('palette'); // 'palette' or 'terminal'
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [inlineOutput, setInlineOutput] = useState(null); // For showing command results directly in the palette
  const inputRef = useRef(null);
  const paletteRef = useRef(null);
  const outputRef = useRef(null);

  // List of quick commands for the palette
  const commands = [
    { id: 'about', name: 'About Ishan Pathak', description: 'Learn more about me' },
    { id: 'projects', name: 'View Projects', description: 'Browse my portfolio work' },
    { id: 'skills', name: 'View Skills', description: 'See my technical expertise' },
    { id: 'contact', name: 'Contact Information', description: 'Get in touch with me' },
    { id: 'terminal', name: 'Open Terminal', description: 'Access the full command-line interface' },
    { id: 'theme', name: 'Toggle Dark Mode', description: 'Switch between light and dark themes' },
    { id: 'resume', name: 'Download Resume', description: 'Download my resume as a PDF' },
    { id: 'github', name: 'GitHub Profile', description: 'View my code repositories', url: 'https://github.com/Ishanpathak1' },
    { id: 'linkedin', name: 'LinkedIn Profile', description: 'Connect with me professionally', url: 'https://linkedin.com/in/yourusername' },
    { id: 'githubanalytics', name: 'GitHub Analytics', description: 'Explore advanced GitHub analytics for any user', path: '/github-analytics' },
    {
      id: 'job-search',
      name: 'Find Job Matches',
      description: 'Get personalized job recommendations based on GitHub skills',
      path: '/github-analytics?tab=jobs'
    },
    {
      id: 'job-skills',
      name: 'Analyze My Job Skills',
      description: 'Analyze your GitHub profile to identify key job skills',
      path: '/github-analytics?tab=jobs'
    },
    {
      id: 'github-analytics',
      name: 'GitHub Analytics',
      description: 'Explore advanced GitHub profile analytics and visualizations',
      path: '/github-analytics'
    },
  ];

  // Reset states when closing the palette
  const resetPalette = () => {
    setQuery('');
    setInlineOutput(null);
    setMode('palette');
  };

  // Filtered commands based on search query
  const filteredCommands = commands.filter(command => 
    command.name.toLowerCase().includes(query.toLowerCase()) || 
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open palette with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        
        if (!isOpen) {
          resetPalette();
        }
      }
      
      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
        resetPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus the input when opened
  useEffect(() => {
    if (isOpen && inputRef.current && mode === 'palette' && !inlineOutput) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 10);
    }
  }, [isOpen, mode, inlineOutput]);

  // Scroll to bottom of output when displaying inline
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [inlineOutput]);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setIsOpen(false);
        resetPalette();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle command selection
  const handleCommandSelect = (command) => {
    if (command.id === 'terminal') {
      setMode('terminal');
    } else if (command.id === 'theme') {
      // Toggle theme directly
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      setIsOpen(false);
      resetPalette();
    } else if (command.id === 'resume') {
      // Download resume
      const resumeUrl = '/downloads/Ishan_Resume.pdf';
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.setAttribute('download', 'Ishan_Resume.pdf');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsOpen(false);
      resetPalette();
    } else if (command.url) {
      window.open(command.url, '_blank');
      setIsOpen(false);
      resetPalette();
    } else if (command.path) {
      // Navigate to internal path
      window.location.href = command.path;
      setIsOpen(false);
      resetPalette();
    } else {
      // Check if command is a simple informational command
      const simpleCommands = ['about', 'skills', 'projects', 'contact'];
      
      if (simpleCommands.includes(command.id)) {
        // Execute command and show output inline
        const result = executeCommand(command.id, [], setTerminalOutput);
        if (result && result.length > 0) {
          setInlineOutput(result);
        }
      } else {
        // More complex commands go to terminal view
        executeCommand(command.id, [], setTerminalOutput);
        setMode('terminal');
      }
    }
  };

  // Handle direct command execution when typing in the palette
  const handleDirectCommand = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Clear inline output when submitting new command
      setInlineOutput(null);
      
      // Check if query exactly matches a command
      const matchedCommand = commands.find(cmd => 
        cmd.name.toLowerCase() === query.toLowerCase() || 
        cmd.id.toLowerCase() === query.toLowerCase()
      );
      
      if (matchedCommand) {
        handleCommandSelect(matchedCommand);
        return;
      }
      
      // Treat input as a terminal command if it doesn't match a predefined command
      const args = query.trim().split(' ');
      const command = args.shift().toLowerCase();
      
      // Check if it's a simple informational command
      const simpleCommands = ['about', 'skills', 'projects', 'contact'];
      
      if (simpleCommands.includes(command)) {
        // Execute command and show output inline
        const result = executeCommand(command, args, setTerminalOutput);
        if (result && result.length > 0) {
          setInlineOutput(result);
        }
      } else {
        // More complex commands go to terminal view
        const result = executeCommand(command, args, setTerminalOutput);
        if (result && result.length > 0) {
          // Switch to terminal mode to show the output
          setMode('terminal');
          setTerminalOutput([`> ${query}`, ...result, '']);
        } else {
          setIsOpen(false);
          resetPalette();
        }
      }
    }
  };

  // Handle back button in inline output
  const handleBackFromInline = () => {
    setInlineOutput(null);
    setQuery('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={paletteRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {mode === 'palette' ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleDirectCommand}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent outline-none"
                aria-label="Command palette input"
                disabled={inlineOutput !== null}
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">esc</kbd>
                <span>to close</span>
              </div>
            </div>
            
            {inlineOutput ? (
              <div className="relative">
                <div 
                  ref={outputRef}
                  className="max-h-96 overflow-y-auto p-4 font-mono text-sm"
                >
                  {inlineOutput.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap mb-1">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button 
                    onClick={handleBackFromInline}
                    className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  <ul>
                    {filteredCommands.map((command) => (
                      <li key={command.id}>
                        <button
                          onClick={() => handleCommandSelect(command)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{command.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{command.description}</div>
                          </div>
                          {command.url && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No commands match your search
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="p-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-medium">Terminal</h3>
              <button 
                onClick={() => setMode('palette')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <Terminal initialOutput={terminalOutput} />
          </div>
        )}
      </div>
    </div>
  );
} 