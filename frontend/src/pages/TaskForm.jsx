import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { FiX, FiClock, FiCalendar } from 'react-icons/fi';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    priority: 'Medium',
    status: 'Open'
  });
  
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const response = await api.get('/tasks');
          const task = response.data.find(t => t._id === id);
          if (task) {
            const taskDate = parseISO(task.date);
            setFormData({
              title: task.title,
              description: task.description || '',
              date: format(taskDate, 'yyyy-MM-dd'),
              startTime: format(taskDate, 'HH:mm'),
              endTime: '', // Simplification for assignment
              priority: task.priority,
              status: task.status,
            });
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine date and time
    const dateTime = new Date(`${formData.date || format(new Date(), 'yyyy-MM-dd')}T${formData.startTime || '00:00'}`);
    
    const payload = {
      title: formData.title,
      description: formData.description,
      date: dateTime.toISOString(),
      priority: formData.priority,
      status: formData.status
    };

    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      navigate('/home');
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  if (loading) return null;

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => navigate('/home')}></div>
      
      <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={() => navigate('/home')} className="p-1 text-gray-500 hover:text-gray-900">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Task title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder-gray-400"
              placeholder="Doing Homework"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Set Time</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiClock className="text-gray-400" size={14} />
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900"
                  placeholder="Start"
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiClock className="text-gray-400" size={14} />
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900"
                  placeholder="Ends"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Set Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900 resize-none"
              placeholder="Add Description"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-transform active:scale-[0.98] shadow-md"
          >
            {isEdit ? 'Save Changes' : 'Create task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
