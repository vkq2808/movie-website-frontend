import VideoPlayer from '@/components/ui/VideoPlayer';
import VideoUploader from '@/components/ui/VideoUploader';
import Image from 'next/image';
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        About Our Team & Project
      </h1>

      <section>
        <VideoUploader />
        <VideoPlayer videoKey='da74b9d2-2332-485a-80d2-26e2b1fb96e7' />
      </section>

      {/* Team Members Section */}
      <section className="mb-12 px-5 ">
        <MembersContainer />
      </section>

      {/* Project Overview Section */}
      <section className="mb-12 md:px-20">
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
        </ul>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 mt-8">
        <p>&copy; 2025s Project Team. All rights reserved.</p>
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
    <div className="relative min-h-[620px] w-full">
      <div className="absolute w-1/2 h-3/5 z-1 left-1/24">
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
    <div className={`bg-[var(--color-neutral-300)] text-[var(--color-neutral-800)] shadow-lg rounded-lg py-6 w-full ${className}`}>
      <div className="flex items-center justify-center mb-4 select-none">
        <Image src={avatar} alt={fullname} width={60} height={60} className="w-auto h-auto md:w-48 md:h-48 rounded-full" />
      </div>
      <div className="px-6">
        <h3 className="text-2xl font-bold mb-2">{fullname}</h3>
        <p>
          <strong>Role:</strong> {role}
          <br />
          <strong>Interests:</strong> {hobbies.join(', ')}
          <br />
          <strong>Nickname: </strong> {nickname}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
