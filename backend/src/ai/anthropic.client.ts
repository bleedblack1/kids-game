import { Injectable, Logger } from '@nestjs/common';
import { AppConfig } from '../config/app.config';

/**
 * Minimal Anthropic Messages API client using global fetch (Node 20+). Kept
 * dependency-free on purpose. Returns null on any failure so callers can fall
 * back to deterministic logic — the product never hard-depends on the LLM.
 */
@Injectable()
export class AnthropicClient {
  private readonly logger = new Logger(AnthropicClient.name);

  constructor(private readonly config: AppConfig) {}

  get enabled(): boolean {
    return this.config.ai.enabled;
  }

  get model(): string {
    return this.config.ai.model;
  }

  async completeJson<T>(system: string, user: string): Promise<T | null> {
    if (!this.enabled) return null;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.config.ai.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.ai.model,
          max_tokens: 1024,
          system,
          messages: [{ role: 'user', content: user }],
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        this.logger.warn(`AI request failed: ${res.status}`);
        return null;
      }
      const data = (await res.json()) as { content?: { text?: string }[] };
      const text = data.content?.[0]?.text ?? '';
      const match = text.match(/\{[\s\S]*\}/); // tolerate prose around the JSON
      return match ? (JSON.parse(match[0]) as T) : null;
    } catch (err) {
      this.logger.warn(`AI request errored: ${(err as Error).message}`);
      return null;
    }
  }
}
