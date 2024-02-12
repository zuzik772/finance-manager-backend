import { Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntryService {
  //first create connection between service and repository

  constructor(
    @InjectRepository(Entry) private entryRepository: Repository<Entry>,
  ) {}

  create(createEntryDto: CreateEntryDto) {
    return this.entryRepository.save(createEntryDto);
  }

  findAll(): Promise<Entry[]> {
    return this.entryRepository.find();
  }
  //findOneBy -> generic function where you supply a search criteria
  findOne(id: number): Promise<Entry | null> {
    return this.entryRepository.findOneBy({ id });
  }

  update(id: number, updateEntryDto: UpdateEntryDto) {
    return this.entryRepository.update(id, updateEntryDto);
  }

  async remove(id: number): Promise<void> {
    await this.entryRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    this.entryRepository.delete({});
  }
}
