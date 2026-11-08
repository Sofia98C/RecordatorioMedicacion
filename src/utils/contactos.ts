export type ContactoAgenda = {
  id: string;
  nombre: string;
  telefono?: string;
};

export function filtrarContactos(lista: ContactoAgenda[], texto: string): ContactoAgenda[] {
  const busqueda = texto.trim().toLowerCase();
  if (!busqueda) return lista;
  return lista.filter((c) => c.nombre.toLowerCase().includes(busqueda));
}
