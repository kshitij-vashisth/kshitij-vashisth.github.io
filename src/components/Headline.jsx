import React from 'react'

const Headline = () => {
    return (
        <>
            <div className="flex space-x-4 space-y-6">
                <p>👋</p>
                <div className="bg-[#20C20E] text-white px-4 rounded-full z-100000 hover:bg-[#1A9A0B]">
                    I'M
                </div>
                <p className="custom-outline-white">KKSHITIJ</p>
                <p className="text-white custom-outline-green">VASSHISTH<span className='text-[#20C20E] custom-outline-white'>!</span></p>
            </div>
        </>
    )
}

export default Headline
