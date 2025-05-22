import { useState, useEffect, useRef } from 'react';

// Export commands for reuse in other components
export const COMMANDS = {
  help: {
    description: 'List all available commands',
    usage: 'help',
    fn: (args, setOutput) => {
      const commandList = Object.entries(COMMANDS).map(([cmd, details]) => {
        return `${cmd.padEnd(15)} - ${details.description}`;
      });
      
      return [
        'Available commands:',
        ...commandList,
        '',
        'Type a command and press Enter to execute.',
        'Use the up and down arrow keys to navigate command history.'
      ];
    }
  },
  about: {
    description: 'Display information about Ishan Pathak',
    usage: 'about',
    fn: () => [
      'Ishan Pathak',
      '-----------------',
      'Full-stack developer and Computer Science graduate student',
      'University at Albany',
      '',
      'Specializing in React, JavaScript, and modern web technologies',
      'with a focus on creating intuitive and performant user experiences.',
      '',
      'Type "skills" to see my technical skills.',
      'Type "contact" to see contact information.'
    ]
  },
  skills: {
    description: 'List technical skills',
    usage: 'skills',
    fn: () => [
      'Technical Skills',
      '-----------------',
      'Frontend: React, JavaScript, TypeScript, HTML5/CSS, Tailwind CSS',
      'Backend: Node.js, FastAPI, Python',
      'Cloud: AWS, Google Cloud',
      'DevOps: Docker',
      'Design: UI/UX (Figma)',
      '',
      'Type "projects" to see my work.'
    ]
  },
  projects: {
    description: 'List portfolio projects',
    usage: 'projects',
    fn: () => [
      'Projects',
      '-----------------',
      '1. UnifiedData - AI-powered CSV editor with auto dashboards',
      '2. Revode - AI memory retention tool for DSA questions',
      '3. BloomBot - AI companion for mental wellness',
      '4. AI Resume Editor - Create professional resumes with AI',
      '5. Varnatva - Blockchain based comment system',
      '',
      'Type "view <project_number>" for details on a specific project.',
      'Example: view 1'
    ]
  },
  view: {
    description: 'View details of a specific project',
    usage: 'view <project_number>',
    fn: (args) => {
      const projects = [
        {
          name: 'UnifiedData',
          description: 'AI-powered CSV editor with auto dashboards and reports for data visualization.',
          tech: 'React, Python, FastAPI, Docker',
          github: 'https://github.com/Ishanpathak1/UnifiedData',
          live: 'https://www.unifieddata.app/'
        },
        {
          name: 'Revode',
          description: 'AI memory retention tool for DSA questions to help developers practice efficiently.',
          tech: 'React, JavaScript, OpenAI API',
          github: 'https://github.com/Ishanpathak1/Revode',
          live: 'https://revode.vercel.app'
        },
        {
          name: 'BloomBot',
          description: 'Your AI companion for mental wellness and personal growth with 24/7 support.',
          tech: 'React, AI, Next.js, Tailwind CSS',
          github: 'https://github.com/Ishanpathak1/BloomBot',
          live: 'https://bloom-bot-psi.vercel.app/'
        },
        {
          name: 'AI Resume Editor',
          description: 'Create professional resumes with AI assistance to stand out in your job search.',
          tech: 'React, AI, TypeScript, Tailwind CSS',
          github: 'https://github.com/Ishanpathak1/ai-resume-editor',
          live: 'https://ai-resume-editor.vercel.app'
        },
        {
          name: 'Varnatva',
          description: 'Blockchain based comment system, with extension.',
          tech: 'Solidity, React, Javascript, HTML, CSS',
          github: 'https://github.com/Ishanpathak1',
          live: 'https://blockchain-comment.vercel.app/'
        }
      ];
      
      const projectNum = parseInt(args[0]) - 1;
      if (isNaN(projectNum) || projectNum < 0 || projectNum >= projects.length) {
        return [
          `Error: Invalid project number. Please enter a number between 1 and ${projects.length}.`,
          'Type "projects" to see the list of projects.'
        ];
      }
      
      const project = projects[projectNum];
      return [
        `Project: ${project.name}`,
        '-----------------',
        `Description: ${project.description}`,
        `Technologies: ${project.tech}`,
        `GitHub: ${project.github}`,
        `Live Demo: ${project.live}`,
        '',
        'Type "open <project_number>" to open the live demo in a new tab.'
      ];
    }
  },
  open: {
    description: 'Open a project in a new tab',
    usage: 'open <project_number>',
    fn: (args) => {
      const projects = [
        { live: 'https://www.unifieddata.app/' },
        { live: 'https://revode.vercel.app' },
        { live: 'https://bloom-bot-psi.vercel.app/' },
        { live: 'https://ai-resume-editor.vercel.app' },
        { live: 'https://blockchain-comment.vercel.app/' }
      ];
      
      const projectNum = parseInt(args[0]) - 1;
      if (isNaN(projectNum) || projectNum < 0 || projectNum >= projects.length) {
        return [
          `Error: Invalid project number. Please enter a number between 1 and ${projects.length}.`,
          'Type "projects" to see the list of projects.'
        ];
      }
      
      window.open(projects[projectNum].live, '_blank');
      return [`Opening ${projects[projectNum].live} in a new tab...`];
    }
  },
  contact: {
    description: 'Display contact information',
    usage: 'contact',
    fn: () => [
      'Contact Information',
      '-----------------',
      'Email: ishan.pathak2711@gmail.com',
      'GitHub: https://github.com/Ishanpathak1',
      'LinkedIn: https://linkedin.com/in/yourusername',
      '',
      'Type "email" to send me an email.'
    ]
  },
  email: {
    description: 'Open email client to contact me',
    usage: 'email',
    fn: () => {
      window.location.href = 'mailto:ishan.pathak2711@gmail.com';
      return ['Opening email client...'];
    }
  },
  theme: {
    description: 'Toggle between dark and light mode or set a specific theme',
    usage: 'theme [dark|light]',
    fn: (args) => {
      const mode = args[0]?.toLowerCase();
      const root = document.documentElement;
      const isDark = root.classList.contains('dark');
      
      // Set specific theme if provided
      if (mode === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        return ['Theme set to dark mode.'];
      } else if (mode === 'light') {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        return ['Theme set to light mode.'];
      }
      
      // Toggle theme if no argument provided
      if (isDark) {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        return ['Switched to light mode.'];
      } else {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        return ['Switched to dark mode.'];
      }
    }
  },
  resume: {
    description: 'Download my resume as a PDF',
    usage: 'resume',
    fn: () => {
      const resumeUrl = '/downloads/Ishan_Resume.pdf';
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.setAttribute('download', 'Ishan_Resume.pdf');
      link.setAttribute('target', '_blank');
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return ['Downloading resume...'];
    }
  },
  goto: {
    description: 'Navigate to a section of the portfolio',
    usage: 'goto <section>',
    fn: (args) => {
      const sections = {
        home: '/',
        projects: '/projects',
        blog: '/blog',
        about: '#about',
        skills: '#skills',
        contact: '#contact'
      };
      
      const section = args[0]?.toLowerCase();
      if (!section || !sections[section]) {
        return [
          'Error: Invalid section. Available sections:',
          'home, about, projects, skills, contact, blog',
          '',
          'Example: goto projects'
        ];
      }
      
      if (sections[section].startsWith('#')) {
        // Scroll to section if it's an anchor
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return [`Scrolling to ${section}...`];
        }
      } else {
        // Navigate to a different page
        window.location.href = sections[section];
      }
      
      return [`Navigating to ${section}...`];
    }
  },
  clear: {
    description: 'Clear the terminal screen',
    usage: 'clear',
    fn: (args, setOutput) => {
      setOutput([]);
      return [];
    }
  }
};

