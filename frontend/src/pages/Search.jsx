import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import api from '../api';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true);
        try {
          const res = await api.get(`/tasks?search=${query}`);
          setResults(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      setResults(results.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/home')}
          className="text-gray-900 p-1 -ml-1 mr-4 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={22} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Finish"
          autoFocus
          className="w-full pl-5 pr-12 py-3 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none text-sm text-gray-700"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" size={18} />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4F46E5]"></div>
        </div>
      )}

      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-0">
        {!loading && query && results.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">No tasks found matching "{query}"</p>
        )}
        
        {results.map(task => {
          const isCompleted = task.status === 'Completed';
          return (
            <div 
              key={task._id} 
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 group cursor-pointer"
              onClick={() => navigate(`/search/task/${task._id}`)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div 
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isCompleted ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(task);
                  }}
                >
                  {isCompleted && <span className="text-blue-600 text-sm font-bold">✓</span>}
                </div>
                <span className={`text-sm font-medium flex-1 ${isCompleted ? 'text-gray-900 line-through decoration-gray-300' : 'text-gray-900'}`}>
                  {task.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      <Outlet />
    </div>
  );
};

export default Search;
