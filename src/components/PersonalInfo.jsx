import React from 'react'
import { RiNextjsLine, RiReactjsFill, RiNodejsLine, RiBootstrapFill, RiTailwindCssLine, RiGithubFill } from "react-icons/ri";
import { SiExpress, SiFlask, SiPytorch, SiTensorflow, SiPandas, SiScikitlearn, SiDocker, SiMongodb, SiRabbitmq, SiUnity, SiMysql, SiSqlalchemy, SiGnubash } from "react-icons/si";

const PersonalInfo = () => {
  return (
    <>
      <div className="translucent-container p-6 custom-green rounded-2xl my-4 w-[95%]">

        <p className="text-xl text-left text-white">
          Age
        </p>
        <p className="text-3xl text-left">
          33
        </p>
      </div>
      <div className="translucent-container p-6 custom-green rounded-2xl my-4 w-[95%]">

        <p className="text-xl text-left text-white">
          Nationality
        </p>
        <p className="text-3xl text-left">
          Indian
        </p>
      </div>
      <div className="translucent-container p-6 custom-green rounded-2xl w-[95%] my-4">

        <p className="text-xl text-left text-white">
          Tech Stack
        </p>
        <div className="text-5xl text-left">
          <div className="flex gap-x-4">
            <div className="flex flex-col gap-y-4">
              <RiNextjsLine />
              <RiReactjsFill />
              <RiNodejsLine />
              <SiExpress />
            </div>
            <div className="flex flex-col gap-y-4">
              <SiFlask />
              <SiPytorch />
              <SiTensorflow />
              <SiPandas />
            </div>
            <div className="flex flex-col gap-y-4">
              <SiScikitlearn />
              <RiBootstrapFill />
              <RiTailwindCssLine />
              <RiGithubFill />
            </div>
            <div className="flex flex-col gap-y-4">
              <SiDocker />
              <SiMongodb />
              <SiRabbitmq />
              <SiUnity />
            </div>
            <div className="flex flex-col gap-y-4">
              <SiMysql />
              <SiSqlalchemy />
              <SiGnubash />
            </div>
          </div>
          


        </div>
      </div>
    </>
  )
}

export default PersonalInfo
