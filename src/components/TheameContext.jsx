// import React, { createContext, useState, useEffect } from 'react';

// // Create Theme Context
// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // Check if user has a saved preference in localStorage
//   // or use system preference as fallback
//   const getInitialTheme = () => {
//     if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
//       const savedTheme = localStorage.getItem('theme');
//       if (savedTheme) {
//         return savedTheme;
//       }
      
//       // Check system preference
//       if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         return 'dark';
//       }
//     }
    
//     return 'dark'; // Default to dark theme since your current UI is dark
//   };

//   const [theme, setTheme] = useState(getInitialTheme);

//   // Toggle theme function
//   const toggleTheme = () => {
//     setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
//   };

//   // Save theme preference to localStorage whenever it changes
//   useEffect(() => {
//     if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
//       localStorage.setItem('theme', theme);
      
//       // Apply theme to document for global CSS variables if needed
//       document.documentElement.setAttribute('data-theme', theme);
      
//       // Apply background color to body
//       if (theme === 'dark') {
//         document.body.classList.add('bg-black');
//         document.body.classList.remove('bg-gray-100');
//       } else {
//         document.body.classList.add('bg-gray-100');
//         document.body.classList.remove('bg-black');
//       }
//     }
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;