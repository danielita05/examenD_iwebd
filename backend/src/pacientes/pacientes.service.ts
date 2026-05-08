import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const existing = await this.prisma.paciente.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Ya existe un paciente con ese email');
    }
    return this.prisma.paciente.create({ data: dto });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: number, dto: UpdatePacienteDto) {
    await this.findOne(id);
    if (dto.email) {
      const existing = await this.prisma.paciente.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe otro paciente con ese email');
      }
    }
    return this.prisma.paciente.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.paciente.delete({ where: { id } });
  }
}
