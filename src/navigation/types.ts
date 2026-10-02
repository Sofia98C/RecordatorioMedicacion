export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Home: undefined;
  AltaMedicacion: undefined;
};

export type Usuario = {
    usuario: string;
    password: string;
};

export type Medicacion = {
    id: string;
    nombre: string;
    hora: string;
}