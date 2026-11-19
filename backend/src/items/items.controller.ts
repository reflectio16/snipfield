import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { ItemsService } from './items.service';
import { CreateNoteDto } from './dto/create-note.dto';

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

@Controller('categories/:categoryId')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('notes')
  createNote(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: CreateNoteDto,
  ) {
    return this.itemsService.createNote(categoryId, dto);
  }

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          callback(null, randomUUID() + IMAGE_EXTENSIONS[file.mimetype]);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (file.mimetype in IMAGE_EXTENSIONS) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only PNG, JPEG and WebP images are allowed'),
            false,
          );
        }
      },
    }),
  )
  createImage(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.itemsService.createImage(categoryId, file.filename);
  }
}