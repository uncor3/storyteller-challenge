import StoryHeader from '../components/StoryHeader';
import type { StoryPack } from '@/shared/types';
import { Outlet } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Cover from '../components/Cover';
import Info from '../components/Info';
const Main: React.FC<{ stories: Record<string, StoryPack> }> = ({
  stories,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <StoryHeader stories={stories} />
      {/* we have only one cover as requested */}
      <div>
        {Object.values(stories).map((s, i) => (
          <Cover key={i} story={s} />
        ))}
      </div>
      {createPortal(<Outlet />, document.body)}
      <div>
        {Object.values(stories).map((s, i) => {
          return s.pages.map((s, i) => {
            if (s.type != 'info') return;
            return <Info key={i} info={s} />;
          });
        })}
      </div>
    </div>
  );
};

export default Main;
