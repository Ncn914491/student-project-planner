import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Star, TrendingUp } from 'lucide-react';

export default function TeamProgress({ projectId }) {
  const [teamData, setTeamData] = useState(null);
  const [selectedView, setSelectedView] = useState('contributions');

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const { team } = await import('../data/team');
        setTeamData({
          members: team.map(member => ({
            ...member,
            completedTasks: member.tasksCompleted,
            isOnline: true
          })),
          milestones: []
        });
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };

    loadTeamData();
  }, [projectId]);

  if (!teamData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const renderContributions = () => (
    <div className="space-y-4">
      {teamData.members.map((member) => (
        <div key={member.id} className="flex items-center gap-4">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full"
            />
            {member.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">{member.name}</span>
              <span className="text-sm text-gray-500">{member.role}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${member.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{member.completedTasks}</div>
            <div className="text-xs text-gray-500">tasks</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4">
      {teamData.milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className="relative flex items-center gap-4 pb-4"
        >
          <div className="absolute left-4 h-full w-0.5 bg-gray-200" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
            ${milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            <Star size={16} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{milestone.title}</h3>
            <p className="text-sm text-gray-500">{milestone.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs font-medium text-gray-500">
                {milestone.dueDate}
              </div>
              {milestone.completed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Team Progress</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('contributions')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
              ${selectedView === 'contributions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Users size={16} className="mr-1.5" />
            Contributions
          </button>
          <button
            onClick={() => setSelectedView('milestones')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
              ${selectedView === 'milestones'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Award size={16} className="mr-1.5" />
            Milestones
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Team Members</div>
          <div className="text-2xl font-semibold text-gray-900">
            {teamData.members.length}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Completed Tasks</div>
          <div className="text-2xl font-semibold text-gray-900">
            {teamData.members.reduce((sum, m) => sum + m.completedTasks, 0)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Overall Progress</div>
          <div className="flex items-center">
            <div className="text-2xl font-semibold text-gray-900">
              {Math.round(
                (teamData.members.reduce((sum, m) => sum + m.progress, 0) /
                  teamData.members.length)
              )}%
            </div>
            <TrendingUp size={20} className="ml-2 text-green-500" />
          </div>
        </div>
      </div>

      {selectedView === 'contributions' ? renderContributions() : renderMilestones()}
    </motion.div>
  );
}
