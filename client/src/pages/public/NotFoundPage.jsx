import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-orange-50 text-primary-500 flex items-center justify-center mb-6 shadow-inner">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <h1 className="text-5xl font-black text-gray-900 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
        The page you are looking for doesn't exist or may have been moved. Let's find you some delicious food instead!
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/20 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
