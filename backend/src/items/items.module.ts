import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { LinkPreviewService } from './link-preview.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, LinkPreviewService],
})
export class ItemsModule {}
