import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../ProjectCarousel.css';

import project1 from "../assets/projectImages/rudraDream.jpg";
import project2 from "../assets/projectImages/gloNeuro.png";
import project3 from "../assets/projectImages/solarly.png";
import project4 from "../assets/projectImages/kvzCareers.png";
import project5 from "../assets/projectImages/gitUploadAutomation.png";
import project6 from "../assets/projectImages/blockSnake.png";
import project7 from "../assets/projectImages/toDoListCreator.png";
import project8 from "../assets/projectImages/prismaTodo.png";
import project9 from "../assets/projectImages/gdriveClone.png";
import project10 from "../assets/projectImages/GSAPWebsite.png";

// project descriptions
const desc1 = "Rudra's Dream is a top-down brawler built in Unity using C#, where players battle endless waves of enemies in a fast-paced, action-packed arena. Featuring skill-based melee combat, a wide variety of weapons, and light RPG elements, the game lets players level up, unlock powerful abilities, and gain impactful upgrades mid-run. With tight, responsive controls, escalating difficulty, and a strong emphasis on timing and strategy, Rudra's Dream challenges players to survive as long as possible while mastering combos, dodging deadly attacks, and picking the right powerups to shape their unique playstyle. Designed for fans of raw, satisfying combat, it delivers an intense and highly replayable experience."
const desc2 = "The Global Neuro Foundation advances neurosurgical education worldwide through training, collaboration, and knowledge sharing. Their website, gloneuro.org, serves as a hub for global neurosurgical professionals, offering access to educational courses, case studies, research, and events. To support this mission, I developed it's website with the support of a team to make it available online. Now, I am leading the redevelopment of the site using a modern technology stack. The goal is to enhance performance, usability, and security while introducing features like interactive modules, real-time tools, and personalized dashboards. This renovation will provide a more dynamic and scalable platform to better serve the global neurosurgical community."
const desc3 = "The urgency of transitioning to sustainable energy has made solar energy a key solution due to its abundance and environmental benefits. Solar cells are crucial in this shift, offering renewable, clean, cost-effective, and energy-independent power. However, improving solar cell efficiency requires discovering and optimizing suitable materials, a process traditionally slow and labor-intensive. Machine learning (ML) accelerates this by predicting promising materials based on large datasets, optimizing properties, and discovering novel compositions. Leveraging ML in solar cell research can drive innovation and efficiency. To contribute, our team developed an ML model that predicts stable perovskite materials for solar cells, with the model available on GitHub and deployed online."
const desc4 = "KayVeeZ Careers Portal is a Flask-based web application that enables job seekers to explore job listings, learn about the company, and apply for positions. It features job listings, an about page, a RESTful API for job data, job details, and an application submission form. The project requires setting up a MySQL database with jobs and applications tables, and dependencies can be installed via pip. The app is powered by Flask for web functionality, SQLAlchemy for database interactions, and MySQL for data storage. The repository is available on GitHub, and the database can be hosted using platforms like Clever Cloud."
const desc5 = "This Bash script automates updating multiple Git repositories by iterating through a list of directories, staging changes, committing updates, and pushing them to remote repositories. It prints status messages for each update and tracks exit codes to verify success. If any update fails, it identifies and reports the specific repository that encountered an issue, ensuring efficient version control across multiple projects."
const desc6 = "BlockSnake is a challenging Unity-based twist on the classic snake game, featuring a minimalist blocky design, retro chiptune music, and fast-paced, skill-based gameplay. With precision movement and an unforgiving difficulty curve, it offers an addictive experience for players who love a real test. Can you master the movement and achieve a high score? 🚀🐍"
const desc7 = "iTask is a sleek and efficient To-Do List application built with Vite, React, and Tailwind CSS, designed to keep your tasks organized and manageable. This intuitive app allows you to add, edit, delete, and mark tasks as completed, while ensuring your data is saved persistently using localStorage. With features like filtering tasks and simple task management, it’s perfect for those who want a no-frills, yet powerful to-do list solution. Can you stay on top of all your tasks? ✔️📋"
const desc8 = "TaskForge API – Dockerized Todo Backend with JWT Auth is a secure, scalable backend service built with Node.js, Express.js, Prisma, PostgreSQL, and fully containerized using Docker. Designed for seamless integration into any frontend, it delivers a full-featured REST API with JWT-based authentication, enabling users to register, log in, and manage todos through protected CRUD operations. Leveraging Prisma ORM for elegant database access, bcrypt for password security, and Docker Compose for efficient service orchestration, TaskForge API is production-ready and developer-friendly. With a clean architecture, environment-based config, and straightforward setup, it’s an ideal backend foundation for modern web applications."
const desc9 = "SkyVault is a secure, user-centric file storage backend built with Node.js, Express.js, MongoDB, and Filebase for cloud storage. It offers authenticated file management via JWT, allowing users to upload, download, and delete their personal files. Featuring a drag-and-drop interface, the app supports a seamless user experience for handling uploads. Filebase ensures S3-compatible, scalable storage, while MongoDB handles metadata and user info. Tailwind and Flowbite enhance the UI, and the backend enforces strict user access controls. With structured routing, environment-based settings, and simple deployment, it’s a lightweight, modern solution for personal cloud storage with privacy and usability in focus."
const desc10 = "MotionMuse is an interactive portfolio website powered by GSAP for smooth, dynamic animations and scroll-triggered effects. Designed with vanilla HTML and CSS, it features responsive layouts and fluid transitions that enhance user engagement. GSAP’s timeline control allows choreographed animations across sections, while ScrollTrigger synchronizes content reveal with scrolling. The site focuses on clean, minimal design with custom CSS for styling, ensuring a lightweight, fast user experience. Built for performance, it adapts seamlessly across devices. Structured for scalability and easy maintenance, MotionMuse demonstrates how animation can transform static content into an immersive, engaging journey."

