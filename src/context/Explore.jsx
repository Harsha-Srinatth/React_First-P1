import React from 'react';
import { useEffect, useState } from 'react';
import { Search, User, Loader2, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock navigate function since we can't import react-router-dom
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app with react-router-dom, this would be:
    // navigate(path);
  };

  // Mock API for demonstration purposes
  const api = {
    get: (url) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUsers = [
            {
              _id: '1',
              username: 'johndoe',
              firstname: 'John Doe',
              image: { imageUrl: '/api/placeholder/56/56' }
            },
            {
              _id: '2',
              username: 'janedoe',
              firstname: 'Jane Doe',
              image: { imageUrl: '/api/placeholder/56/56' }
            },
            {
              _id: '3',
              username: 'alexsmith',
              firstname: 'Alex Smith',
              image: { imageUrl: '/api/placeholder/56/56' }
            }
          ];
          resolve({ data: mockUsers });
        }, 500);
      });
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search?.trim()) {
        setIsLoading(true);
        api.get(`/explore/search?username=${search}`)
          .then(response => {
            setUsers(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error when finding users", error);
            setIsLoading(false);
          });
      } else {
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const goToProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center">
          Find Other Users
        </h1>
        
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
              placeholder="Search by username..."
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center mt-8">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
          )}

          {search && !isLoading && users.length > 0 && (
            <div className="mt-6">
              <h2 className="text-gray-300 text-sm font-medium mb-3">
                {users.length} {users.length === 1 ? 'result' : 'results'} found
              </h2>
              <ul className="space-y-3">
                {users.map(user => (
                  <li 
                    key={user._id} 
                    onClick={() => goToProfile(user._id)}
                    className="bg-gray-800 rounded-lg p-3 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-yellow-500"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user.image.imageUrl} 
                        className="rounded-full object-cover bg-gray-700" 
                        alt={user.username} 
                        width={56} 
                        height={56} 
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{user.username}</h3>
                      <p className="text-gray-400 text-sm">{user.firstname}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {search && !isLoading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="text-gray-500 w-16 h-16 mb-4" />
              <h3 className="text-xl text-white font-medium">No users found</h3>
              <p className="text-gray-400 mt-2 text-center">
                We couldn't find any users matching "{search}"
              </p>
            </div>
          )}

          {!search && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-gray-800 rounded-full p-6 mb-6">
                <Search className="text-yellow-500 w-12 h-12" />
              </div>
              <h2 className="text-2xl text-white font-bold mb-2">
                Find Your Network
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                Enter a username above to discover and connect with other users on the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;