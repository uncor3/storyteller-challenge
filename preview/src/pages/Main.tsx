import StoryHeader from '../components/StoryHeader';
import type { StoryPack } from '@/shared/types';
import { Outlet } from 'react-router-dom';
import { createPortal } from 'react-dom';

const Main: React.FC<{
  stories: StoryPack;
  story_id: string;
}> = ({ stories, story_id }) => {
  return (
    <div className="flex flex-col gap-10">
      <StoryHeader stories={stories} story_id={story_id} />
      {createPortal(<Outlet />, document.body)}
    </div>
  );
};

export default Main;
