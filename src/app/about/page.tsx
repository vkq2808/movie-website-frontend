import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        About Our Team & Project
      </h1>

      {/* Team Members Section */}
      <section className="mb-12">
        <MembersContainer />
      </section>

      {/* Project Overview Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Project Overview</h2>
        <p className="text-gray-700 mb-4">
          <strong>Project Title:</strong> Online Movie Streaming Platform
          <br /><br />
          <strong>Rationale:</strong> With the rapid advancement of technology, the demand for online entertainment has grown significantly.
          Our objective is to develop a user-friendly and accessible platform that delivers a superior movie streaming experience.
        </p>
        <h3 className="text-2xl font-semibold mb-2">Technologies Utilized:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>NestJS</strong>: A modern, secure, and maintainable backend framework.</li>
          <li><strong>NextJS</strong>: A robust frontend framework with server-side rendering capabilities.</li>
          <li><strong>TypeScript</strong>: Ensures code quality and maintainability through static type checking.</li>
          <li><strong>MongoDB</strong>: A flexible NoSQL database for scalable data storage.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 mt-8">
        <p>&copy; {new Date().getFullYear()} Project Team. All rights reserved.</p>
      </footer>
    </div>
  );
};

const MembersContainer = () => {
  const members = [
    {
      fullname: 'Vũ Khánh Quốc',
      role: 'Team Leader',
      hobbies: ['Gaming', 'Reading manga/manhua'],
      avatar: 'https://avatars.githubusercontent.com/u/151765122?v=4',
      nickname: 'Quắc '
    },
    {
      fullname: 'Triệu Thị Tâm Anh',
      role: 'Team Member',
      hobbies: ['Listening to music', 'Watching movies'],
      avatar: 'https://avatars.githubusercontent.com/u/126133422?v=4',
      nickname: 'fishy'
    }
  ];

  return (
    <div className="relative min-h-[620px] w-full p-3">
      <div className="absolute w-1/2 h-3/5 z-1">
        <MemberCard {...members[0]} />
      </div>
      <div className="absolute top-15/40 left-11/24 w-1/2 h-3/5">
        <MemberCard {...members[1]} />
      </div>
    </div>
  );
};

interface MemberCardProps {
  fullname: string;
  role: string;
  hobbies: string[];
  avatar: string;
  className?: string;
  nickname: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ fullname, role, hobbies, avatar, className, nickname }) => {
  return (
    <div className={`bg-[var(--color-neutral-800)] text-[var(--color-neutral-50)] shadow-lg rounded-lg p-6 w-full ${className}`}>
      <div className="flex items-center justify-center mb-4 select-none">
        <img src={avatar} alt={fullname} className="w-48 h-48 rounded-full" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{fullname}</h3>
      <p className="">
        <strong>Role:</strong> {role}
        <br />
        <strong>Interests:</strong> {hobbies.join(', ')}
        <br />
        <strong>Nickname: </strong> {nickname}
      </p>
    </div>
  );
};

export default AboutPage;
