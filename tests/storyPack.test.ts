import { describe, expect, it, vi } from 'vitest';
import { validateStorypack } from '../preview/src/utils.ts';
import Out from '../out/out.json';
import { main as transform } from '../transform.ts';

describe('story pack validation', () => {
  it('accepts a minimal valid pack', () => {
    const data = {
      story_id: 'story-1',
      title: 'Celtic 4-0 Kilmarnock',
      source: 'provided-data',
      created_at: '2025-11-09T00:00:00Z',
      pages: [
        {
          type: 'cover',
          headline: 'Celtic 4-0 Kilmarnock',
          image: '21521989.jpg',
        },
      ],
    };

    expect(validateStorypack(data)).toBe(true);
  });

  it('rejects packs missing required fields', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const data = {
      title: 'Missing fields',
      pages: [],
    };

    expect(validateStorypack(data)).toBe(false);

    spy.mockRestore();
  });

  it('generates a valid pack from the provided data', () => {
    //this assumes default files exist
    expect(() => transform()).not.toThrow();
  });

  it('validates the generated output and invariants', () => {
    const story = Out as unknown as { pages?: Array<{ type?: string }> };

    expect(validateStorypack(Out)).toBe(true);
    expect(story.pages?.some((page) => page.type === 'cover')).toBe(true);
  });
});
