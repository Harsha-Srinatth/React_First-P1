import React from 'react';
import { FaReact, FaNodeJs, FaJs, FaCss3Alt } from 'react-icons/fa';
import { SiTailwindcss } from 'react-icons/si';

const projects = [
  {
    name: 'React Social App',
    tech: [<FaReact className="text-blue-400" />, <SiTailwindcss className="text-cyan-400" />],
    description: 'A fast, responsive social media app built with React and Tailwind CSS. Features include authentication, post creation, profile management, and dynamic image aspect ratios.',
    features: [
      'Authentication (Register/Login)',
      'Responsive Dashboard with Sidebar, Header, and Bottombar',
      'Create, view, and like posts',
      'Profile image upload and editing',
      'Dynamic image aspect ratios (4:5, 3:4, 1.91:1, 1:1)',
      'Smooth transitions and hover effects',
      'Mobile-first design',
    ],
  },
  {
    name: 'Node.js Backend API',
    tech: [<FaNodeJs className="text-green-500" />, <FaJs className="text-yellow-400" />],
    description: 'A RESTful API built with Node.js and Express, handling authentication, user management, and post CRUD operations.',
    features: [
      'JWT-based authentication',
      'RESTful endpoints for users and posts',
      'Secure password handling',
      'CORS and cookie management',
    ],
  },
  {
    name: 'UI/UX & Styling',
    tech: [<SiTailwindcss className="text-cyan-400" />, <FaCss3Alt className="text-blue-600" />],
    description: 'Modern, attractive UI using Tailwind CSS and custom CSS for smooth transitions, gradients, and responsive layouts.',
    features: [
      'Gradient backgrounds',
      'Card-based layouts',
      'Animated buttons and hover effects',
      'Consistent color palette',
      'Accessibility and mobile responsiveness',
    ],
  },
];

const About = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-950 flex flex-col items-center justify-start py-8 px-4 lg:px-8 overflow-y-auto pt-20 pb-24 md:pb-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6 drop-shadow-lg transition-all duration-500 text-center">
          About This Project
        </h1>
        <p className="max-w-3xl text-lg md:text-lg lg:text-xl text-gray-200 text-center mb-12 transition-all duration-500 leading-relaxed">
          This project is a showcase of beginner-friendly web development skills, featuring a full-stack social media app built with React, Node.js, JavaScript, Tailwind CSS, and custom CSS. Explore the features, technologies, and design principles that make this app fast, beautiful, and responsive on all devices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mb-12">
          {projects.map((project, idx) => (
            <div
              key={project.name}
              className="bg-zinc-900/80 rounded-3xl shadow-xl border border-zinc-800 p-6 lg:p-8 flex flex-col items-center group hover:scale-105 hover:shadow-blue-500/30 transition-all duration-500 cursor-pointer h-full"
            >
              <div className="flex space-x-3 mb-4 text-4xl">
                {project.tech.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-blue-300 mb-3 group-hover:text-cyan-400 transition-colors duration-300 text-center">
                {project.name}
              </h2>
              <p className="text-gray-300 text-center mb-6 text-sm lg:text-base leading-relaxed">
                {project.description}
              </p>
              <ul className="text-left text-gray-400 space-y-2 w-full">
                {project.features.map((feature, i) => (
                  <li
                    key={i}
                    className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-400 before:font-bold before:text-lg hover:text-blue-300 transition-colors duration-200 text-sm lg:text-base"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="w-full max-w-4xl text-center mb-8">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-purple-300 mb-4 animate-pulse">
            Why This Project?
          </h3>
          <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
            This project was built to learn and demonstrate the fundamentals of modern web development, including component-based architecture, RESTful APIs, responsive design, and user experience best practices. Every feature and style was chosen to ensure a smooth, fast, and delightful experience for users on any device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
