import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../ProjectCarousel.css';

import project1 from "../assets/projectImages/solarly.png";
import project2 from "../assets/projectImages/kvzCareers.png";
import project3 from "../assets/projectImages/gitUploadAutomation.png";
import project4 from "../assets/projectImages/blockSnake.png";

// project descriptions
const desc1 = "The urgency of transitioning to sustainable energy has made solar energy a key solution due to its abundance and environmental benefits. Solar cells are crucial in this shift, offering renewable, clean, cost-effective, and energy-independent power. However, improving solar cell efficiency requires discovering and optimizing suitable materials, a process traditionally slow and labor-intensive. Machine learning (ML) accelerates this by predicting promising materials based on large datasets, optimizing properties, and discovering novel compositions. Leveraging ML in solar cell research can drive innovation and efficiency. To contribute, I led a team, that developed an ML model that predicts stable perovskite materials for solar cells, with the model available on GitHub and deployed online."
const desc2 = "KayVeeZ Careers Portal is a Flask-based web application that enables job seekers to explore job listings, learn about the company, and apply for positions. It features job listings, an about page, a RESTful API for job data, job details, and an application submission form. The project requires setting up a MySQL database with jobs and applications tables, and dependencies can be installed via pip. The app is powered by Flask for web functionality, SQLAlchemy for database interactions, and MySQL for data storage. The repository is available on GitHub, and the database can be hosted using platforms like Clever Cloud."
const desc3 = "This Bash script automates updating multiple Git repositories by iterating through a list of directories, staging changes, committing updates, and pushing them to remote repositories. It prints status messages for each update and tracks exit codes to verify success. If any update fails, it identifies and reports the specific repository that encountered an issue, ensuring efficient version control across multiple projects."
const desc4 = "BlockSnake is a challenging Unity-based twist on the classic snake game, featuring a minimalist blocky design, retro chiptune music, and fast-paced, skill-based gameplay. With precision movement and an unforgiving difficulty curve, it offers an addictive experience for players who love a real test. Can you master the movement and achieve a high score? 🚀🐍"




const projects = [
  { title: "Solarly", description: desc1, image: project1, link: "https://predict-solar-cell-materials.onrender.com/" },
  { title: "KVZCareers", description: desc2, image: project2, link: "https://kayveez-jobz.onrender.com" },
  { title: "Git Automation", description: desc3, image: project3, link: "https://github.com/KayVeeZ/learning_bash/blob/main/git_up" },
  { title: "BlockSnake", description: desc4, image: project4, link: "https://kshitijvashisth.itch.io/snake" },
];

const Projects = () => {
  const sliderRef = useRef(null);
  const modalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isHovered) {
        e.preventDefault();
      }
    };

    if (isHovered) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    } else {
      window.removeEventListener("wheel", handleWheel);
    }

    return () => window.removeEventListener("wheel", handleWheel);
  }, [isHovered]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    arrows: false,
    dots: false,
    centerMode: true,
    centerPadding: "60px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "40px" } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerPadding: "20px" } },
    ],
  };

  return (
    <div
      className="projects-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={(e) => {
        if (isHovered) {
          if (sliderRef.current) {
            if (e.deltaY < 0) {
              sliderRef.current.slickPrev();
            } else {
              sliderRef.current.slickNext();
            }
          }
        }
      }}
    >
      <div className='text-center'>
        <h2 className="inline-block text-3xl font-bold mb-8 custom-green bg-black px-4 py-2">
          My Projects
        </h2>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {projects.map((project, index) => {
          const isActive = selectedProject === project;
          const isHovering = hoveredIndex === index;
          return (
            <div
              key={index}
              className={`project-slide rounded-2xl transition-transform duration-500 ease-out ${isHovering ? 'scale-120' : 'scale-100'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <div className="project-info text-center p-4">
                <h3 className="text-xl text-[#20C20E] bg-black inline-block px-3 rounded-2xl font-semibold">{project.title}</h3>
              </div>
            </div>
          );
        })}
      </Slider>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content expanded bg-black opacity-75 backdrop-blur-md p-6 max-w-2xl mx-auto rounded-lg shadow-lg overflow-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            onWheel={(e) => e.stopPropagation()} // Prevent background scroll
          >
            <a href={selectedProject.link} target="_blank" rel="noopener noreferrer"><img src={selectedProject.image} alt={selectedProject.title} className="curZur modal-image w-full h-auto rounded-lg" /></a>
            <h3 className="text-3xl text-[#20C20E] font-bold mt-4">{selectedProject.title}</h3>
            <p className="mt-2 text-[#20C20E] text-lg text-justify">{selectedProject.description}</p>
            <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="inline-block text-2xl text-white hover:text-[#20C20E] hover:custom-outline-white hover:underline">Link to {selectedProject.title}</a><br />
            <button
              onClick={() => setSelectedProject(null)}
              className="z-1000 curZur absolute top-4 right-4 bg-[#20C20E] px-3 py-2 rounded-full text-black hover:text-red-600 text-2xl font-bold hover:bg-[#1A9A0B] focus:outline-none hover:border-2 hover:border-solid hover:border-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
