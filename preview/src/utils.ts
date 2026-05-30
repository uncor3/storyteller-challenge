import { VIEWED_STORIES_CACHE_KEY } from '@/shared/constants';
import StoryPack from '@/schema/story.schema.ts';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

export function getViewedStories(): Record<string, boolean> {
  const state = localStorage.getItem(VIEWED_STORIES_CACHE_KEY);
  if (!state) return {};

  try {
    const data = JSON.parse(state);
    //should be ok for a small app
    if (typeof data == 'object') {
      return data as Record<string, boolean>;
    }
  } catch (error) {
    console.error('Failed to parse viewed stories from localStorage', error);
    return {};
  }
  return {};
}

export function setAsViewed(id: string, index: number) {
  const stories = getViewedStories();

  stories[`${id}?index=${index}`] = true;

  localStorage.setItem(VIEWED_STORIES_CACHE_KEY, JSON.stringify(stories));
  window.dispatchEvent(new Event('story-viewed'));
}

const ajv = new Ajv({
  allErrors: true,
});
addFormats(ajv);
const validate = ajv.compile(StoryPack);
export function validateStorypack(data: unknown) {
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
  }
  return valid;
}
