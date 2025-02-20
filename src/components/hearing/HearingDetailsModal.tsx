import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, Download, Eye, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  filename: string;
  uploadedAt: string;
  uploadedBy: {
    name: string;
  };
}

interface HearingDetailsModalProps {
  hearingId: string;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const HearingDetailsModal: React.FC<HearingDetailsModalProps> = ({
  hearingId,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');

  const { data: hearing, isLoading: isLoadingHearing } = useQuery({
    queryKey: ['hearing', hearingId],
    queryFn: async () => {
      const { data } = await api.get(`/hearing-requests/${hearingId}`);
      return data;
    },
    enabled: isOpen,
  });

  const { data: documents = [], refetch: refetchDocuments } = useQuery({
    queryKey: ['hearing-documents', hearingId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/hearing/${hearingId}`);
      return data;
    },
    enabled: isOpen,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !uploadTitle) return;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle);
      formData.append('hearingId', hearingId);

      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast.success('Documento subido exitosamente');
      setSelectedFile(null);
      setUploadTitle('');
      refetchDocuments();
    },
    onError: () => {
      toast.error('Error al subir el documento');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('El archivo no puede exceder 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadTitle.trim()) {
      toast.error('Ingrese un título para el documento');
      return;
    }
    uploadMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalles de la Audiencia
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isLoadingHearing ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : hearing ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Fecha y Hora</p>
                    <p>{format(new Date(hearing.hearingDateTime), 'PPP p', { locale: es })}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <p>{hearing.address}</p>
                    <p>{hearing.city}, {hearing.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Monto de Reclamación</p>
                    <p>${hearing.claimAmount.toLocaleString('es-CO')}</p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <p className="font-medium">Participantes</p>
                  </div>
                  <div className="ml-7 space-y-1">
                    {hearing.participants.map((participant: any) => (
                      <p key={participant.id}>
                        {participant.name} - {participant.role}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 font-medium text-gray-900">Documentos</h3>
                  
                  <div className="mb-4 space-y-2">
                    {documents.map((doc: Document) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(doc.uploadedAt), 'Pp', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(`/api/documents/${doc.id}/view`, '_blank')}
                            className="rounded p-1 text-gray-500 hover:bg-gray-200"
                            title="Ver documento"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/api/documents/${doc.id}/download`, '_blank')}
                            className="rounded p-1 text-gray-500 hover:bg-gray-200"
                            title="Descargar documento"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Título del documento"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{selectedFile ? selectedFile.name : 'Seleccionar PDF'}</span>
                      </label>
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile || !uploadTitle || uploadMutation.isLoading}
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-600 disabled:opacity-50"
                      >
                        {uploadMutation.isLoading ? 'Subiendo...' : 'Subir'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Máximo 5MB. Solo archivos PDF.
                    </p>
                  </div>
                </div>

                {hearing.status === 'pendiente' && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onReject}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={onApprove}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                    >
                      Aprobar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No se encontró la audiencia</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};