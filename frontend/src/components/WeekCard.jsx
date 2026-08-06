import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import TaskCard from './TaskCard';

const WeekCard = ({ week, onDelete, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = week.tasks.filter(t => t.status === 'Completed').length;
  const openCount = week.tasks.length - completedCount;
  const progress = week.tasks.length === 0 ? 0 : (completedCount / week.tasks.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-2">
      {/* Week Header / Summary */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{week.label}</h2>
          <div className="text-gray-400 p-1 bg-gray-50 rounded-full">
            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </div>
        </div>
        
        <div className="flex justify-between text-sm font-medium mb-3">
          <div className="flex flex-col">
            <span className="text-gray-500">Open Tasks</span>
            <span className="text-xl font-bold text-gray-800">{openCount}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-500">Completed</span>
            <span className="text-xl font-bold text-indigo-600">{completedCount}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <motion.div 
            className="bg-indigo-600 h-2 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>

      {/* Expanded Tasks List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 bg-gray-50/50 border-t border-gray-50">
              {week.tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No tasks for this week.</p>
              ) : (
                <div className="space-y-3">
                  {week.tasks.map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeekCard;
