
import React from 'react';
import { AgentRole } from '../types';

interface AgentAvatarProps {
  role: AgentRole;
  isSpeaking?: boolean;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ role, isSpeaking }) => {
  const getStyles = () => {
    switch (role) {
      case AgentRole.ARCHITECT:
        return {
          bg: 'bg-indigo-600 dark:bg-indigo-500',
          icon: '🏗️',
          label: 'El Arquitecto',
          textColor: 'text-indigo-600 dark:text-indigo-400'
        };
      case AgentRole.SKEPTIC:
        return {
          bg: 'bg-rose-600 dark:bg-rose-500',
          icon: '🧐',
          label: 'El Escéptico',
          textColor: 'text-rose-600 dark:text-rose-400'
        };
      default:
        return {
          bg: 'bg-slate-700 dark:bg-slate-600',
          icon: '⚖️',
          label: 'Moderador',
          textColor: 'text-slate-700 dark:text-slate-300'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center text-3xl shadow-lg border-4 ${isSpeaking ? 'border-white dark:border-indigo-400 animate-pulse' : 'border-transparent'} transition-all duration-300`}>
        {styles.icon}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${styles.textColor} transition-colors`}>{styles.label}</span>
    </div>
  );
};

export default AgentAvatar;
