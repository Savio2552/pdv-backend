import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.companiesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }

  @Post(':id/users')
  createUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.companiesService.createUser(id, createUserDto);
  }

  @Get(':id/users')
  getCompanyUsers(@Param('id') id: string) {
    return this.companiesService.getCompanyUsers(id);
  }

  @Delete('users/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.companiesService.deleteUser(userId);
  }
}
