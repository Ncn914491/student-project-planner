import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle, Calendar, Users, Flag, ChevronDown, ChevronUp, Clock, X, Award, Briefcase, Zap, BarChart2, Activity, TrendingUp, Timer, Shield, AlertTriangle, AlertCircle, HelpCircle, FileText, Server } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export default function EnhancedTeamProgress({ tasks = [] }) {
  const [activeTab, setActiveTab] = useState('Team');
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [newRisk, setNewRisk] = useState({ title: '', description: '', priority: 'medium' });
  const { isDarkMode } = useTheme();

  const teamMembers = [
    {
      id: 1,
      name: "Alice",
      role: "Project Manager",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastActive: "2025-06-12T14:30:00Z",
      sections: ["UI", "API", "Testing", "Documentation"],
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
    },
    {
      id: 4,
      name: "Diana",
      role: "QA Tester",
      avatar: "https://i.pravatar.cc/150?img=5",
      lastActive: "2025-06-12T15:20:00Z",
      sections: ["Testing", "Documentation"],
      completedTasks: 14,
      totalTasks: 18
    },
    {
      id: 5,
      name: "Ethan",
      role: "SOC Analyst",
      avatar: "https://i.pravatar.cc/150?img=7",
      lastActive: "2025-06-12T11:45:00Z",
      sections: ["Security", "API"],
      completedTasks: 6,
      totalTasks: 9
    },
    {
      id: 6,
      name: "Fiona",
      role: "DevOps Engineer",
      avatar: "https://i.pravatar.cc/150?img=9",
      lastActive: "2025-06-12T10:30:00Z",
      sections: ["Infrastructure", "Security"],
      completedTasks: 7,
      totalTasks: 10
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
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';

      // For dates within a month, use relative time
      const now = new Date();
      const diffInDays = Math.abs(Math.floor((now - date) / (1000 * 60 * 60 * 24)));

      if (diffInDays < 30) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        // For dates further away, use a more readable format
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getSectionColor = (section) => {
    switch (section) {
      case 'UI':
        return 'badge-purple';
      case 'API':
        return 'badge-indigo';
      case 'Testing':
        return 'badge-emerald';
      case 'Documentation':
        return 'badge-blue';
      case 'Security':
        return 'badge-red';
      case 'Infrastructure':
        return 'badge-yellow';
      default:
        return 'badge-blue';
    }
  };

  return (
    <div className="card">
      <div className="card-header mb-1">
        <h2 className="section-title text-sm">Team Progress</h2>
      </div>

      <div className="flex space-x-1 mb-1 border-b border-gray-200 dark:border-gray-700">
        {['Team', 'Milestones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-1 text-xs font-medium rounded-t-md transition-colors focus:outline-none ${
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`${color} p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 border border-gray-100 dark:border-gray-700/30`}
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
        <div className="flex flex-col h-full">
          <div className="flex flex-wrap gap-1 mb-1">
            {/* Risks & Blockers Section */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-md p-1 border border-gray-200 dark:border-slate-700/50 shadow-sm flex-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield size={16} className="text-red-500 dark:text-red-400" />
                  Risks & Blockers
                </h3>
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full">
                  2 Active
                </span>
              </div>

              <ul className="space-y-1">
                <li className="p-1 bg-white dark:bg-slate-700/30 rounded-md border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-lg">
                      <AlertTriangle size={16} className="text-amber-500 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-slate-200">API Integration Delay</h4>
                        <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">Medium</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-400 mt-1.5">Third-party API documentation is incomplete, causing integration delays.</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500 dark:text-slate-500 flex items-center gap-1">
                          <User size={12} />
                          Reported by: Bob
                        </span>
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                          <HelpCircle size={12} />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              {!showRiskForm ? (
                <button
                  onClick={() => setShowRiskForm(true)}
                  className="w-full mt-2 py-1.5 text-xs text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 hover:shadow-sm active:scale-98 transition-all"
                >
                  + Report New Issue
                </button>
              ) : (
                <div className="mt-2 p-1 bg-white dark:bg-slate-700/30 rounded-md border border-gray-100 dark:border-slate-700/50 shadow-sm">
                  <input
                    type="text"
                    placeholder="Issue title"
                    className="w-full p-1 mb-1 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md"
                    value={newRisk.title}
                    onChange={(e) => setNewRisk({...newRisk, title: e.target.value})}
                  />
                  <textarea
                    placeholder="Brief description"
                    className="w-full p-1 mb-1 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md"
                    rows="2"
                    value={newRisk.description}
                    onChange={(e) => setNewRisk({...newRisk, description: e.target.value})}
                  />
                  <div className="flex justify-between items-center mb-1">
                    <select
                      className="p-1 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md"
                      value={newRisk.priority}
                      onChange={(e) => setNewRisk({...newRisk, priority: e.target.value})}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        // Here you would normally add the risk to your data
                        console.log('New risk:', newRisk);
                        setNewRisk({ title: '', description: '', priority: 'medium' });
                        setShowRiskForm(false);
                      }}
                      className="flex-1 py-1 text-xs text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md hover:shadow-sm active:scale-98 transition-all"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowRiskForm(false)}
                      className="flex-1 py-1 text-xs text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md hover:shadow-sm active:scale-98 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Task Efficiency Section */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-md p-1 border border-gray-200 dark:border-slate-700/50 shadow-sm flex-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity size={16} className="text-blue-500 dark:text-blue-400" />
                  Task Efficiency
                </h3>
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp size={12} />
                  +15% this week
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-1">
                <div className="bg-white dark:bg-slate-700/30 p-1 rounded-md border border-gray-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[60px]">
                  <div className="text-lg font-bold text-gray-800 dark:text-slate-200">12</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 text-center">Tasks</div>
                </div>

                <div className="bg-white dark:bg-slate-700/30 p-1 rounded-md border border-gray-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[60px]">
                  <div className="text-lg font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1">
                    <Timer size={14} className="text-blue-500" />
                    2.3
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 text-center">Days Avg.</div>
                </div>

                <div className="bg-white dark:bg-slate-700/30 p-1 rounded-md border border-gray-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center flex-1 min-w-[60px]">
                  <div className="text-lg font-bold text-gray-800 dark:text-slate-200">85%</div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 text-center">On-Time</div>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Section Performance</h4>
                {[
                  { section: 'UI', completed: 8, total: 10, icon: <Zap size={14} className="text-purple-500" /> },
                  { section: 'API', completed: 6, total: 8, icon: <BarChart2 size={14} className="text-indigo-500" /> },
                  { section: 'Testing', completed: 4, total: 7, icon: <CheckCircle size={14} className="text-emerald-500" /> },
                  { section: 'Documentation', completed: 5, total: 6, icon: <FileText size={14} className="text-blue-500" /> },
                  { section: 'Security', completed: 3, total: 5, icon: <Shield size={14} className="text-red-500" /> },
                  { section: 'Infrastructure', completed: 4, total: 6, icon: <Server size={14} className="text-amber-500" /> }
                ].map((item) => (
                  <div key={item.section} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 w-16">
                      {item.icon}
                      <span className="text-xs font-medium text-gray-700 dark:text-slate-300">{item.section}</span>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ease-in-out ${
                          item.section === 'UI' ? 'bg-purple-500' :
                          item.section === 'API' ? 'bg-indigo-500' :
                          item.section === 'Testing' ? 'bg-emerald-500' :
                          item.section === 'Documentation' ? 'bg-blue-500' :
                          item.section === 'Security' ? 'bg-red-500' :
                          item.section === 'Infrastructure' ? 'bg-amber-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${Math.round((item.completed / item.total) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300 w-12 text-right">
                      {Math.round((item.completed / item.total) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Team Members</h3>
            <ul className="space-y-1">
              {teamMembers.map((member) => (
                <li key={member.id}>
                  <div
                    className={`flex items-center gap-1 p-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full ${
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
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
          </div>
        </div>
      )}

      {activeTab === 'Milestones' && (
        <ul className="space-y-4">
          {milestones.map(({ id, title, date, description }) => (
            <li
              key={id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
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
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 ${isDarkMode ? 'dark' : ''}`}
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
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-500" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Recently Completed</h3>
                  </div>
                  <ul className="space-y-2">
                    {getRecentlyCompletedTasks(selectedMember.id).length > 0 ? (
                      getRecentlyCompletedTasks(selectedMember.id).map(task => (
                        <li key={task.id} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">{task.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Completed: {task.completedDate ? format(new Date(task.completedDate), 'MMM d, yyyy') : (task.due ? format(new Date(task.due), 'MMM d, yyyy') : 'Not set')}</div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 dark:text-gray-400 italic">No completed tasks</li>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-sm">
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due ? format(new Date(task.due), 'MMM d, yyyy') : 'Not set'}</span>
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
