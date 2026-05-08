import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  nombre: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  telefono: string;

  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(1, { message: 'La edad debe ser al menos 1' })
  @Max(120, { message: 'La edad no puede ser mayor a 120' })
  edad: number;

  @IsString()
  @MinLength(5, { message: 'El diagnóstico debe tener al menos 5 caracteres' })
  @MaxLength(500, { message: 'El diagnóstico no puede exceder 500 caracteres' })
  diagnostico: string;
}