const projects = [
  { title: "Rudra's Dream", description: desc1, image: project1, link: null, isUpcoming: true },
  { title: "GloNeuro", description: desc2, image: project2, link: "https://gloneuro.org/", isUpcoming: true },
  { title: "Solarly", description: desc3, image: project3, link: "https://predict-solar-cell-materials.onrender.com/", isUpcoming: false },
  { title: "KVZCareers", description: desc4, image: project4, link: "https://kayveez-jobz.onrender.com", isUpcoming: false },
  { title: "Git Automation", description: desc5, image: project5, link: "https://github.com/kshitij-vashisth/learning_bash/blob/main/git_up", isUpcoming: false },
  { title: "BlockSnake", description: desc6, image: project6, link: "https://kshitijvashisth.itch.io/snake", isUpcoming: false },
  { title: "iTask", description: desc7, image: project7, link: "https://kshitij-vashisth.github.io/todoListReactApp/", isUpcoming: false },
  { title: "TaskForge API", description: desc8, image: project8, link: "https://github.com/kshitij-vashisth/learning_web_js/tree/main/backend-course/backend_with_prisma/chapter-4", isUpcoming: false },
  { title: "SkyVault", description: desc9, image: project9, link: "https://github.com/kshitij-vashisth/learning_web_js/tree/main/backend-course/sheryian-crash-4hr/6_skyvault", isUpcoming: false },
  { title: "MotionMuse", description: desc10, image: project10, link: "https://kshitij-vashisth.github.io/GSAPFrontEndWebsite/", isUpcoming: false }
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
              className={`project-slide rounded-2xl relative transition-transform duration-500 ease-out ${isHovering ? 'scale-120' : 'scale-100'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedProject(project)}
            >
              {project.isUpcoming && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-white text-black font-bold text-sm rounded z-10">
                  <span className='flash-text'>Upcoming Project</span>
                </div>
              )}
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

            <img
              src={selectedProject.image}
              onClick={() => {
                if (selectedProject.link) {
                  window.open(selectedProject.link, "_blank");
                }
              }}
              alt={selectedProject.title}
              className={`modal-image w-full h-auto rounded-lg ${selectedProject.link ? 'curZur cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            />


            <h3 className="text-3xl text-[#20C20E] font-bold mt-4 flex items-center gap-3">
              {selectedProject.title}
              {selectedProject.isUpcoming && (
                <span className="text-white bg-[#20C20E] px-2 py-1 rounded-md text-base font-semibold animate-pulse">
                  Upcoming Project
                </span>
              )}
            </h3>
            <p className="mt-2 text-[#20C20E] text-lg text-justify">{selectedProject.description}</p>

            {selectedProject.link ? (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-2xl text-white hover:text-[#20C20E] hover:custom-outline-white hover:underline"
              >
                Link to {selectedProject.title}
              </a>
            ) : (
              <span className="inline-block text-2xl text-gray-500 cursor-not-allowed opacity-50">
                Link not available
              </span>
            )}


            <br />
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
