import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import MedicacionItem from '../MedicacionItem';

const medicacionDePrueba = { id: '1', nombre: 'Ibuprofeno 400mg', hora: '08:00hs' };

describe('MedicacionItem', () => {
  it('renderiza el nombre del medicamento', () => {
    render(<MedicacionItem medicacion={medicacionDePrueba} onEliminar={jest.fn()} />);
    expect(screen.getByText(/Ibuprofeno 400mg/)).toBeTruthy();
  });

  it('renderiza la hora del recordatorio', () => {
    render(<MedicacionItem medicacion={medicacionDePrueba} onEliminar={jest.fn()} />);
    expect(screen.getByText('08:00hs')).toBeTruthy();
  });

  it('llama a onEliminar con el id correcto al tocar el botón', () => {
    const onEliminar = jest.fn();
    render(<MedicacionItem medicacion={medicacionDePrueba} onEliminar={onEliminar} />);

    fireEvent.press(screen.getByTestId('eliminar-button'));

    expect(onEliminar).toHaveBeenCalledTimes(1);
    expect(onEliminar).toHaveBeenCalledWith('1');
  });
});