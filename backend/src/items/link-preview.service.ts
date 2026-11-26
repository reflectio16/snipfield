import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

export type LinkPreview = {
  title: string | null;
  imageUrl: string | null;
};

const TIMEOUT_MS = 5000;
const MAX_BYTES = 512 * 1024;
const EMPTY: LinkPreview = { title: null, imageUrl: null };

@Injectable()
export class LinkPreviewService {
  private readonly logger = new Logger(LinkPreviewService.name);

  async fetchPreview(url: string): Promise<LinkPreview> {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          'User-Agent': 'snipfield-preview/1.0',
          Accept: 'text/html',
        },
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (!res.ok || !contentType.includes('text/html')) {
        return EMPTY;
      }

      const html = await this.readLimited(res, MAX_BYTES);
      return this.parse(html, res.url);
    } catch (err) {
      this.logger.warn(`Preview failed for ${url}: ${err}`);
      return EMPTY;
    }
  }

  private parse(html: string, pageUrl: string): LinkPreview {
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('title').first().text().trim() ||
      null;

    const rawImage = $('meta[property="og:image"]').attr('content')?.trim();

    return {
      title: title ? title.slice(0, 200) : null,
      imageUrl: this.toHttpUrl(rawImage, pageUrl),
    };
  }

  private toHttpUrl(value: string | undefined, base: string): string | null {
    if (!value) {
      return null;
    }
    try {
      const parsed = new URL(value, base);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        ? parsed.href
        : null;
    } catch {
      return null;
    }
  }

  private async readLimited(res: Response, maxBytes: number): Promise<string> {
    if (!res.body) {
      return '';
    }
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;

    while (total < maxBytes) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      total += value.length;
    }
    await reader.cancel();

    return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, maxBytes));
  }
}