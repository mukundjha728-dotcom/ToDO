import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import Search from './pages/Search';
import Onboarding from './pages/Onboarding';
import { FiPlus } from 'react-icons/fi';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-white text-gray-900 font-sans w-full relative overflow-hidden">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth pb-24">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />}>
              <Route path="add" element={<TaskForm />} />
              <Route path="edit/:id" element={<TaskForm />} />
              <Route path="task/:id" element={<TaskDetails />} />
            </Route>
            <Route path="/search" element={<Search />}>
              <Route path="task/:id" element={<TaskDetails />} />
            </Route>
          </Routes>
        </main>

        {/* Floating Action Button */}
        <FloatingNav />
      </div>
    </Router>
  );
}

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide FAB on the Onboarding page and anywhere under Search
  if (location.pathname === '/' || location.pathname.startsWith('/search')) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <button 
        onClick={() => navigate('/home/add')} 
        className="w-14 h-14 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] flex items-center justify-center transition-transform active:scale-95"
        aria-label="Add Task"
      >
        <FiPlus size={28} />
      </button>
    </div>
  );
};

export default App;
