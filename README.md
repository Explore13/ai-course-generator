# AI Course Generator

[![Hosted on Vercel](https://vercel.com/button)](https://seedofcode-ai-course-generator.vercel.app/)  
[Visit the Live App](https://seedofcode-ai-course-generator.vercel.app/)

## Overview

AI Course Generator is a web application built with **Next.js** to create and manage personalized coding courses. This project leverages the power of **Gemini** for generating course content and integrates **YouTube videos** using the YouTube Data API v3, tailoring course materials to users' preferences and learning needs.

---

## Features

- **AI-Generated Content**: Automatically generate coding course materials using Gemini.
- **Video Integration**: Seamless YouTube video integration via YouTube Data API v3 to enrich learning.
- **User Management**: Secure user authentication powered by [Clerk](https://clerk.dev).
- **Optimized Performance**: Built with modern web technologies like Next.js and Tailwind CSS for styling.
- **Responsive Design**: Fully responsive and mobile-friendly.

---

## Tech Stack

- **Frontend**: Next.js 15 with App Router and Tailwind CSS for modern styling.
- **Backend**: API routes with Gemini for AI-powered course content generation.
- **Video Integration**: YouTube Data API v3 for embedding relevant videos into courses.
- **Styling**: Tailwind CSS for responsive design.
- **Authentication**: Clerk integration for user management.
- **Deployment**: Vercel for seamless hosting and scaling.
- **Database**: PostgreSQL with Drizzle ORM.

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Explore13/ai-course-generator.git
   cd ai-course-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Add your **Gemini API key** and **YouTube Data API v3 key** in an `.env` file:

     ```bash
     GEMINI_API_KEY=your-gemini-api-key
     YOUTUBE_API_KEY=your-youtube-api-key
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## Deployment

This project is deployed using [Vercel](https://vercel.com).  
To deploy your version, push changes to your GitHub repository and link it with Vercel for automatic deployment.

---

## Contributing

Contributions are welcome! Feel free to:

- Fork the repository
- Create a branch for your feature or bugfix
- Submit a pull request for review

---

## Links

- **GitHub Repository**: [AI Course Generator](https://github.com/Explore13/ai-course-generator)  
- **Live Application**: [SeedOfCode AI Course Generator](https://seedofcode-ai-course-generator.vercel.app/)  

---

`Thank You :)`

---
