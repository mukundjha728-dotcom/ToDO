// Simulated API using localStorage
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getTasksFromStorage = () => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
};

const saveTasksToStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const api = {
  get: async (url) => {
    // Simulate network delay
    await delay(150);
    
    let tasks = getTasksFromStorage();
    
    // Handle search query e.g., /tasks?search=X
    if (url.includes('?search=')) {
      const query = decodeURIComponent(url.split('?search=')[1]).toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }
    
    return { data: tasks };
  },
  
  post: async (url, payload) => {
    await delay(150);
    const tasks = getTasksFromStorage();
    const newTask = {
      ...payload,
      _id: generateId(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    return { data: newTask };
  },
  
  put: async (url, payload) => {
    await delay(150);
    const id = url.split('/').pop();
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(t => t._id === id);
    
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...payload };
      saveTasksToStorage(tasks);
      return { data: tasks[index] };
    }
    
    throw new Error('Task not found');
  },
  
  delete: async (url) => {
    await delay(150);
    const id = url.split('/').pop();
    const tasks = getTasksFromStorage();
    const filtered = tasks.filter(t => t._id !== id);
    saveTasksToStorage(filtered);
    return { data: { message: 'Deleted successfully' } };
  }
};

export default api;
