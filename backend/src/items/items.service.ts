import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ItemType } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class ItemsService {

  private readonly logger = new Logger(ItemsService.name);
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

  async getImageFilename(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item || item.type !== ItemType.IMAGE || !item.imagePath) {
      throw new NotFoundException(`Image ${id} not found`);
    }
    return item.imagePath;
  }

  async remove(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    await this.prisma.item.delete({ where: { id } });

    if (item.type === ItemType.IMAGE && item.imagePath) {
      await unlink(join('uploads', item.imagePath)).catch((err) =>
        this.logger.warn(`Could not delete file ${item.imagePath}: ${err}`),
      );
    }
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

