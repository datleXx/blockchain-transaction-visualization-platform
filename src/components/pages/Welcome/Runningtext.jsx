import React from "react";
import Typed from 'react-typed'
import { Link } from "react-router-dom";

export default function Runningtext (){
    return (
        <div >
             <div className="text-black w-screen">
            <div className="mt-[100px] max-w-[800px] mx-auto text-center flex flex-col justify-center">
                <p className="text-[#4b64d1] font-bold p-2">NO.1 CRYPTO ANALYSIS PLATFORM GLOBALLY</p>
                <h1 className="md:text-4l sm:text-3xl text-2xl font-bold md:py-10 py-10">HELP YOU SURVIVE AND THRIVE IN THE DEVELOPING WORLD OF BLOCKCHAIN</h1>
                <div className="flex justify-center items-center">
                    <p className="md:text-xl sm:text-lg text-md font-bold">Effective, optimal for</p>
                    {/*Typed imported to use the text changing and running features  */}
                    <Typed className="text-red-400 md:text-3xl sm:text2xl text-xl font-bold pl-2" strings={["Security","Analysis","Investment"]} typeSpeed = {90} backSpeed={110} loop/>
                </div>
                <p className="md:text-xl text-md font-bold text-gray-400">Unveiling Insights, Empowering Decisions: Your Trusted Partner in Blockchain Analysis</p>
                <Link to="/mainpage" className="bg-[#4b64d1] 
                w-[200px] 
                rounded-md 
                font-medium 
                my-6 
                mx-auto 
                py-3
                 text-white 
                 hover:bg-gray-400 
                 hover:text-[#4b64d1]">Get Started</Link>
            </div>
        </div>
        </div>
       
    )
}