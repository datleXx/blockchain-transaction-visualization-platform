import React from "react";
import Team from "./Teamcard";
import Typed from "react-typed";

export default function About() { 

    return(
        <div className="w-screen min-h-full mt-[100px]">
            <div className="flex justify-between items-center flex-col mx-auto">
                <h1 className="md:text-5xl sm:text-3xl text-2xl font-bold"> Our Team</h1>
                <p className="w-[60%] text-center text-[#4b64d1] items-center my-6 font-bold md:text-xl text-xs">
                "Meet our skilled Data Science team of three, specializing in extracting insights from data and crafting actionable solutions for impactful decision-making."
                </p>
                <Typed className="text-red-400 md:text-xl sm:text-md text-sm font-bold pl-2" strings={["Feel free to explore"]} typeSpeed = {50} backSpeed={80} loop/>
                <Team/>
            </div>
        </div>
    )

}

