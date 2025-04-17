import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;