// Helper function to execute commands (can be used by other components)
export const executeCommand = (command, args, setOutput) => {
  if (COMMANDS[command]) {
    const result = COMMANDS[command].fn(args, setOutput);
    return result || [];
  }
  return [
    `Command not found: ${command}`,
    'Type "help" to see available commands.',
    ''
  ];
};

export default function Terminal({ initialOutput = [] }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(
    initialOutput.length > 0 
      ? initialOutput 
      : [
          'Welcome to Ishan Pathak\'s Portfolio Terminal!',
          'Type "help" to see available commands.',
          ''
        ]
  );
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    inputRef.current?.focus();
    
    // Scroll to bottom whenever output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleKeyDown = (e) => {
    // Handle arrow up/down for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add command to history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    // Display command in output
    setOutput(prev => [...prev, `> ${input}`]);
    
    // Parse command
    const args = input.trim().split(' ');
    const command = args.shift().toLowerCase();
    
    // Execute command
    const result = executeCommand(command, args, setOutput);
    if (result && result.length > 0) {
      setOutput(prev => [...prev, ...result, '']);
    }
    
    // Clear input
    setInput('');
  };

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-4 font-mono text-sm overflow-hidden flex flex-col">
      <div className="flex items-center mb-2 pb-2 border-b border-gray-300 dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400">
          ishan@portfolio ~ terminal
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto max-h-96 mb-2"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-primary mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none"
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
} 