import type { Cover as CoverType } from '@/shared/types';
const Cover: React.FC<{ cover: CoverType }> = ({ cover }) => {
  return (
    <section className="relative overflow-hidden border border-zinc-200 bg-black shadow-sm dark:border-zinc-800 w-full h-full">
      <img
        src={`/${cover.image}`}
        alt={cover.headline}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex min-h-[280px] flex-col justify-end gap-2 p-6 h-[70%]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          Match Result
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {cover.headline}
        </h1>
        {cover.subheadline ? (
          <p className="text-sm font-medium text-white/80 sm:text-base">
            {cover.subheadline}
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default Cover;
