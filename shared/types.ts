import schema from '../schema/story.schema.ts';
import type { FromSchema } from 'json-schema-to-ts';

export type StoryPack = FromSchema<typeof schema>;

export type Page = StoryPack['pages'][number];
export type Highlight = Extract<Page, { type: 'highlight' }>;
export type Cover = Extract<Page, { type: 'cover' }>;
export type Info = Extract<Page, { type: 'info' }>;
