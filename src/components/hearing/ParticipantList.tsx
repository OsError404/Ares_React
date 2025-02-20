import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { ParticipantModal } from './ParticipantModal';
import type { Participant } from '../../types/hearing';
import type { ParticipantFormSchema } from '../../schemas/hearing';

export const ParticipantList: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  const handleAddParticipant = (data: ParticipantFormSchema) => {
    setParticipants([...participants, { ...data, id: Date.now().toString() }]);
  };

  const handleEditParticipant = (data: ParticipantFormSchema) => {
    if (editingParticipant) {
      setParticipants(
        participants.map((p) =>
          p.id === editingParticipant.id ? { ...data, id: p.id } : p
        )
      );
      setEditingParticipant(null);
    }
  };

  const handleDeleteParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Participantes</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Participante</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {participants.map((participant) => (
              <motion.tr
                key={participant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="whitespace-nowrap px-6 py-4">{participant.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{participant.documentId}</td>
                <td className="whitespace-nowrap px-6 py-4">{participant.role}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingParticipant(participant);
                        setIsModalOpen(true);
                      }}
                      className="text-primary hover:text-primary-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteParticipant(participant.id)}
                      className="text-error hover:text-error/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingParticipant(null);
        }}
        onSubmit={editingParticipant ? handleEditParticipant : handleAddParticipant}
        initialData={editingParticipant || undefined}
      />
    </div>
  );
};