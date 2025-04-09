import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './App.css';
import './Cursors.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Headline from './components/Headline';
import Projects from './components/Projects';
import BrainCanvas from './components/BrainCanvas';
import StreamerText from './components/StreamerText';
import PersonalInfo from './components/PersonalInfo';
import RotatingSphere from './components/RotatingSphere';
import backgroundMusic from './assets/music/background-music.mp3';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // ✅ declare this before useEffect

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Play failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  return (
    <div
      className={`select-none font-custom flex flex-col min-h-screen justify-between text-white transition-all duration-700 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex justify-center items-center">
        {/* Pass audio control state to Navbar */}
        <Navbar isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </div>

      {/* Main Section */}
      <section className={`mt-[5vh] h-auto items-center ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {/* Left column with BrainCanvas (Only on Desktop) */}
        {isDesktop && (
          <div className="h-[45vh] ml-[5vw] rounded-3xl translucent-container mt-10 mb-5 mr-8 flex-grow flex flex-col justify-center items-center custom-green select-none">
            <BrainCanvas />
          </div>
        )}

        {/* Right column with Headline and Intro */}
        <div className={`flex-grow flex flex-col justify-center items-center custom-green ${isDesktop ? 'mx-[5vw] text-6xl' : 'mb-4 mx-10 text-[27px]'}`}>
          <Headline />
          <Intro />
        </div>
      </section>

      {/* Other sections as before */}
      <section className="mt-[5vh] mb-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[" Next.js ", " React.js ", " Node.js ", " Express.js ", " Flask ", " PyTorch ", " TensorFlow ", " Pandas ", " MatPlotLib ", " Scikit-Learn ", " Bootstrap ", " TailwindCSS ", " Git ", " Docker ", " MongoDB ", " RabbitMQ ", " Render ", " Unity ", " Vite ", " SQLAlchemy ", " AJAX ", " PyTest "]} direction={1} speed={0.3} />
      </section>

      <section className="mb-[5vh] mt-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[" Data Science ", " Machine Learning ", " Predictive Modelling ", " Statistical Analysis ", " Software Development ", " Algorithms ", " Data Structures ", " Web Development ", " Problem-Solving ", " Containerisation ", " User Authentication ", " Responsive Design ", " Version Control ", " Product Design ", " Data Engineering ", " High Performance Computing ", " Accelerated Computing "]} direction={-1} speed={0.3} />
      </section>

      {/* Projects Section */}
      <section className="h-auto flex items-center justify-center">
        <Projects className="curZur" />
      </section>

      {/* Tech Stack Section */}
      <div className={`mt-2vh] items-center justify-center ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {isDesktop && (
          <div className='flex justify-center items-center flex-col mx-[4vw] scale-92'>
            <RotatingSphere />
          </div>
        )}

        <div className={`flex flex-col justify-center items-center ${isDesktop ? 'mx-[5vw]' : 'mx-10 mb-4'}`}>
          <PersonalInfo />
        </div>
      </div>

      <section className=" text-[#20C20E] flex items-center justify-center">
        {/* Footer */}
        <footer>
          <Footer />
        </footer>
      </section>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={backgroundMusic} loop style={{ display: 'none' }} />

    </div>
  );
}

export default App;
