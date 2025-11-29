import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../auth/entities/device.entity';
import { RequestDeviceDto } from './dto/request-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepo: Repository<Device>,
  ) {}

  async checkDevice(deviceId: string): Promise<{ authorized: boolean; status: string }> {
    const device = await this.devicesRepo.findOne({ where: { deviceId } });
    
    if (!device) {
      return { authorized: false, status: 'not_found' };
    }

    return { 
      authorized: device.status === 'approved',
      status: device.status
    };
  }

  async requestAccess(requestDeviceDto: RequestDeviceDto): Promise<Device> {
    const existing = await this.devicesRepo.findOne({
      where: { deviceId: requestDeviceDto.deviceId }
    });

    if (existing) {
      if (existing.status === 'pending') {
        throw new ConflictException('Solicitação já enviada e aguardando aprovação');
      }
      if (existing.status === 'rejected') {
        existing.status = 'pending';
        return this.devicesRepo.save(existing);
      }
      return existing;
    }

    const device = this.devicesRepo.create({
      ...requestDeviceDto,
      status: 'pending'
    });

    return this.devicesRepo.save(device);
  }

  async getPendingDevices(companyId?: string): Promise<Device[]> {
    const query: any = { status: 'pending' };
    if (companyId) {
      query.companyId = companyId;
    }
    return this.devicesRepo.find({
      where: query,
      relations: ['company'],
      order: { createdAt: 'DESC' }
    });
  }

  async getAllDevices(): Promise<Device[]> {
    return this.devicesRepo.find({
      relations: ['company'],
      order: { createdAt: 'DESC' }
    });
  }

  async approveDevice(deviceId: string): Promise<Device> {
    const device = await this.devicesRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new NotFoundException('Dispositivo não encontrado');
    }

    device.status = 'approved';
    device.approvedAt = new Date();
    return this.devicesRepo.save(device);
  }

  async rejectDevice(deviceId: string): Promise<Device> {
    const device = await this.devicesRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new NotFoundException('Dispositivo não encontrado');
    }

    device.status = 'rejected';
    return this.devicesRepo.save(device);
  }

  async deleteDevice(deviceId: string): Promise<void> {
    const device = await this.devicesRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new NotFoundException('Dispositivo não encontrado');
    }
    await this.devicesRepo.remove(device);
  }
}
