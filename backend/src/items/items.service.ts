import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(categoryId: number, dto: CreateNoteDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    return this.prisma.item.create({
      data: {
        type: ItemType.NOTE,
        title: dto.title,
        content: dto.content,
        categoryId,
      },
    });
  }
}