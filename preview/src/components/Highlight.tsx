import type { Highlight as HighlightType } from '@/shared/types';

const Highlight: React.FC<{ highlight: HighlightType }> = ({ highlight }) => {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl shadow-2xl">
      <img
        src={`/${highlight.image}`}
        alt={highlight.headline}
        className="w-full h-full object-cover absolute inset-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 text-lg md:text-2xl font-semibold tracking-wide uppercase bg-white/90 text-black rounded-full shadow">
          {highlight.minute}'
        </div>
      </div>

      <div className="relative z-10 h-full w-full flex items-end pb-[40%]">
        <div className="w-full px-6 pb-6 sm:px-8 sm:pb-8 text-white select-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow">
            {highlight.headline}
          </h1>
          {highlight.caption ? (
            <p className="mt-2 text-md sm:text-base text-white/90 leading-snug">
              {highlight.caption}
            </p>
          ) : null}
          {highlight.explanation ? (
            <p className="mt-2 text-md text-white/70">
              {highlight.explanation as string}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Highlight;
