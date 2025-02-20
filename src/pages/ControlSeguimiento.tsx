import React from 'react';
import { motion } from 'framer-motion';

export const ControlSeguimiento = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900">
        Control y Seguimiento
      </h1>
      {/* Dashboard implementation will be added in the next step */}
    </motion.div>
  );
};