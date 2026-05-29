import { VIEWED_STORIES_CACHE_KEY } from '../../shared/constants';

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
