import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api'
import Cookies from 'js-cookie';

const ShowFollowers = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const currentUserId = Cookies.get('userid')?.replace(/^"|"$/g, '');
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [removeLoading, setRemoveLoading] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            setLoading(true);
            try {
                const token = Cookies.get('token');
                const res = await api.get(`/followers-list/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data) {
                    setFollowers(Array.isArray(res.data) ? res.data : 
                               Array.isArray(res.data.followers) ? res.data.followers : []);
                }
            } catch (error) {
                console.error('Error fetching followers:', error);
                setFollowers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, navigate]);

    const handleRemoveFollower = async (followerToRemove) => {
        try {
            setRemoveLoading(prev => ({ ...prev, [followerToRemove.userId]: true }));
            const token = Cookies.get('token');
            
            if (!token) {
                console.error('No token found');
                return;
            }

            const res = await api.post(`/remove-follower/${followerToRemove.userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                setFollowers(prev => prev.filter(user => user.userId !== followerToRemove.userId));
            }
        } catch (error) {
            console.error('Error removing follower:', error);
        } finally {
            setRemoveLoading(prev => ({ ...prev, [followerToRemove.userId]: false }));
        }
    };

    const filteredFollowers = followers.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full p-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className='text-white w-full min-h-screen bg-zinc-950 p-4'>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <button 
                        onClick={() => navigate(-1)}
                        className='p-2 hover:bg-gray-800 rounded-full transition-colors'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className='text-2xl md:text-3xl font-bold'>Followers</h1>
                </div>
                <span className='text-gray-400 text-sm'>{filteredFollowers.length} followers</span>
            </div>

            <div className='mb-6'>
                <div className='relative'>
                    <input 
                        type='text' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Search followers...' 
                        className='w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors'
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className='space-y-2'>
                {filteredFollowers.length > 0 ? (
                    filteredFollowers.map(user => (
                        <div 
                            key={user.userId} 
                            className='block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700'
                        >
                            <div className='flex items-center gap-4'>
                                <Link to={`/profile/${user.userId}`} className='flex items-center gap-4 flex-1'>
                                    {user.image ? (
                                        <img 
                                            src={user.image} 
                                            className='w-12 h-12 rounded-full object-cover border-2 border-gray-600' 
                                            alt={user.fullname || 'profile'} 
                                        />
                                    ) : (
                                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600'>
                                            {user.fullname?.[0] || '?'}
                                        </div>
                                    )}
                                    <div className='flex-1'>
                                        <h2 className='text-lg font-semibold text-white'>{user.username}</h2>
                                        <p className='text-sm text-gray-400'>{user.fullname}</p>
                                    </div>
                                </Link>
                                {currentUserId === userId && (
                                    <button
                                        onClick={() => handleRemoveFollower(user)}
                                        disabled={removeLoading[user.userId]}
                                        className='p-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-1'
                                        title="Remove follower"
                                    >
                                        {removeLoading[user.userId] ? (
                                            <div className="h-3 w-3 border border-t-transparent border-white rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : searchTerm ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 text-lg mb-2'>No followers found</div>
                        <p className='text-gray-500 text-sm'>Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 text-lg mb-2'>No followers yet</div>
                        <p className='text-gray-500 text-sm'>When people follow this user, they'll appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowFollowers;