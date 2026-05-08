export interface Paciente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  edad: number;
  diagnostico: string;
  createdAt: string;
}

export interface PacienteForm {
  nombre: string;
  email: string;
  telefono: string;
  edad: string;
  diagnostico: string;
}
