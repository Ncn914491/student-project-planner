import React, { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, Clock, Timer, User } from 'lucide-react';

const stats = [
  { label: "Total Tasks", value: 24, icon: ClipboardList, color: "bg-blue-100 text-blue-800" },
  { label: "Completed", value: 12, icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { label: "In Progress", value: 8, icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { label: "Pending", value: 4, icon: Timer, color: "bg-red-100 text-red-800" }
];

const teamMembers = [
  {
    id: 1,
    name: "Alice",
    role: "UI Designer",
    avatar: "https://i.pravatar.cc/40?img=1",
    sections: ["UI"],
    completedTasks: 5,
    totalTasks: 7
  },
  {
    id: 2,
    name: "Bob",
    role: "Backend Developer",
    avatar: "https://i.pravatar.cc/40?img=2",
    sections: ["Backend"],
    completedTasks: 4,
    totalTasks: 6
  },
  {
    id: 3,
    name: "Charlie",
    role: "QA Tester",
    avatar: "https://i.pravatar.cc/40?img=3",
    sections: ["Testing"],
    completedTasks: 3,
    totalTasks: 5
  }
];

export default function StatusOverview() {
  const [progressWidth, setProgressWidth] = useState(50);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressWidth(50);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-6">Project Status</h2>

      <div className="flex space-x-6 min-w-max mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.color} p-6 rounded-xl flex flex-col items-center shadow-lg cursor-pointer hover:shadow-2xl transition-shadow w-44`}
              title={stat.label}
              tabIndex={0}
              aria-label={`${stat.label}: ${stat.value}`}
            >
              <div className="bg-white p-3 rounded-full mb-3 flex items-center justify-center shadow-md">
                <Icon size={36} strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-extrabold">{stat.value}</div>
              <div className="text-lg font-semibold">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Overall Progress</h3>
        <div className="w-full bg-blue-200 rounded-full h-5 overflow-hidden cursor-pointer">
          <div
            className="bg-blue-600 h-5 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: progressWidth + '%' }}
            title={`${progressWidth}% Complete`}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-blue-900 font-semibold">
          <span>Started: May 1, 2025</span>
          <span>{progressWidth}% Complete</span>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <User size={24} />
          Team Member Responsibilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teamMembers.map((member) => {
            const completionPercent = Math.round((member.completedTasks / member.totalTasks) * 100);
            return (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <img
                  src={member.avatar}
                  alt={`${member.name} avatar`}
                  className="w-16 h-16 rounded-full mb-3"
                />
                <div className="text-lg font-bold text-blue-900">{member.name}</div>
                <div className="text-sm text-blue-700 mb-2">{member.role}</div>
                <div className="text-sm text-blue-700 mb-2">
                  Sections: {member.sections.join(', ')}
                </div>
                <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${completionPercent}%` }}
                    title={`${completionPercent}% Tasks Completed`}
                  ></div>
                </div>
                <div className="mt-1 text-sm text-blue-900 font-semibold">
                  {completionPercent}% Tasks Completed
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
