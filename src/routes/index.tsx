import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { SolicitarAudiencia } from '../pages/SolicitarAudiencia';
import { AudienciasSolicitadas } from '../pages/AudienciasSolicitadas';
import { NotificacionAudiencias } from '../pages/NotificacionAudiencias';
import { ControlSeguimiento } from '../pages/ControlSeguimiento';
import { AdminLayout } from '../components/admin/AdminLayout';
import { UserManagement } from '../pages/admin/UserManagement';
import { UserRegistration } from '../pages/admin/UserRegistration';
import { CompanyManagement } from '../pages/admin/CompanyManagement';
import { LocationManagement } from '../pages/admin/LocationManagement';
import { RoomManagement } from '../pages/admin/RoomManagement';
import { HolidayManagement } from '../pages/admin/HolidayManagement';
import { SignatureManagement } from '../pages/admin/SignatureManagement';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Navigate to="/solicitar" replace />} />
        <Route path="/solicitar" element={<SolicitarAudiencia />} />
        <Route path="/solicitadas" element={<AudienciasSolicitadas />} />
        <Route path="/notificaciones" element={<NotificacionAudiencias />} />
        <Route path="/seguimiento" element={<ControlSeguimiento />} />
        
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/usuarios" replace />} />
            <Route path="usuarios" element={<UserManagement />} />
            <Route path="usuarios/registro" element={<UserRegistration />} />
            <Route path="empresas" element={<CompanyManagement />} />
            <Route path="sedes" element={<LocationManagement />} />
            <Route path="salas" element={<RoomManagement />} />
            <Route path="festivos" element={<HolidayManagement />} />
            <Route path="firmas" element={<SignatureManagement />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};