import { useState, useEffect, useCallback } from 'react';
import { FiActivity, FiUsers } from 'react-icons/fi';
import PacienteForm from './components/PacienteForm';
import PacienteTable from './components/PacienteTable';
import Toast from './components/Toast';
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from './services/api';
import type { Paciente, PacienteForm as FormData } from './types/Paciente';
import './App.css';

function App() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [editing, setEditing] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formKey, setFormKey] = useState(0);

  const fetchPacientes = useCallback(async () => {
    try {
      const data = await getPacientes();
      setPacientes(data);
    } catch {
      setToast({ message: 'Error al cargar los pacientes', type: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  async function handleCreate(form: FormData) {
    setLoading(true);
    try {
      await createPaciente(form);
      setToast({ message: 'Paciente registrado correctamente', type: 'success' });
      setFormKey(k => k + 1);
      await fetchPacientes();
    } catch (err: unknown) {
      setToast({ message: extractError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(form: FormData) {
    if (!editing) return;
    setLoading(true);
    try {
      await updatePaciente(editing.id, form);
      setToast({ message: 'Paciente actualizado correctamente', type: 'success' });
      setEditing(null);
      await fetchPacientes();
    } catch (err: unknown) {
      setToast({ message: extractError(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePaciente(id);
      setToast({ message: 'Paciente eliminado correctamente', type: 'success' });
      if (editing?.id === id) setEditing(null);
      await fetchPacientes();
    } catch {
      setToast({ message: 'Error al eliminar el paciente', type: 'error' });
    }
  }

  function handleEdit(paciente: Paciente) {
    setEditing(paciente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const formInitial = editing
    ? {
        nombre: editing.nombre,
        email: editing.email,
        telefono: editing.telefono,
        edad: String(editing.edad),
        diagnostico: editing.diagnostico,
      }
    : undefined;

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <FiActivity size={28} />
          <div>
            <h1>Gestión de Pacientes</h1>
            <p className="subtitle">Sistema de administración de registros médicos</p>
          </div>
        </div>
      </header>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="layout">
        <aside className="form-panel">
          <PacienteForm
            key={editing?.id ?? `new-${formKey}`}
            initial={formInitial}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={editing ? () => setEditing(null) : undefined}
            loading={loading}
          />
        </aside>

        <section className="table-panel">
          <div className="panel-header">
            <h2><FiUsers /> Pacientes registrados</h2>
            <span className="badge">{pacientes.length}</span>
          </div>
          <PacienteTable
            pacientes={pacientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

function extractError(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const resp = (err as { response: { data: { message?: string | string[] } } }).response;
    const msg = resp?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  return 'Error al guardar el paciente';
}

export default App;
