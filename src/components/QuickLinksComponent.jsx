import React from 'react';
import { Link, ExternalLink, FileText, Calendar, Users, Settings, HelpCircle, Star, Bookmark, Clock } from 'react-feather';

const QuickLinksComponent = () => {
  const links = [
    { icon: <FileText size={14} />, title: 'Documentation', url: '#', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { icon: <Calendar size={14} />, title: 'Schedule', url: '#', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    { icon: <Users size={14} />, title: 'Team', url: '#', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { icon: <Star size={14} />, title: 'Resources', url: '#', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
    { icon: <Bookmark size={14} />, title: 'Bookmarks', url: '#', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
    { icon: <Clock size={14} />, title: 'Recent', url: '#', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
    { icon: <Settings size={14} />, title: 'Settings', url: '#', color: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400' },
    { icon: <HelpCircle size={14} />, title: 'Help', url: '#', color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
  ];

  const recentFiles = [
    { name: 'Project Proposal.pdf', type: 'PDF', date: '2 days ago' },
    { name: 'Meeting Notes.docx', type: 'DOC', date: '3 days ago' },
    { name: 'Budget Forecast.xlsx', type: 'XLS', date: '5 days ago' },
  ];

  return (
    <div className="card h-full">
      <div className="card-header mb-1">
        <h2 className="section-title text-sm">Quick Access</h2>
      </div>

      <div className="p-1">
        <div className="grid grid-cols-4 gap-1 mb-1">
          {links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className={`${link.color} p-1 rounded-md flex flex-col items-center justify-center text-center hover:shadow-sm transition-all`}
            >
              <div className="mb-0.5">{link.icon}</div>
              <span className="text-xs font-medium">{link.title}</span>
            </a>
          ))}
        </div>

        <div className="mb-1">
          <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Recent Files</h3>
          <div className="space-y-1">
            {recentFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-1 bg-white dark:bg-slate-800/50 rounded-md border border-gray-200 dark:border-slate-700/50 hover:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    file.type === 'PDF' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    file.type === 'DOC' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {file.type}
                  </span>
                  <span className="text-xs text-gray-800 dark:text-gray-200">{file.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{file.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">External Links</h3>
          <div className="space-y-1">
            <a 
              href="#" 
              className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/50 rounded-md border border-gray-200 dark:border-slate-700/50 hover:shadow-sm"
            >
              <ExternalLink size={12} className="text-blue-500" />
              <span className="text-xs text-gray-800 dark:text-gray-200">Project Management Tool</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/50 rounded-md border border-gray-200 dark:border-slate-700/50 hover:shadow-sm"
            >
              <ExternalLink size={12} className="text-purple-500" />
              <span className="text-xs text-gray-800 dark:text-gray-200">Design Assets</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/50 rounded-md border border-gray-200 dark:border-slate-700/50 hover:shadow-sm"
            >
              <ExternalLink size={12} className="text-green-500" />
              <span className="text-xs text-gray-800 dark:text-gray-200">Company Wiki</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinksComponent;
