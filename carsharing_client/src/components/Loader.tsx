import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 border-t-4 border-b-4 border-gray-400 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Loader
