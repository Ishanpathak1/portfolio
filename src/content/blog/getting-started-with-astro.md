---
title: "Getting Started with Astro: The Modern Web Framework"
description: "Learn how to build fast, content-focused websites with Astro's unique approach to web development."
publishDate: 2025-05-21
tags: ["Astro", "Web Development", "JavaScript"]
image: "/images/blog/astro-intro.jpg"
---

# Getting Started with Astro

Astro is a modern web framework that offers a unique approach to building websites. Unlike traditional frameworks that are heavily JavaScript-focused, Astro is designed with content in mind, making it perfect for blogs, documentation sites, marketing sites, and portfolios.

## Why Choose Astro?

Astro stands out from other frameworks for several key reasons:

1. **Zero JavaScript by default**: Astro websites ship with zero JavaScript by default, resulting in extremely fast load times.

2. **Component Islands**: Use your favorite UI components from React, Vue, Svelte, or other frameworks, but only hydrate them when necessary.

3. **Content-focused**: Built-in support for Markdown, MDX, and content collections makes it perfect for content-rich sites.

4. **Full-featured**: Includes routing, asset handling, bundling, and more out of the box.

## Setting Up Your First Astro Project

Getting started with Astro is straightforward. Here's how to create your first project:

```bash
# Create a new project with npm
npm create astro@latest

# Or with yarn
yarn create astro

# Or with pnpm
pnpm create astro
```

The CLI will guide you through the setup process, offering templates and configuration options.

## Project Structure

A typical Astro project looks like this:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

- `src/pages/`: Contains your page components. Each `.astro` file here becomes a route in your site.
- `src/components/`: Reusable UI components for your site.
- `src/layouts/`: Layout components that wrap your pages for consistent structure.
- `public/`: Static assets that will be served at the root of your site.

## Creating Your First Component

Astro components use a `.astro` file extension and have a syntax similar to HTML with component script sections:

```astro
---
// Component Script (JavaScript)
const greeting = "Hello, Astro!";
---

<!-- Component Template (HTML + JS Expressions) -->
<div>
  <h1>{greeting}</h1>
  <p>Welcome to my Astro site!</p>
</div>

<style>
  /* Component Styles (Scoped by default) */
  h1 {
    color: purple;
    font-size: 2rem;
  }
</style>
```

## Using UI Framework Components

One of Astro's most powerful features is its ability to use components from popular UI frameworks like React, Vue, or Svelte. First, add the integration:

```bash
npx astro add react
```

Then use React components in your Astro files:

```astro
---
import { Counter } from '../components/Counter.jsx';
---

<div>
  <h1>Astro with React</h1>
  <Counter client:load />
</div>
```

The `client:` directive tells Astro when to hydrate the component on the client.

## Building and Deploying

When you're ready to deploy, build your site with:

```bash
npm run build
```

This generates a static site in the `dist/` directory that you can deploy to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Conclusion

Astro provides a refreshing approach to web development that prioritizes performance and developer experience. Its unique island architecture lets you use the best parts of JavaScript frameworks while keeping your site fast by default.

Whether you're building a blog, documentation site, or portfolio, Astro's content-focused design makes it an excellent choice for modern web development.

Happy coding with Astro! 🚀 