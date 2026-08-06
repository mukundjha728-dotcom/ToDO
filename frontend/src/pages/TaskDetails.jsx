import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { FiX, FiClock, FiCalendar, FiEdit2, FiCheckCircle, FiCircle } from 'react-icons/fi';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get('/tasks');
        const found = response.data.find(t => t._id === id);
        if (found) {
          setTask(found);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading || !task) return null;

  const isCompleted = task.status === 'Completed';

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => navigate(-1)}></div>
      
      <div className="bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{task.title}</h2>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCompleted ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {isCompleted ? <FiCheckCircle size={12} /> : <FiCircle size={12} />}
              {task.status || 'In Progress'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/home/edit/${task._id}`)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              <FiEdit2 size={16} />
            </button>
            <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              <FiX size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiCalendar className="text-blue-500" size={16} />
              <span className="font-medium">{format(parseISO(task.date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="text-blue-500" size={16} />
              <span className="font-medium">{format(parseISO(task.date), 'hh:mm a')}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {task.description || <span className="text-gray-400 italic">No description provided.</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => updateStatus('In Progress')}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors ${
              !isCompleted 
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-200' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => updateStatus('Completed')}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors ${
              isCompleted 
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
