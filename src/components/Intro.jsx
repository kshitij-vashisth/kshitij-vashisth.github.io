import React from 'react'
import HireMe from './HireMe'

const Intro = () => {
    return (
        <>
            {/* Intro Card */}
            <div className="flex justify-center items-center w-[90%]">
                {/* Card */}
                <div className="translucent-container p-6 rounded-3xl">
                 
                    <p className="text-[18px] text-left">
                    A Physics educator, neuroscientist, and computational researcher who enjoys breaking down complex ideas into clear, intuitive understanding ⚡📘. I’m driven by building strong problem-solving skills 🧠💡 and exploring how physics, neuroscience, and AI intersect to solve real-world challenges 🔬🤖.

I work across modelling, data analysis, and simulations 🧬📊🌌, combining scientific thinking with computation.

Always curious, always learning 📚—let’s collaborate to turn complex ideas into meaningful solutions 🚀
                    </p>
                </div>
            </div>

            
            {/* Centered "Hire Me" Button Inside the Card */}
            <div className="flex justify-center">
                <HireMe />
            </div>
        </>
    )
}

export default Intro
