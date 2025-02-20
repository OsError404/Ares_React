import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HearingTypeSelect } from '../components/hearing/HearingTypeSelect';
import { HearingForm } from '../components/hearing/HearingForm';
import { TransitHearingForm } from '../components/hearing/TransitHearingForm';
import type { HearingType } from '../types/hearing';

export const SolicitarAudiencia = () => {
  const [hearingType, setHearingType] = useState<HearingType | ''>('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Solicitar Audiencia
        </h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="max-w-3xl space-y-8">
          <HearingTypeSelect
            value={hearingType}
            onChange={setHearingType}
          />

          <AnimatePresence mode="wait">
            {hearingType === 'Transito' ? <TransitHearingForm /> : hearingType === 'Otros' ? <HearingForm /> : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};