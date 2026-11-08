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

  it('muestra la foto cuando la medicación tiene fotoUri', () => {
    const conFoto = { ...medicacionDePrueba, fotoUri: 'file:///fotos/ibuprofeno.jpg' };
    render(<MedicacionItem medicacion={conFoto} onEliminar={jest.fn()} />);
    expect(screen.getByTestId('medicacion-foto')).toBeTruthy();
  });

  it('no muestra foto cuando la medicación no tiene', () => {
    render(<MedicacionItem medicacion={medicacionDePrueba} onEliminar={jest.fn()} />);
    expect(screen.queryByTestId('medicacion-foto')).toBeNull();
  });

  it('llama a onPress para abrir el detalle', () => {
    const onPress = jest.fn();
    render(<MedicacionItem medicacion={medicacionDePrueba} onEliminar={jest.fn()} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('medicacion-detalle'));
    expect(onPress).toHaveBeenCalledWith('1');
  });

  it('muestra la farmacia y el contacto asociados', () => {
    const completa = {
      ...medicacionDePrueba,
      farmacia: { direccion: 'Av. Mate de Luna 1234', origen: 'manual' as const },
      contacto: { nombre: 'Dra. Gómez', origen: 'agenda' as const },
    };
    render(<MedicacionItem medicacion={completa} onEliminar={jest.fn()} />);
    expect(screen.getByText(/Av. Mate de Luna 1234/)).toBeTruthy();
    expect(screen.getByText(/Dra. Gómez/)).toBeTruthy();
  });
});
