import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Edit2, X, Check } from 'lucide-react';
import { api } from '../lib/api';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { HearingDetailsModal } from '../components/hearing/HearingDetailsModal';
import { ApproveHearingModal } from '../components/hearing/ApproveHearingModal';
import toast from 'react-hot-toast';

interface HearingRequest {
  _id: string;
  type: 'Transito' | 'Otros';
  hearingDateTime: string;
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
  claimAmount: number;
  description: string;
}

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  aprobada: 'bg-green-100 text-green-800',
  rechazada: 'bg-red-100 text-red-800',
  cancelada: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
};

export const AudienciasSolicitadas = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    type: '',
  });
  const [selectedHearing, setSelectedHearing] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const { data: hearingRequests, isLoading, refetch } = useQuery({
    queryKey: ['hearingRequests', filters],
    queryFn: async () => {
      const { data } = await api.get('/hearing-requests', { params: filters });
      return data;
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (id: string) => {
    setSelectedHearing(id);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    // Implementar edición
    console.log('Editar:', id);
  };

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/hearing-requests/${id}/cancel`);
      toast.success('Audiencia cancelada exitosamente');
      refetch();
    } catch (error) {
      console.error('Error al cancelar:', error);
    }
  };

  const handleApproveClick = (id: string) => {
    setSelectedHearing(id);
    setIsApproveModalOpen(true);
  };

  const handleApprove = async (locationId: string, roomId: string) => {
    if (!selectedHearing) return;

    try {
      await api.patch(`/hearing-requests/${selectedHearing}/approve`, {
        locationId,
        roomId,
      });
      toast.success('Audiencia aprobada y sala asignada exitosamente');
      refetch();
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error('Error al aprobar:', error);
      toast.error('Error al aprobar la audiencia');
    }
  };

  const handleReject = async () => {
    if (!selectedHearing) return;

    try {
      await api.patch(`/hearing-requests/${selectedHearing}/reject`);
      toast.success('Audiencia rechazada exitosamente');
      refetch();
      setIsDetailsModalOpen(false);
    } catch (error) {
      console.error('Error al rechazar:', error);
      toast.error('Error al rechazar la audiencia');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Audiencias Solicitadas
        </h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Select
            label="Estado"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </Select>

          <Select
            label="Tipo"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">Todos los tipos</option>
            <option value="Transito">Tránsito</option>
            <option value="Otros">Otros</option>
          </Select>

          <Input
            type="date"
            label="Fecha inicio"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <Input
            type="date"
            label="Fecha fin"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {hearingRequests?.map((request: HearingRequest) => (
                <tr key={request._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {format(new Date(request.hearingDateTime), 'PPP p', { locale: es })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {request.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    ${request.claimAmount.toLocaleString('es-CO')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(request._id)}
                        className="text-primary hover:text-primary-600"
                        title="Ver detalles"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {request.status === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleEdit(request._id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Editar"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleCancel(request._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Cancelar"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleApproveClick(request._id)}
                            className="text-green-600 hover:text-green-700"
                            title="Aprobar"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!hearingRequests || hearingRequests.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay solicitudes de audiencias
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedHearing && (
        <>
          <HearingDetailsModal
            hearingId={selectedHearing}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedHearing(null);
            }}
            onApprove={() => {
              setIsDetailsModalOpen(false);
              setIsApproveModalOpen(true);
            }}
            onReject={handleReject}
          />

          <ApproveHearingModal
            isOpen={isApproveModalOpen}
            onClose={() => {
              setIsApproveModalOpen(false);
              setSelectedHearing(null);
            }}
            onApprove={handleApprove}
            hearingDateTime={
              hearingRequests?.find((h: HearingRequest) => h._id === selectedHearing)?.hearingDateTime || ''
            }
          />
        </>
      )}
    </motion.div>
  );
};