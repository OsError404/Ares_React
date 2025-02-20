import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { SignatureUploadForm } from '../../components/admin/SignatureUploadForm';

export const SignatureManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: signatures = [], isLoading, refetch } = useQuery({
    queryKey: ['signatures'],
    queryFn: async () => {
      const { data } = await api.get('/signatures');
      return data;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Firmas Digitales</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-600"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Firma</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {signatures.map((signature: any) => (
          <div
            key={signature._id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="mb-4">
              <img
                src={signature.url}
                alt={signature.name}
                className="mx-auto h-32 w-auto object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{signature.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Agregada el {new Date(signature.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Nueva Firma Digital</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <SignatureUploadForm
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                  refetch();
                  setIsFormOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};