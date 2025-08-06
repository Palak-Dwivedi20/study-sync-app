import React from 'react';

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-20 h-20">

        <div className="absolute inset-0 rounded-full border-[10px] border-gray-700"></div>

        <div className="absolute inset-0 animate-spin">
          <div
            className="w-full h-full rounded-full border-[10px] border-transparent border-t-blue-500"
            style={{ borderRadius: '9999px' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
