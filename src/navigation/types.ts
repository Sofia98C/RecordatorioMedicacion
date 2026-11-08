export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Home: undefined;
  AltaMedicacion: { fotoUri?: string } | undefined; 
  Camara: undefined;
  DetalleMedicacion: { id: string };                
  Contactos: { medicacionId: string };              
};

export type Usuario = {
  usuario: string;
  password: string;
};

export type Farmacia = {
  direccion: string;
  latitud?: number;
  longitud?: number;
  origen: 'gps' | 'manual';
};

export type ContactoAsociado = {
  nombre: string;
  telefono?: string;
  origen: 'agenda' | 'manual';
};

export type Medicacion = {
  id: string;
  nombre: string;
  hora: string;
  fotoUri?: string;
  farmacia?: Farmacia;
  contacto?: ContactoAsociado;
  eventoCalendarioId?: string; 
};
