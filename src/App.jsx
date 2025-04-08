import { useState, useEffect } from 'react';
import './App.css';
import './Cursors.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Headline from './components/Headline';
import Projects from './components/Projects';
import BrainCanvas from './components/BrainCanvas';
import StreamerText from './components/StreamerText';
import IconSphere from './components/IconSphere';
import PersonalInfo from './components/PersonalInfo';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024); // Checking if the screen is larger than 1024px

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300); // Small delay for smooth effect

    // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024); // Adjust the condition if needed
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, []);

  return (
    <div
      className={`select-none font-custom flex flex-col min-h-screen justify-between text-white transition-all duration-700 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex flex-col justify-center items-center">
        {/* Navbar */}
        <Navbar />
      </div>


      {/* Main Section */}
      <section className={`
  mt-[5vh] h-auto items-center
  ${isDesktop ? 'grid grid-cols-2' : 'flex flex-col'}
`}>

        {/* Left column with BrainCanvas (Only on Desktop) */}
        {isDesktop && (
          <div className="h-[45vh] ml-[10vw] rounded-3xl translucent-container mt-10 mb-5 mr-8 flex-grow flex flex-col justify-center items-center custom-green select-none">
            <BrainCanvas />
          </div>

        )}

        {/* Right column with Headline and Intro */}
        <div className={`flex-grow flex flex-col justify-center items-center custom-green ${isDesktop ? 'mx-auto' : 'mb-4 mx-6'}`}>
          <Headline />
          <Intro />
        </div>

      </section>
      <section className="mt-[5vh] mb-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[
          " Next.js ", " React.js ", " Node.js ", " Express.js ", " Flask ", " PyTorch ", " TensorFlow ",
          " Pandas ", " MatPlotLib ", " Scikit-Learn ", " Bootstrap ", " TailwindCSS ", " Git ", " Docker ",
          " MongoDB ", " RabbitMQ ", " Render ", " Unity ", " Vite ", " SQLAlchemy ", " AJAX ", " PyTest "
        ]} direction={1} speed={0.3} />
      </section>
      <section className="mb-[5vh] mt-0.5 flex flex-col h-auto items-center">
        <StreamerText texts={[
          " Data Science ", " Machine Learning ", " Predictive Modelling ", " Statistical Analysis ",
          " Software Development ", " Algorithms ", " Data Structures ", " Web Development ",
          " Problem-Solving ", " Containerisation ", " User Authentication ",
          " Responsive Design ", " Version Control ", " Product Design ", " Data Engineering ",
          " High Performance Computing ", " Accelerated Computing "
        ]} direction={-1} speed={0.3} />
      </section>
      {/* Projects Section */}
      <section className="h-auto flex items-center justify-center">
        <Projects className="curZur" />
      </section>

      {/* Tech Stack Section */}
      <section className="mt-[5vh] flex h-auto justify-center items-center">
        {isDesktop && (

          <div className='flex globe justify-center items-center flex-col h-[220vh] w-[150vw] ml-[12vw] mr-[2vw] mb-[-100vh]' style={{ overflow: 'hidden' }}>
            <div className="flex items-center justify-center px-[15vw]">
              <IconSphere />
            </div>
          </div>

        )}

        <div className={`flex-grow flex flex-col justify-center items-center w-[75vw] ${isDesktop ? 'mt-[-100vh] ml-[2vw] mr-[7vw] mb-[-100vh]' : 'mx-[10vw] mb-4'}`}>
          <PersonalInfo />
        </div>
      </section>
      <section className="h-auto flex items-center justify-center">
        {/* Footer */}
        <footer className='mt-auto'>
          <Footer className="w-full flex justify-center" />
        </footer>

      </section>
    </div>
  );
}

export default App;
