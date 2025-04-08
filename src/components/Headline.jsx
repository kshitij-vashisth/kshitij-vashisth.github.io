import React from 'react'

const Headline = () => {
    return (
        <>
            <div className="text-2xl flex space-x-4 space-y-6">
                <p className='text-4xl'>👋</p>
                <div className="bg-[#20C20E] text-white px-4 rounded-full z-100000 hover:bg-[#1A9A0B]">
                    I'M
                </div>
                <p className="custom-outline-white">KSHITIJ</p>
                <p className="text-white custom-outline-green">VASHISTH<span className='text-[#20C20E]'>!</span></p>
            </div>
        </>
    )
}

export default Headline
