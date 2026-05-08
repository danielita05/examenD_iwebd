import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  telefono?: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(1, { message: 'La edad debe ser al menos 1' })
  @Max(120, { message: 'La edad no puede ser mayor a 120' })
  edad?: number;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'El diagnóstico debe tener al menos 5 caracteres' })
  @MaxLength(500, { message: 'El diagnóstico no puede exceder 500 caracteres' })
  diagnostico?: string;
}
