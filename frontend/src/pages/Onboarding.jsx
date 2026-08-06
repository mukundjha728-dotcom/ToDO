import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('onboarded')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleStart = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/home');
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Top Blue Section */}
      <div className="flex-1 bg-[#4F46E5] relative overflow-hidden flex flex-col justify-between">
        {/* Top Right Circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full border-[16px] border-[#6366F1]/50"></div>
        
        {/* Top Left Waves (Approximation using SVG) */}
        <div className="mt-20 ml-6 opacity-40 text-white">
          <svg width="80" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M0 25 Q 12.5 15, 25 25 T 50 25 T 75 25 T 100 25" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M0 40 Q 12.5 30, 25 40 T 50 40 T 75 40 T 100 40" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>

        {/* Bottom Right Waves */}
        <div className="absolute bottom-10 right-6 opacity-40 text-white">
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" stroke="currentColor" strokeWidth="5" fill="none" />
            <path d="M0 30 Q 12.5 20, 25 30 T 50 30 T 75 30 T 100 30" stroke="currentColor" strokeWidth="5" fill="none" />
            <path d="M0 50 Q 12.5 40, 25 50 T 50 50 T 75 50 T 100 50" stroke="currentColor" strokeWidth="5" fill="none" />
          </svg>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-8 pt-10 pb-12 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Manage What To Do</h1>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            The best way to manage what you have to do, don't forget your plans
          </p>
        </div>
        
        <button 
          onClick={handleStart}
          className="w-full mt-16 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-transform active:scale-[0.98]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
