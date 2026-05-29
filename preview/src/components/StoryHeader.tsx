import React, { useEffect, useState } from 'react';
import type { StoryPack } from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { getViewedStories, setAsViewed } from '../utils';
import { VIEWED_STORIES_CACHE_KEY } from '@/shared/constants';
import type { Highlight } from '@/shared/types';

const HeaderItem: React.FC<{
  story: Highlight;
  story_id: string;
  viewed: boolean;
  i: number;
}> = ({ story, viewed, i, story_id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div
        className={`w-[100px] h-[100px] rounded-full cursor-pointer story ${
          viewed ? 'viewed' : ''
        }`}
        onClick={() => {
          navigate(`story/${story_id}?index=${i}`);
          setAsViewed(story_id, i);
        }}
      >
        <img src={story.image} className="w-full h-full rounded-full" alt="" />
      </div>

      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 truncate w-[120px]">
        {story.caption}
      </h1>
      {story.minute ? <span>{story.minute as number}'</span> : null}
    </div>
  );
};

const StoryHeader: React.FC<{
  stories: Record<string, StoryPack>;
}> = ({ stories }) => {
  const [viewedStories, setViewedStories] = useState(getViewedStories);

  useEffect(() => {
    const onStoryViewed = () => {
      setViewedStories(getViewedStories());
    };

    window.addEventListener('story-viewed', onStoryViewed);

    return () => {
      window.removeEventListener('story-viewed', onStoryViewed);
    };
  }, []);

  return (
    <div className="relative">
      <header className="flex gap-3 overflow-x-scroll">
        {Object.values(stories).map((s) =>
          s.pages.map((p, i) => {
            // FIXME: pass highligt here
            if (p.type == 'highlight')
              return (
                <HeaderItem
                  key={i}
                  story={p}
                  i={i}
                  story_id={s.story_id}
                  viewed={viewedStories[`${s.story_id}?index=${i}`]}
                />
              );
          }),
        )}
      </header>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent" />
    </div>
  );
};

export default StoryHeader;
