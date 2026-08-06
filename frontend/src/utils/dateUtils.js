import { startOfWeek, endOfWeek, format, isSameWeek, parseISO } from 'date-fns';

/**
 * Group tasks by week (Monday to Sunday)
 */
export const groupTasksByWeek = (tasks) => {
  const grouped = {};

  tasks.forEach(task => {
    const taskDate = parseISO(task.date);
    // Week starts on Monday (weekStartsOn: 1)
    const weekStart = startOfWeek(taskDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(taskDate, { weekStartsOn: 1 });
    
    const weekKey = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    
    if (!grouped[weekKey]) {
      grouped[weekKey] = {
        label: weekKey,
        startDate: weekStart,
        tasks: []
      };
    }
    grouped[weekKey].tasks.push(task);
  });

  // Convert to array and sort by week start date
  return Object.values(grouped).sort((a, b) => b.startDate - a.startDate);
};
