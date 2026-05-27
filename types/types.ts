import schema from '../schema/story.schema.ts';
import type { FromSchema } from 'json-schema-to-ts';

// const const_schema =
// schema as unknown as import('json-schema-to-ts').JSONSchema;
export type StoryPack = FromSchema<typeof schema>;
