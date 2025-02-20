import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select } from '../ui/Select';
import type { HearingType } from '../../types/hearing';

interface HearingTypeSelectProps {
  value: HearingType;
  onChange: (value: HearingType) => void;
  error?: string;
}

export const HearingTypeSelect: React.FC<HearingTypeSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <Select
          label="Tipo de Audiencia"
          value={value}
          onChange={(e) => onChange(e.target.value as HearingType)}
          error={error}
          className="text-lg font-medium"
        >
          <option value="">Seleccione un tipo</option>
          <option value="Transito">Tránsito</option>
          <option value="Otros">Otros temas</option>
        </Select>
      </motion.div>
    </AnimatePresence>
  );
};