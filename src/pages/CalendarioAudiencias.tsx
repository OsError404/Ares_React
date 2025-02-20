import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { CurrentHearingsCalendar } from '../components/calendar/CurrentHearingsCalendar';
import { ScheduledHearingsCalendar } from '../components/calendar/ScheduledHearingsCalendar';

export const CalendarioAudiencias = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'scheduled'>('current');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Calendario de Audiencias
        </h1>
        <div className="flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            } rounded-l-lg`}
          >
            <Clock className="h-4 w-4" />
            <span>En Curso</span>
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'scheduled'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            } rounded-r-lg`}
          >
            <Calendar className="h-4 w-4" />
            <span>Agendadas</span>
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <CurrentHearingsCalendar />
      ) : (
        <ScheduledHearingsCalendar />
      )}
    </motion.div>
  );
};