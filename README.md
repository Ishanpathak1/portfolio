# Ishan Pathak Portfolio

A professional, minimal, and fast portfolio website built with Astro, React, and Tailwind CSS.

## Features

- 🚀 **Fast Performance**: Built with Astro for optimal loading speed
- 🎨 **Responsive Design**: Looks great on all devices using Tailwind CSS
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📝 **Blog with Markdown**: Write blog posts using Markdown or MDX
- 🧩 **Component-Based**: Modular architecture for easy maintenance
- 📱 **Mobile-First**: Designed with mobile users in mind
- 🔄 **Easy Deployment**: Ready for Netlify or Vercel

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:4321`

## Project Structure

```
/
├── public/             # Static assets
│   └── images/         # Image files
├── src/
│   ├── assets/         # Project assets
│   ├── components/     # UI components
│   ├── content/        # Content collections (blog posts)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   └── styles/         # Global styles
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── package.json        # Project dependencies
```

## Customization

### Personal Information

Update your personal information in the following files:

- `src/pages/index.astro`: Main content and intro
- `src/components/Footer.astro`: Social links and contact info
- `src/layouts/Layout.astro`: Site metadata

### Projects

Add or modify projects in `src/pages/index.astro` and `src/pages/projects.astro`.

### Blog Posts

Create new blog posts by adding Markdown files to `src/content/blog/`.

### Styling

Customize the design by modifying:

- `tailwind.config.mjs`: Colors, fonts, and theme settings
- `src/styles/global.css`: Global styles and custom CSS

## Deployment

### Netlify

The easiest way to deploy is with Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Use the following settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

Alternatively, deploy with Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Use the default settings (Vercel will auto-detect Astro)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Dark mode toggle with [React](https://reactjs.org)

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
