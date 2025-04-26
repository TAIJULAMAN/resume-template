import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className='p-4 bg-white border-b'>
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <Link to="/" className="text-xl font-semibold">
          AI Resume Builder
        </Link>
        <Link 
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Header