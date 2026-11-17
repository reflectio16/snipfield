import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateNoteDto } from './dto/create-note.dto';

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
}