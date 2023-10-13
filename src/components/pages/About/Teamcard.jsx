import React from 'react';
import Dat from '../../assets/dat.jpg'
import Tung from '../../assets/tung.jpg'
import Abdul from '../../assets/abdul.jpg'
const Teamcardtemplate = ({ name, major, avatar }) => {
  return (
    <div className="w-64 p-4 text-gray-400 hover:text-white bg-white shadow-md rounded-lg flex items-center h-36 border-b border-b-[#4b64d1]  
    hover:bg-[#4b64d1]  
    hover:rounded-xl 
    hover:scale-105 
    duration-300 transform">
      <div className="rounded-full overflow-hidden w-20 h-20 flex-shrink-0 mr-4">
        <img src={avatar} alt={`${name}'s avatar`} className="w-full h-full object-cover" />
      </div>
      <div className='md:w-[70%] md:text-lg text-xs w-[50%]'>
        <p className=" hover:text-red-400 font-bold mb-2">{name}</p>
        <p className=" hover:text-red-400 font-semibold mb-2">{major}</p>
      </div>
    </div>
  );
};

//team data stored for later use in the template..
const Team = () => {
  const teamMembers = [
    {
      name: 'Xuan Dat Le',
      major: 'Data Science',
      avatar: Dat
    },
    {
      name: 'Nam Tung Nguyen',
      major: 'Data Science',
      avatar: Tung
    },
    {
      name: 'Aabdullah Al Taskin',
      major: 'Data Science',
      avatar: Abdul
    }
    
  ];

  return (
    /* use templatecard to arrange team member info card   */
    <div className="flex md:flex-row md:space-x-4 md:space-y-0 items-center mt-[6%] flex-col space-y-4">
      {teamMembers.map((member) => (
        <Teamcardtemplate
          name={member.name}
          major={member.major}
          avatar={member.avatar}
        />
      ))}
    </div>
  );
};

export default Team;
