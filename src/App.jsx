import { useState, useEffect, useRef } from 'react';
import './App.css';
import './Cursors.css';
import ArrowDown from './components/ArrowDown';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Headline from './components/Headline';
import Projects from './components/Projects';
import NeuronalNetwork from './components/NeuronalNetwork';
import StreamerText from './components/StreamerText';
import PersonalInfo from './components/PersonalInfo';
import KleinBottle from './components/KleinBottle';
import backgroundMusic from './assets/music/background-music.mp3';
import Scroller from './components/Scroller';

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
      <section className={`h-auto items-center ${isDesktop ? 'mt-[5vh] grid grid-cols-2' : 'mt-[-8vh] mx-[10vw] scale-90 flex flex-col'}`}>
        {/* Right column with Headline and Intro */}
        <div className={`flex-grow flex flex-col justify-center items-center custom-green ${isDesktop ? 'mx-[4vw] text-[54px]' : 'mb-[-15vh] mx-10 text-[21px]'}`}>
          <Headline />
          <Intro />
          <div className="md:w-1/2 flex justify-center">
            <ArrowDown />

          </div>
        </div>

        {/* Right column with KleinBottle (Only on Desktop) */}
        <div
          className={`rounded-3xl mt-[-25vh] flex-grow flex flex-col justify-center items-center ${isDesktop ? 'scale-125 ml-[-15vw] mr-[4vw] my-5' : 'w-[100vw] mt-[5vh] mb-[-40vh] px-[10vh]'
            }`}
        >

          <KleinBottle /><br />

        </div>


      </section>

      {/* Other sections as before */}
      <section className="mt-[5vh] mb-0.5 flex flex-col h-auto items-center">
        <StreamerText
          texts={[
            " Python ", " C/C++ ", " Scientific Computing ", " Game Development ",
            " Computational Modelling ", " Computational Physics ", " Machine Learning ", " Full-Stack Development ",
            " TensorFlow ", " Scikit-Learn ", " NumPy ", " Pandas ", " Matplotlib ",
            " GROMACS ", " AutoDock ", " PyMol ", " Docker ",
            " Git ", " HPC ", " Linux ", " Bash ", " SQL "
          ]}
          direction={1}
          speed={0.3}
        />
      </section>

      <section className="mb-[5vh] mt-0.5 flex flex-col h-auto items-center">
        <StreamerText
          texts={[
            " Physics Education ", " Heat Death Simulation ", " Classical Mechanics ",
            " Electromagnetism ", " Modern Physics ", " Optics ",
            " Thermodynamics ", " Waves & Oscillations ", " String Theory ",
            " Neuroscience ", " Neurobiology ", " Brain & Behaviour ",
            " Neural Systems ", " Biological Systems "
          ]}
          direction={-1}
          speed={0.3}
        />
      </section>


      {/* Projects Section */}
      <section className="h-auto flex items-center justify-center">
        <Projects className="curZur" />
      </section>

      {/* <section>
        <Scroller texts={["Code Beyond Boundaries"]} />
      </section> */}

      {/* Tech Stack Section */}
      <div className={`items-center justify-center ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}`}>
        {isDesktop && (
          <div className='flex translucent-container justify-center items-center flex-col mt-[-30vh] mx-[4vw] h-[80vh] w-[45vw]'>
            <NeuronalNetwork />
          </div>
        )}

        <div className={`flex flex-col justify-center items-center ${isDesktop ? 'mx-[5vw]' : 'mt-[-20vh] w-[95vw] mx-10 mb-4'}`}>
          <PersonalInfo />
        </div>
      </div>

      <section className={`text-[#20C20E] flex items-center justify-center ${isDesktop ? '': 'scale-85 w-[90vw] ml-[3vw] mb-4'}`}>
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
