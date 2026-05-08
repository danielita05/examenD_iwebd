import axios from 'axios';
import type { Paciente, PacienteForm } from '../types/Paciente';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

function toPayload(form: PacienteForm) {
  return {
    nombre: form.nombre.trim(),
    email: form.email.trim(),
    telefono: form.telefono.trim(),
    edad: Number(form.edad),
    diagnostico: form.diagnostico.trim(),
  };
}

export async function getPacientes(): Promise<Paciente[]> {
  const { data } = await api.get('/pacientes');
  return data;
}

export async function createPaciente(form: PacienteForm): Promise<Paciente> {
  const { data } = await api.post('/pacientes', toPayload(form));
  return data;
}

export async function updatePaciente(id: number, form: PacienteForm): Promise<Paciente> {
  const { data } = await api.put(`/pacientes/${id}`, toPayload(form));
  return data;
}

export async function deletePaciente(id: number): Promise<void> {
  await api.delete(`/pacientes/${id}`);
}
