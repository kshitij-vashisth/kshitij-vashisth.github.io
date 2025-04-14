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
                    A full-stack developer who lives and breathes code 💻🔥, obsessed with building blazing-fast ⚡, scalable 📈 applications that don’t just work—they thrill users 🎢. I geek out over clean architecture 🏗️, buttery-smooth UIs 🧈🎨, and solving gnarly technical challenges 💡🧠. When I’m not refactoring 🔄 or debugging 🐞, you’ll find me absorbing new tech 📚🤓, or engaged in technical discussions with fellow devs 👨🏫✨. Let’s collaborate and turn wild ideas into rock-solid reality 🚀—preferably with coffee ☕ in hand.
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
