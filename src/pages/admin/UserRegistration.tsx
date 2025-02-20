import React from 'react';
import { motion } from 'framer-motion';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const UserRegistration = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Registro de Usuario
        </h1>
      </div>

      <RegisterForm />
    </motion.div>
  );
};