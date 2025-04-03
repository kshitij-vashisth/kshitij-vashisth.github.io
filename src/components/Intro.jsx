import React from 'react'
import HireMe from './HireMe'

const Intro = () => {
    return (
        <>
            {/* Intro Card */}
            <div className="flex justify-center items-center w-full">
                {/* Card */}
                <div className="translucent-container p-6">
                 
                    <p className="text-xl text-left">
                    🚀 A Full-Stack Developer passionate about crafting fast ⚡, scalable 📈, and user-friendly 🎨 apps. I always enjoy learning 📚, building 🛠️, and innovating 💡! ✨
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
