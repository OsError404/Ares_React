import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { CompanyForm } from '../../components/admin/CompanyForm';
import { EditModal } from '../../components/ui/EditModal';
import toast from 'react-hot-toast';
import type { Company } from '../../types/admin';

export const CompanyManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await api.get('/companies');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete('/companies/' + id);
    },
    onSuccess: () => {
      toast.success('Empresa eliminada exitosamente');
      refetch();
      setDeletingCompany(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar la empresa');
    },
  });

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = (company: Company) => {
    setDeletingCompany(company);
  };

  const confirmDelete = () => {
    if (deletingCompany) {
      deleteMutation.mutate(deletingCompany.id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-600"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Empresa</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                NIT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {companies.map((company: Company) => (
              <tr key={company.id}>
                <td className="whitespace-nowrap px-6 py-4">{company.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{company.nit}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {company.type === 'aseguradora' ? 'Aseguradora' : 'Empresa'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={
                      company.active
                        ? "inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
                        : "inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800"
                    }
                  >
                    {company.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-primary hover:text-primary-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(company)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No hay empresas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
      >
        <CompanyForm
          onClose={handleCloseForm}
          onSuccess={refetch}
          initialData={editingCompany}
        />
      </EditModal>

      {/* Delete Confirmation Modal */}
      {deletingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Confirmar Eliminación
            </h3>
            <p className="mb-4 text-gray-500">
              ¿Está seguro que desea eliminar la empresa "{deletingCompany.name}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingCompany(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};