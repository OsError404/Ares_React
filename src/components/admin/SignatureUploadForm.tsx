import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const signatureSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
});

type SignatureFormData = z.infer<typeof signatureSchema>;

interface SignatureUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const SignatureUploadForm: React.FC<SignatureUploadFormProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SignatureFormData>({
    resolver: zodResolver(signatureSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no puede exceder 2MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      if (!file.type.startsWith('image/png')) {
        toast.error('Solo se permiten imágenes PNG');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignatureFormData) => {
    if (!selectedFile) {
      toast.error('Seleccione una imagen de firma');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('signature', selectedFile);

      await api.post('/signatures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Firma registrada exitosamente');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al registrar firma:', error);
      toast.error(error.response?.data?.message || 'Error al registrar la firma');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre de la Firma"
          {...register('name')}
          error={errors.name?.message}
          autoFocus
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imagen de Firma
          </label>
          <div className="flex flex-col items-center space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleFileChange}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="flex cursor-pointer flex-col items-center space-y-2 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'Seleccionar imagen PNG'}
              </span>
            </label>

            {previewUrl && (
              <div className="rounded-lg border p-4">
                <img
                  src={previewUrl}
                  alt="Vista previa de firma"
                  className="max-h-32 w-auto"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Máximo 2MB. Solo imágenes PNG con fondo transparente.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading || !selectedFile || !isDirty}
            className="relative rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
            <span className={isUploading ? 'opacity-0' : ''}>
              Registrar Firma
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};