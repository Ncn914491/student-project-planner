import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Calendar, Users, Flag, ChevronDown, ChevronUp, Clock, X, Award, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EnhancedTeamProgress({ tasks = [] }) {
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
      avatar: "https://i.pravatar.cc/150?img=1", 
      lastActive: "2025-06-12T14:30:00Z",
      sections: ["UI", "API", "Testing"],
      completedTasks: 5,
      totalTasks: 8
    },
    { 
      id: 2, 
      name: "Bob", 
      role: "Frontend Developer", 
      avatar: "https://i.pravatar.cc/150?img=2", 
      lastActive: "2025-06-12T16:45:00Z",
      sections: ["UI", "Testing"],
      completedTasks: 12,
      totalTasks: 15
    },
    { 
      id: 3, 
      name: "Charlie", 
      role: "Backend Developer", 
      avatar: "https://i.pravatar.cc/150?img=3", 
      lastActive: "2025-06-12T13:15:00Z",
      sections: ["API", "Testing"],
      completedTasks: 8,
      totalTasks: 12
    }
  ];

  const stats = [
    { label: "Team Members", value: teamMembers.length, icon: Users, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { 
      label: "Completed Tasks", 
      value: teamMembers.reduce((sum, member) => sum + member.completedTasks, 0), 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
    },
    { 
      label: "Total Tasks", 
      value: teamMembers.reduce((sum, member) => sum + member.totalTasks, 0), 
      icon: Calendar, 
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" 
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
        return 'badge-purple';
      case 'API':
        return 'badge-indigo';
      case 'Testing':
        return 'badge-emerald';
      default:
        return 'badge-blue';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="section-title">Team Progress</h2>
      </div>

      <div className="flex space-x-2 mb-5 border-b border-gray-200 dark:border-gray-700">
        {['Team', 'Milestones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === tab
                ? `border-b-2 border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20`
                : `text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10`
            }`}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`${color} p-3 rounded-xl transition-all duration-200 hover:shadow-md flex items-center gap-2`}
            title={label}
            tabIndex={0}
            aria-label={`${label}: ${value}`}
          >
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold">{value}</div>
              <div className="text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'Team' && (
        <ul className="space-y-3">
          {teamMembers.map((member) => (
            <li key={member.id}>
              <div 
                className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  expandedMemberId === member.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => toggleMemberExpand(member.id)}
              >
                <img
                  src={member.avatar}
                  alt={`${member.name}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://via.placeholder.com/40?text=User';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{member.name}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                        {formatRelativeTime(member.lastActive)}
                      </span>
                      {expandedMemberId === member.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Briefcase size={12} />
                      {member.role}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {Math.round((member.completedTasks / member.totalTasks) * 100)}%
                    </span>
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
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {member.sections.map(section => (
                          <span 
                            key={section} 
                            className={`badge ${getSectionColor(section)}`}
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {member.completedTasks} of {member.totalTasks} tasks
                          </span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {Math.round((member.completedTasks / member.totalTasks) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${(member.completedTasks / member.totalTasks) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMemberModal(member);
                        }}
                        className="w-full py-1.5 text-sm text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <ul className="space-y-3">
          {milestones.map(({ id, title, date, description }) => (
            <li 
              key={id} 
              className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Flag size={16} className="text-amber-600 dark:text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                <span className="ml-auto text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">{description}</p>
            </li>
          ))}
        </ul>
      )}
      
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
              className={`bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl shadow-lg ${isDarkMode ? 'dark' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    alt={`${selectedMember.name}'s avatar`}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/56?text=User';
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedMember.name}</h2>
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-blue-600 dark:text-blue-400" />
                      <p className="text-gray-600 dark:text-gray-400">{selectedMember.role}</p>
                    </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recently Completed</h3>
                  </div>
                  <ul className="space-y-2">
                    {getRecentlyCompletedTasks(selectedMember.id).length > 0 ? (
                      getRecentlyCompletedTasks(selectedMember.id).map(task => (
                        <li key={task.id} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{task.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Completed: {task.completedDate || task.due}</div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400 italic">No completed tasks</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-600 dark:text-blue-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Current Tasks</h3>
                  </div>
                  <ul className="space-y-2">
                    {getCurrentTasks(selectedMember.id).length > 0 ? (
                      getCurrentTasks(selectedMember.id).map(task => (
                        <li key={task.id} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{task.title}</div>
                          <div className="flex justify-between">
                            <span className={`badge ${
                              task.priority === 'high' ? 'badge-red' :
                              task.priority === 'medium' ? 'badge-yellow' :
                              'badge-blue'
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
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Assigned Sections</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMember.sections.map(section => (
                    <span 
                      key={section} 
                      className={`badge ${getSectionColor(section)}`}
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
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${(selectedMember.completedTasks / selectedMember.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
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
