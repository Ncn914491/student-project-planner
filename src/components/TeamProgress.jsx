import React, { useState } from 'react';
import { User, CheckCircle, Calendar, Users, Flag } from 'lucide-react';

const teamMembers = [
  { id: 1, name: "Alice", role: "Project Manager", avatar: "https://i.pravatar.cc/40?img=1", lastContribution: "2025-06-10" },
  { id: 2, name: "Bob", role: "Frontend Developer", avatar: "https://i.pravatar.cc/40?img=2", lastContribution: "2025-06-12" },
  { id: 3, name: "Charlie", role: "Backend Developer", avatar: "https://i.pravatar.cc/40?img=3", lastContribution: "2025-06-11" },
  { id: 4, name: "Dana", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/40?img=4", lastContribution: "2025-06-09" }
];

const stats = [
  { label: "Team Members", value: teamMembers.length, icon: Users, color: "bg-blue-100 text-blue-800" },
  { label: "Completed Tasks", value: 12, icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { label: "Milestones", value: 5, icon: Calendar, color: "bg-yellow-100 text-yellow-800" }
];

const milestones = [
  { id: 1, title: "Project Kickoff", date: "2025-05-01", description: "Initial project kickoff meeting and planning." },
  { id: 2, title: "Design Approval", date: "2025-05-15", description: "Final design approved by stakeholders." },
  { id: 3, title: "Beta Release", date: "2025-06-01", description: "Beta version released for testing." },
  { id: 4, title: "Final Release", date: "2025-06-20", description: "Official final release of the project." }
];

export default function TeamProgress() {
  const [activeTab, setActiveTab] = useState('Contributions');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Progress</h2>

      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {['Contributions', 'Milestones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === tab
                ? `border-b-4 border-blue-600 text-blue-700 bg-blue-50 shadow`
                : `text-gray-600 hover:text-blue-600 hover:bg-blue-50`
            }`}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className={`${color} p-4 rounded-lg flex items-center gap-3 shadow-md cursor-pointer hover:shadow-lg transition-shadow w-full md:w-auto`}
                title={label}
                tabIndex={0}
                aria-label={`${label}: ${value}`}
              >
                <div className="bg-white p-2 rounded-full flex items-center justify-center">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{value}</div>
                  <div className="text-sm">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'Contributions' && (
            <ul className="space-y-4">
              {teamMembers.map(({ id, name, role, avatar, lastContribution }) => (
                <li
                  key={id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-default"
                  title={`${name} - ${role}`}
                >
                  <img
                    src={avatar}
                    alt={`${name}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/48?text=User';
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className="text-sm text-gray-600">{role}</span>
                    <span className="text-xs text-gray-500 italic">Last contribution: {lastContribution}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Milestones' && (
            <ul className="space-y-4">
              {milestones.map(({ id, title, date, description }) => (
                <li key={id} className="p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow cursor-default">
                  <div className="flex items-center gap-3 mb-2">
                    <Flag size={20} className="text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <span className="ml-auto text-sm text-gray-700">{new Date(date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
