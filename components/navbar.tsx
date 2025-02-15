import React from 'react';
import { ArrowLeft, BarChart2, Settings, Bookmark, Share2 } from 'lucide-react';

const NavBar = () => {
  return (
    <div className="bg-[#0B0B0F] rounded-2xl border border-slate-800 px-4 py-1 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center space-x-3">
          {/* Using a placeholder for the NVIDIA logo */}
          <div className="w-8 h-8 text-[11px] bg-green-600 rounded-lg flex items-center justify-center text-white font-semibold">
            NVDA
          </div>
          
          <div>
            <div className="text-white  font-semibold">NVDA</div>
            <div className="text-gray-400 text-sm">NVIDIA Corporation</div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center px-3 py-1.5  rounded-lg text-gray-300 ">
          <BarChart2 size={18} className="mr-2" />
          <span>Analyze</span>
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
          <Share2 size={18} />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
          <Settings size={18} />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;