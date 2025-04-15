import React, { useEffect, useState } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';

const deadlines = [
  { id: 1, title: "Project Proposal", dueDate: "2025-06-15" },
  { id: 2, title: "Design Review", dueDate: "2025-06-20" },
  { id: 3, title: "Final Submission", dueDate: "2025-07-01" }
];

function daysLeft(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function DeadlineCountdown() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar size={24} />
        Upcoming Deadlines
      </h2>

      <ul className="space-y-4">
        {deadlines.map(({ id, title, dueDate }) => {
          const left = daysLeft(dueDate);
          const isUrgent = left <= 7;
          const progressPercent = Math.min(100, Math.max(0, ((30 - left) / 30) * 100));

          return (
            <li
              key={id}
              className={`p-4 rounded-lg border ${
                isUrgent ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              } shadow-md`}
              title={`${title} deadline on ${new Date(dueDate).toLocaleDateString()}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">{title}</span>
                  {isUrgent && (
                    <AlertTriangle size={18} className="text-red-600" title="Urgent deadline approaching" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{new Date(dueDate).toLocaleDateString()}</span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-in-out ${
                    isUrgent ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="mt-1 text-xs text-gray-600">
                {left > 0 ? `${left} day${left !== 1 ? 's' : ''} left` : 'Deadline passed'}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
