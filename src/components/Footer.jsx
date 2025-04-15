import React, { useState, useEffect, useRef } from 'react';
import resumePdf from '../assets/resume/kshitij_vashisth_cv.pdf';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


const Footer = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isResumeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isResumeOpen]);

  return (
    <div className="flex flex-col items-center text-center p-6 space-y-6">
      <div className="translucent-container p-2">
        <p className="text-lg">Have a project in mind?</p>

        <a
          href="mailto:kshitijvashisth@gmail.com"
          className="text-xl text-white hover:text-[#1A9A0B] inline-block mt-5 mb-4 hover:underline"
        >
          kshitijvashisth@gmail.com
        </a>

        <p>
          {isMobile ? (
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#1A9A0B]"
            >
              Download Resume!
            </a>
          ) : (
            <button
              onClick={() => setIsResumeOpen(true)}
              className="hover:underline hover:text-[#1A9A0B]"
            >
              Click to View Resume!
            </button>
          )}

        </p>
      </div>

      <div className="translucent-container w-[95%] text-[12px]">
        <p className="text-muted-foreground">Design by: Kshitij Vashisth © 2025 </p>
        <p className="text-muted-foreground">All copyrighted properties belong to rightful owners. </p>
      </div>

      {isResumeOpen && (
        <div className="modal-overlay" onClick={() => setIsResumeOpen(false)}>
          <div
            className="modal-content expanded bg-black opacity-75 backdrop-blur-md p-6 max-w-5xl w-[90vw] h-[90vh] mx-auto rounded-lg shadow-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            onWheel={(e) => e.stopPropagation()}
          >
            <iframe
              src={resumePdf}
              title="Resume"
              className="w-full h-full rounded-lg custom-scrollbar"
              allow="fullscreen"
            />

            <button
              onClick={() => setIsResumeOpen(false)}
              className="z-1000 curZur absolute top-4 right-0 bg-[#20C20E] px-3 py-2 rounded-full text-black hover:text-red-600 text-2xl font-bold hover:bg-[#1A9A0B] focus:outline-none hover:border-2 hover:border-solid hover:border-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
