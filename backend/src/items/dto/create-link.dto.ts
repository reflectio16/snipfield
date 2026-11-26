import { Transform } from 'class-transformer';
import { IsUrl, MaxLength } from 'class-validator';

export class CreateLinkDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  url: string;
}