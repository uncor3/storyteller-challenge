import type { StoryPack } from '@/shared/types';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { setAsViewed } from '../utils';

const Stories: React.FC<{
  stories: Record<string, StoryPack>;
}> = ({ stories }) => {
  const { storyId } = useParams();
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();
  const index = urlParams.get('index');
  let int_index = 0;
  if (index) {
    int_index = parseInt(index);
  }

  const story = stories[storyId || ''];

  if (!story || !storyId) {
    return (
      <div
        className="bg-black/50 fixed top-0 left-0 flex items-center justify-center w-full h-full z-99"
        onClick={() => navigate('/')}
      >
        <h1 className="text-4xl text-white">Failed to load</h1>
      </div>
    );
  }

  return (
    <div
      className="bg-black/50 fixed top-0 left-0 flex items-center justify-center w-full h-full z-99"
      onClick={() => navigate('/')}
    >
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        initialSlide={int_index}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => {
          setAsViewed(storyId, swiper.activeIndex);
        }}
      >
        {/* FIXME: only pass highlights */}
        {story.pages.map((s) => (
          <SwiperSlide>
            <div className="w-full h-full flex items-center justify-center font-semibold text-black relative">
              <img
                src={`/${s.image}`}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/45 pointer-events-none" />

              <div className="flex flex-col relative z-1 text-center select-none w-[90%]">
                {/* FIXME: use s.explanation */}
                <h1 className="text-white">{s.headline}</h1>
                {s.explanation ? (
                  <h1 className="text-white">{s.explanation as string}</h1>
                ) : null}
                {/* <h1 className="text-white">{s}</h1>  */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Stories;
