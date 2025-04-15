import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Calendar, Users, Flag, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ImprovedTeamProgress({ tasks = [] }) {
  const [activeTab, setActiveTab] = useState('Team');
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { isDarkMode } = useTheme();

  const teamMembers = [
    { 
      id: 1, 
      name: "Alice", 
      role: "Project Manager", 
      avatar: "https://i.pravatar.cc/40?img=1", 
      lastActive: "2025-06-12T14:30:00Z",
      sections: ["UI", "API", "Testing"],
      completedTasks: 5,
      totalTasks: 8
    },
    { 
      id: 2, 
      name: "Bob", 
      role: "Frontend Developer", 
      avatar: "https://i.pravatar.cc/40?img=2", 
      lastActive: "2025-06-12T16:45:00Z",
      sections: ["UI", "Testing"],
      completedTasks: 12,
      totalTasks: 15
    },
    { 
      id: 3, 
      name: "Charlie", 
      role: "Backend Developer", 
      avatar: "https://i.pravatar.cc/40?img=3", 
      lastActive: "2025-06-12T13:15:00Z",
      sections: ["API", "Testing"],
      completedTasks: 8,
      totalTasks: 12
    },
    { 
      id: 4, 
      name: "Dana", 
      role: "UI/UX Designer", 
      avatar: "https://i.pravatar.cc/40?img=4", 
      lastActive: "2025-06-12T10:20:00Z",
      sections: ["UI"],
      completedTasks: 6,
      totalTasks: 10
    }
  ];

  const stats = [
    { label: "Team Members", value: teamMembers.length, icon: Users, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    { 
      label: "Completed Tasks", 
      value: teamMembers.reduce((sum, member) => sum + member.completedTasks, 0), 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
    },
    { 
      label: "Total Tasks", 
      value: teamMembers.reduce((sum, member) => sum + member.totalTasks, 0), 
      icon: Calendar, 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" 
    }
  ];

  const milestones = [
    { id: 1, title: "Project Kickoff", date: "2025-05-01", description: "Initial project kickoff meeting and planning." },
    { id: 2, title: "Design Approval", date: "2025-05-15", description: "Final design approved by stakeholders." },
    { id: 3, title: "Beta Release", date: "2025-06-01", description: "Beta version released for testing." },
    { id: 4, title: "Final Release", date: "2025-06-20", description: "Official final release of the project." }
  ];

  const toggleMemberExpand = (memberId) => {
    setExpandedMemberId(prev => prev === memberId ? null : memberId);
  };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  // Get tasks for a specific team member
  const getMemberTasks = (memberId) => {
    return tasks.filter(task => task.assignee === memberId);
  };

  // Get recently completed tasks for a team member
  const getRecentlyCompletedTasks = (memberId) => {
    return tasks
      .filter(task => task.assignee === memberId && task.status === 'Done')
      .sort((a, b) => new Date(b.completedDate || b.due) - new Date(a.completedDate || a.due))
      .slice(0, 3);
  };

  // Get currently assigned tasks for a team member
  const getCurrentTasks = (memberId) => {
    return tasks
      .filter(task => task.assignee === memberId && task.status !== 'Done')
      .sort((a, b) => new Date(a.due) - new Date(b.due))
      .slice(0, 3);
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    
    return date.toLocaleDateString();
  };

  const getSectionColor = (section) => {
    switch (section) {
      case 'UI':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'API':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Testing':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Team Progress</h2>

      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['Team', 'Milestones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === tab
                ? `border-b-4 border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow`
                : `text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10`
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
                className={`${color} p-4 rounded-lg flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full md:w-auto`}
                title={label}
                tabIndex={0}
                aria-label={`${label}: ${value}`}
              >
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full flex items-center justify-center">
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
          {activeTab === 'Team' && (
            <ul className="space-y-4">
              {teamMembers.map((member) => (
                <li key={member.id}>
                  <div 
                    className={`flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                      expandedMemberId === member.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                    }`}
                    onClick={() => toggleMemberExpand(member.id)}
                  >
                    <img
                      src={member.avatar}
                      alt={`${member.name}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/48?text=User';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Last active: {formatRelativeTime(member.lastActive)}
                          </span>
                          {expandedMemberId === member.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.role}</span>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {member.sections.map(section => (
                          <span 
                            key={section} 
                            className={`text-xs px-2 py-0.5 rounded-full ${getSectionColor(section)}`}
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMemberId === member.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Progress</h4>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {Math.round((member.completedTasks / member.totalTasks) * 100)}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                              style={{ width: `${(member.completedTasks / member.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span>Completed: {member.completedTasks}</span>
                            <span>Total: {member.totalTasks}</span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openMemberModal(member);
                            }}
                            className="w-full py-2 text-sm text-center bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Milestones' && (
            <ul className="space-y-4">
              {milestones.map(({ id, title, date, description }) => (
                <li 
                  key={id} 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Flag size={20} className="text-yellow-600 dark:text-yellow-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    <span className="ml-auto text-sm text-gray-700 dark:text-gray-300">
                      {new Date(date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Team Member Details Modal */}
      <AnimatePresence>
        {modalOpen && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    alt={`${selectedMember.name}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/64?text=User';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedMember.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={18} className="text-green-600 dark:text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recently Completed</h3>
                  </div>
                  <ul className="space-y-2">
                    {getRecentlyCompletedTasks(selectedMember.id).length > 0 ? (
                      getRecentlyCompletedTasks(selectedMember.id).map(task => (
                        <li key={task.id} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{task.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Completed: {task.completedDate || task.due}</div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400 italic">No completed tasks</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={18} className="text-blue-600 dark:text-blue-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Current Tasks</h3>
                  </div>
                  <ul className="space-y-2">
                    {getCurrentTasks(selectedMember.id).length > 0 ? (
                      getCurrentTasks(selectedMember.id).map(task => (
                        <li key={task.id} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{task.title}</div>
                          <div className="flex justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                              task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                              'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400 italic">No current tasks</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Assigned Sections</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMember.sections.map(section => (
                    <span 
                      key={section} 
                      className={`px-3 py-1 rounded-full ${getSectionColor(section)}`}
                    >
                      {section}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Overall Progress</h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMember.completedTasks} of {selectedMember.totalTasks} tasks completed
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {Math.round((selectedMember.completedTasks / selectedMember.totalTasks) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${(selectedMember.completedTasks / selectedMember.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Last active: {formatRelativeTime(selectedMember.lastActive)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
