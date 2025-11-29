import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RequestDeviceDto } from './dto/request-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('check/:deviceId')
  checkDevice(@Param('deviceId') deviceId: string) {
    return this.devicesService.checkDevice(deviceId);
  }

  @Post('request')
  requestAccess(@Body() requestDeviceDto: RequestDeviceDto) {
    return this.devicesService.requestAccess(requestDeviceDto);
  }

  @Get('pending')
  getPendingDevices(@Query('companyId') companyId?: string) {
    return this.devicesService.getPendingDevices(companyId);
  }

  @Get()
  getAllDevices() {
    return this.devicesService.getAllDevices();
  }

  @Patch(':id/approve')
  approveDevice(@Param('id') id: string) {
    return this.devicesService.approveDevice(id);
  }

  @Patch(':id/reject')
  rejectDevice(@Param('id') id: string) {
    return this.devicesService.rejectDevice(id);
  }

  @Delete(':id')
  deleteDevice(@Param('id') id: string) {
    return this.devicesService.deleteDevice(id);
  }
}
