import React from 'react';
import { ReactTyped } from "react-typed";
import { Link } from 'react-router-dom'; // <-- This is already correct!

const Hero = () => {
  return (
    <div className='text-white'>
        <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
          <p className='text-[#00df9a] font-bold pd-2'>MASTER YOUR MONEY</p>  
          <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 '>Track Every Rupee</h1>
          <div className='flex justify-center items-center'>
            <p className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-2 py-2'>Acheive Every</p>
            <ReactTyped 
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-2 pl-1'
                strings={['Goal','Milestone','Dream']}
                typeSpeed={120}
                backSpeed={140}
                loop
                />
          </div>
          <p className='md:text-2xl text-xl font-bold text-gray-500'>Monitor daily finances to stay on budget.</p>
          
          {/* --- This is the only change --- */}
          <Link to="/login">
            <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black'>Get started</button>
          </Link>

        </div>
    </div>
  )
}

export default Hero