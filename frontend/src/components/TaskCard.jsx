import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiEdit2, FiTrash2, FiCheck, FiClock, FiCalendar } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isSwiping, setIsSwiping] = useState(false);

  const priorityColors = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-green-100 text-green-700',
  };

  const isCompleted = task.status === 'Completed';

  const handleDragEnd = (event, info) => {
    // If dragged left significantly, trigger delete
    if (info.offset.x < -80) {
      controls.start({ x: '-100%', opacity: 0, transition: { duration: 0.2 } }).then(() => {
        onDelete(task._id);
      });
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const toggleStatus = () => {
    if (isSwiping) return;
    const newStatus = isCompleted ? 'In Progress' : 'Completed';
    onStatusChange(task._id, newStatus);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (isSwiping) return;
    navigate(`/edit/${task._id}`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3 shadow-sm border border-gray-100 bg-red-50">
      {/* Background Delete Action (revealed on swipe) */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-red-500 flex items-center justify-end px-6 text-white rounded-r-2xl">
        <FiTrash2 size={24} />
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={(e, info) => {
          setTimeout(() => setIsSwiping(false), 100);
          handleDragEnd(e, info);
        }}
        animate={controls}
        className="relative bg-white p-4 rounded-2xl h-full flex flex-col justify-between"
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button 
            onClick={toggleStatus}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompleted 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {isCompleted && <FiCheck size={14} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 line-clamp-2 ${isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1">
                <FiCalendar className="text-indigo-400" />
                <span>{format(parseISO(task.date), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="text-indigo-400" />
                <span>{format(parseISO(task.date), 'h:mm a')}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full ${priorityColors[task.priority] || priorityColors.Medium}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
