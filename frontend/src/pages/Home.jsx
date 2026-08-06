import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import api from '../api';
import { FiSearch, FiCheckSquare, FiXSquare, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/home') {
      fetchTasks();
    }
  }, [location.pathname]);

  const handleTaskDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  // Generate current week calendar
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
  const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col p-6">
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for a task"
          onClick={() => navigate('/search')}
          className="w-full pl-5 pr-12 py-3 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none text-sm text-gray-700"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" size={18} />
        </div>
      </div>

      {/* Calendar Row */}
      <div className="flex justify-between items-center mb-8">
        {calendarDays.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <div 
              key={i} 
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center rounded-lg p-2 w-11 cursor-pointer transition-colors ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              <span className={`text-[10px] font-medium mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {format(date, 'dd')}
              </span>
              {isSelected && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#EEF2FF] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between h-28">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1 rounded-md text-blue-600">
              <FiCheckSquare size={16} />
            </div>
            <span className="text-xs font-semibold text-gray-800">Task Complete</span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-gray-900">{completedCount}</span>
            <span className="text-[10px] text-gray-500 font-medium">This Week</span>
          </div>
        </div>

        <div className="bg-[#FFE4E6] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between h-28">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-1 rounded-md text-red-500">
              <FiXSquare size={16} />
            </div>
            <span className="text-xs font-semibold text-gray-800">Task Pending</span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-gray-900">{pendingCount.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-gray-500 font-medium">This Week</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Weekly Progress</h3>
        <div className="w-full bg-[#E0E7FF] h-4 relative">
          <motion.div 
            className="bg-[#2E41A1] h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          ></motion.div>
          {/* Border overlay to match the Figma hollow look if needed, but solid looks better */}
          <div className="absolute inset-0 border-2 border-blue-600 pointer-events-none"></div>
        </div>
      </div>

      {/* Tasks Today */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-900">Tasks Today</h3>
          <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>
        </div>

        <div className="space-y-0">
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <div 
                key={task._id} 
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 group cursor-pointer"
                onClick={() => navigate(`/home/task/${task._id}`)}
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
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/home/edit/${task._id}`); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleTaskDelete(task._id); }} 
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
          
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-8">No tasks today. Enjoy your day!</p>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
