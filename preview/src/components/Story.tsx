import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCards, Autoplay } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { setAsViewed } from '../utils';
import type { StoryPack } from '@/shared/types';
import Cover from './Cover';
import Info from './Info';
import Highlight from './Highlight';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Stories: React.FC<{
  story_id: string;
  stories: StoryPack;
}> = ({ story_id, stories }) => {
  const { storyId: paramsStoryId } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const index = urlParams.get('index');
  let int_index = 0;
  if (index) {
    int_index = parseInt(index);
  }
  const [currentIndex, setCurrentIndex] = useState(int_index);
  const lastIndex = Math.max(0, stories.pages.length - 1);

  const updateIndexParam = (nextIndex: number) => {
    setUrlParams({ index: String(nextIndex) });
    setCurrentIndex(nextIndex);
  };

  if (paramsStoryId !== story_id) {
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
      <button
        className="absolute top-4 right-4 z-50 bg-black/50 rounded-full text-white md:hidden w-8 h-8 flex items-center justify-center"
        aria-label="Close story"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/');
        }}
      >
        ✕
      </button>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        initialSlide={int_index}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        onSlideChange={(swiper) => {
          setAsViewed(story_id, swiper.activeIndex);
          updateIndexParam(swiper.activeIndex);
        }}
      >
        {stories.pages.map((s, i) => {
          return (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full flex items-center justify-center font-semibold text-black relative"
                onClick={(e) => e.stopPropagation()}
              >
                {s.type === 'cover' && <Cover cover={s} />}

                {s.type === 'info' && <Info info={s} />}
                {s.type === 'highlight' && <Highlight highlight={s} />}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 rounded-full text-white w-9 h-9 items-center justify-center ${
          currentIndex === 0 ? 'opacity-50' : 'cursor-pointer'
        }`}
        aria-label="Previous story"
        onClick={(e) => {
          e.stopPropagation();
          const nextIndex = Math.max(0, currentIndex - 1);
          swiperRef.current?.slideTo(nextIndex);
          updateIndexParam(nextIndex);
        }}
        disabled={currentIndex === 0}
      >
        <FiChevronLeft />
      </button>
      <button
        className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 rounded-full text-white w-9 h-9 items-center justify-center ${
          currentIndex === lastIndex ? 'opacity-50' : 'cursor-pointer'
        }`}
        aria-label="Next story"
        onClick={(e) => {
          e.stopPropagation();
          const nextIndex = Math.min(lastIndex, currentIndex + 1);
          swiperRef.current?.slideTo(nextIndex);
          updateIndexParam(nextIndex);
        }}
        disabled={currentIndex === lastIndex}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Stories;
