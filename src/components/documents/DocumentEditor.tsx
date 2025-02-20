import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Save, History, FileText, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { VersionHistoryModal } from './VersionHistoryModal';
import toast from 'react-hot-toast';

interface DocumentEditorProps {
  documentId: string;
  onSave?: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  documentId,
  onSave 
}) => {
  const [content, setContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/${documentId}`);
      return data;
    },
  });

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  const updateMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const { data } = await api.put(`/documents/${documentId}`, {
        content: newContent,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Documento guardado exitosamente');
      setIsEditing(false);
      onSave?.();
    },
    onError: () => {
      toast.error('Error al guardar el documento');
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.put(`/documents/${documentId}`, {
        content,
        status: 'finalizado',
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Documento finalizado exitosamente');
      onSave?.();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium text-gray-900">
            {document.title}
          </h2>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
            v{document.version}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            <span>Historial</span>
          </button>

          {document.status === 'borrador' && (
            <>
              <button
                onClick={() => updateMutation.mutate(content)}
                disabled={!isEditing}
                className="flex items-center space-x-2 rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-50 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>

              <button
                onClick={() => finalizeMutation.mutate()}
                className="flex items-center space-x-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
              >
                <Check className="h-4 w-4" />
                <span>Finalizar</span>
              </button>
            </>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg border bg-white p-4 shadow-sm"
      >
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsEditing(true);
          }}
          disabled={document.status === 'finalizado'}
          className="min-h-[400px] w-full resize-none rounded-lg border-0 bg-transparent p-0 text-gray-900 focus:ring-0"
          placeholder="Ingrese el contenido del documento..."
        />
      </motion.div>

      <VersionHistoryModal
        documentId={documentId}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectVersion={(version) => {
          setContent(version.content);
          setIsEditing(true);
          setShowHistory(false);
        }}
      />
    </div>
  );
};