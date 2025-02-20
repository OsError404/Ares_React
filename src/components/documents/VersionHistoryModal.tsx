import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Clock, User } from 'lucide-react';
import { api } from '../../lib/api';

interface Version {
  content: string;
  modifiedBy: {
    name: string;
  };
  modifiedAt: string;
  version: number;
}

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectVersion: (version: Version) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  documentId,
  isOpen,
  onClose,
  onSelectVersion,
}) => {
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['document-history', documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/${documentId}/history`);
      return data;
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            Historial de Versiones
          </h2>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {versions.map((version: Version) => (
                <button
                  key={version.version}
                  onClick={() => onSelectVersion(version)}
                  className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      Versión {version.version}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{version.modifiedBy.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>
                        {format(new Date(version.modifiedAt), 'PPP p', { locale: es })}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};