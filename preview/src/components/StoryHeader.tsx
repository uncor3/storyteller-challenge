import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getViewedStories, setAsViewed } from '../utils';
import type { StoryPack } from '@/shared/types';

const HighlightItem: React.FC<{
  story: StoryPack['pages'][number];
  story_id: string;
  viewed: boolean;
  i: number;
}> = ({ story, viewed, i, story_id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div
        className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full cursor-pointer story ${
          viewed ? 'viewed' : ''
        }`}
        onClick={() => {
          navigate(`story/${story_id}?index=${i}`);
          setAsViewed(story_id, i);
        }}
      >
        <img
          src={story.image ? (story.image as string) : '/placeholder.png'}
          className="w-full h-full rounded-full"
          alt=""
        />
      </div>

      <h1 className="text-sm md:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 truncate w-[80px] md:w-[120px] mt-2">
        {story.caption ? (story.caption as string) : story.headline}
      </h1>
      {story.minute ? (
        <span className="text-zinc-900 dark:text-zinc-50">
          {story.minute as number}'
        </span>
      ) : null}
    </div>
  );
};

const StoryHeader: React.FC<{
  stories: StoryPack;
  story_id: string;
}> = ({ stories, story_id }) => {
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
        {stories.pages.map((highlight, i) => (
          <HighlightItem
            key={i}
            story={highlight}
            i={i}
            story_id={story_id}
            viewed={viewedStories[`${story_id}?index=${i}`]}
          />
        ))}
      </header>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/60 to-transparent" />
    </div>
  );
};

export default StoryHeader;
