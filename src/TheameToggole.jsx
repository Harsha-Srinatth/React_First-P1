// import React, { useContext } from 'react';
// import { ThemeContext } from './components/TheameContext';
// import { Sun, Moon } from 'lucide-react';

// const ThemeToggle = () => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <button
//       onClick={toggleTheme}
//       className={`p-2 rounded-full ${
//         theme === 'dark' 
//           ? 'bg-gray-700 hover:bg-gray-600' 
//           : 'bg-gray-200 hover:bg-gray-300'
//       } transition-colors duration-200`}
//       aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//     >
//       {theme === 'light' ? (
//         <Moon size={20} className="text-gray-800" />
//       ) : (
//         <Sun size={20} className="text-yellow-300" />
//       )}
//     </button>
//   );
// };

// export default ThemeToggle;