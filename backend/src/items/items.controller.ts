import type { Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Res
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

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('categories/:categoryId/notes')
  createNote(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: CreateNoteDto,
  ) {
    return this.itemsService.createNote(categoryId, dto);
  }

  @Post('categories/:categoryId/images')
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

  @Get('items/:id/image')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const filename = await this.itemsService.getImageFilename(id);

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(filename, { root: 'uploads' }, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({
          message: 'Image file not found',
          error: 'Not Found',
          statusCode: 404,
        });
      }
    });
  }
}