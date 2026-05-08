import { useState } from 'react';
import { FiEdit2, FiTrash2, FiInbox } from 'react-icons/fi';
import Modal from './Modal';
import type { Paciente } from '../types/Paciente';

interface Props {
  pacientes: Paciente[];
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: number) => void;
}

export default function PacienteTable({ pacientes, onEdit, onDelete }: Props) {
  const [deleting, setDeleting] = useState<Paciente | null>(null);

  if (pacientes.length === 0) {
    return (
      <div className="empty-state">
        <FiInbox size={48} />
        <p>No hay pacientes registrados</p>
        <span>Agrega tu primer paciente usando el formulario</span>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Edad</th>
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td className="nombre-cell">{p.nombre}</td>
                <td>{p.email}</td>
                <td>{p.telefono}</td>
                <td>{p.edad}</td>
                <td className="diagnostico-cell" title={p.diagnostico}>{p.diagnostico}</td>
                <td className="actions-cell">
                  <button className="btn-edit" title="Editar" onClick={() => onEdit(p)}>
                    <FiEdit2 size={14} /> Editar
                  </button>
                  <button
                    className="btn-delete"
                    title="Eliminar"
                    onClick={() => setDeleting(p)}
                  >
                    <FiTrash2 size={14} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleting && (
        <Modal
          title="Eliminar paciente"
          message={`¿Estás segura de que deseas eliminar a ${deleting.nombre}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={() => {
            onDelete(deleting.id);
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
