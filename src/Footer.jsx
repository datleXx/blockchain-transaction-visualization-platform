import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='w-screen mx-auto mt-[8%] py-16 px-3 grid lg:grid-cols-1 gap-8 text-sm text-gray-300 bg-black'>
      <div className='grid-item place-self-center flex flex-col items-center'>
            <h1 className='w-full text-xl font-extrabold tracking-wider text-red-400 text-center'>CheckerV. from Swinburne</h1>
            <p className='py-4 text-center text-shadow-md'>Transparency in every transaction, clarity in every chain</p>
        <div className='flex justify-between md:w-[75%] my-6 grid-item flex justify-center items-center'>
            <FaFacebookSquare size={20} className='hover:text-blue-500 transition duration-300 ease-in-out' />
            <FaInstagram size={20} className='hover:text-pink-500 transition duration-300 ease-in-out' />
            <FaTwitterSquare size={20} className='hover:text-blue-400 transition duration-300 ease-in-out' />
            <FaGithubSquare size={20} className='hover:text-white transition duration-300 ease-in-out' />
            <FaDribbbleSquare size={20} className='hover:text-pink-400 transition duration-300 ease-in-out' />
        </div>
      </div>     
      </div>
  );
};

export default Footer;