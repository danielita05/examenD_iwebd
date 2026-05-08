import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiFileText, FiSave, FiX } from 'react-icons/fi';
import type { PacienteForm as FormData } from '../types/Paciente';

interface Props {
  initial?: FormData;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  loading: boolean;
}

const EMPTY: FormData = { nombre: '', email: '', telefono: '', edad: '', diagnostico: '' };

interface Errors {
  nombre?: string;
  email?: string;
  telefono?: string;
  edad?: string;
  diagnostico?: string;
}

function validate(form: FormData): Errors {
  const errors: Errors = {};

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es requerido';
  } else if (/\d/.test(form.nombre)) {
    errors.nombre = 'El nombre no puede contener números';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(form.nombre.trim())) {
    errors.nombre = 'Solo letras y espacios';
  } else if (form.nombre.trim().length < 3) {
    errors.nombre = 'Mínimo 3 caracteres';
  } else if (form.nombre.trim().length > 100) {
    errors.nombre = 'Máximo 100 caracteres';
  }

  if (!form.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Formato de email inválido';
  }

  if (!form.telefono.trim()) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!/^\d{10}$/.test(form.telefono.trim())) {
    errors.telefono = 'Debe tener exactamente 10 dígitos';
  }

  if (!form.edad) {
    errors.edad = 'La edad es requerida';
  } else {
    const edad = Number(form.edad);
    if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
      errors.edad = 'Debe ser un número entre 1 y 120';
    }
  }

  if (!form.diagnostico.trim()) {
    errors.diagnostico = 'El diagnóstico es requerido';
  } else if (form.diagnostico.trim().length < 5) {
    errors.diagnostico = 'Mínimo 5 caracteres';
  } else if (form.diagnostico.trim().length > 500) {
    errors.diagnostico = 'Máximo 500 caracteres';
  }

  return errors;
}

export default function PacienteForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState<FormData>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'telefono') value = value.replace(/\D/g, '');
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched.has(name)) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof Errors] }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target;
    setTouched(prev => new Set(prev).add(name));
    const newErrors = validate(form);
    setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof Errors] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched(new Set(['nombre', 'email', 'telefono', 'edad', 'diagnostico']));
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(form);
  }

  const isEditing = !!initial;

  const hasChanges = !initial || Object.keys(EMPTY).some(
    key => form[key as keyof FormData] !== initial[key as keyof FormData]
  );

  return (
    <form className="paciente-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>

      <div className={`form-group ${errors.nombre && touched.has('nombre') ? 'has-error' : ''}`}>
        <label htmlFor="nombre"><FiUser /> Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nombre completo del paciente"
          maxLength={100}
        />
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.email && touched.has('email') ? 'has-error' : ''}`}>
          <label htmlFor="email"><FiMail /> Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className={`form-group ${errors.telefono && touched.has('telefono') ? 'has-error' : ''}`}>
          <label htmlFor="telefono"><FiPhone /> Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            inputMode="numeric"
            value={form.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10 dígitos"
            maxLength={10}
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>
      </div>

      <div className={`form-group form-group-small ${errors.edad && touched.has('edad') ? 'has-error' : ''}`}>
        <label htmlFor="edad"><FiCalendar /> Edad</label>
        <input
          id="edad"
          name="edad"
          type="number"
          value={form.edad}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej: 25"
          min={1}
          max={120}
        />
        {errors.edad && <span className="error">{errors.edad}</span>}
      </div>

      <div className={`form-group ${errors.diagnostico && touched.has('diagnostico') ? 'has-error' : ''}`}>
        <label htmlFor="diagnostico"><FiFileText /> Diagnóstico</label>
        <textarea
          id="diagnostico"
          name="diagnostico"
          value={form.diagnostico}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Descripción del diagnóstico del paciente..."
          rows={3}
          maxLength={500}
        />
        <span className="char-count">{form.diagnostico.length}/500</span>
        {errors.diagnostico && <span className="error">{errors.diagnostico}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading || (isEditing && !hasChanges)}>
          <FiSave /> {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Registrar'}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            <FiX /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
