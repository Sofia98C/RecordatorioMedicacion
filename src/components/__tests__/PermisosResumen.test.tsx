import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PermisosResumen from '../PermisosResumen';

describe('PermisosResumen', () => {
  it('muestra los tres estados de permiso', () => {
    render(
      <PermisosResumen
        estados={{
          camara: 'concedido',
          galeria: 'concedido',
          ubicacion: 'denegado',
          contactos: 'pendiente',
          calendario: 'pendiente',
        }}
        recursos={['camara', 'ubicacion', 'contactos']}
      />
    );

    expect(screen.getByText('Cámara')).toBeTruthy();
    expect(screen.getByText('✅ Concedido')).toBeTruthy();
    expect(screen.getByText('⛔ Denegado')).toBeTruthy();
    expect(screen.getByText('⏳ Pendiente')).toBeTruthy();
    expect(screen.queryByText('Calendario')).toBeNull();
  });
});
