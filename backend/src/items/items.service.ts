import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemType } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(categoryId: number, dto: CreateNoteDto) {
    await this.ensureCategoryExists(categoryId);

    return this.prisma.item.create({
      data: {
        type: ItemType.NOTE,
        title: dto.title,
        content: dto.content,
        categoryId,
      },
    });
  }

  async createImage(categoryId: number, filename: string) {
    try {
      await this.ensureCategoryExists(categoryId);
    } catch (error) {
      await unlink(join('uploads', filename)).catch(() => {});
      throw error;
    }

    return this.prisma.item.create({
      data: {
        type: ItemType.IMAGE,
        imagePath: filename,
        categoryId,
      },
    });
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }
  }
}

