import type { Info as InfoType } from '@/shared/types';

const Info: React.FC<{ info: InfoType }> = ({ info }) => {
  const image = (info as { image?: string }).image;

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden px-6 py-10">
      {image && (
        <div className="absolute inset-0">
          <img
            src={`/${image}`}
            alt=""
            className="h-full w-full scale-110 object-cover blur-2xl"
            loading="lazy"
          />
        </div>
      )}
      <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]">
        {image && (
          <div className="relative w-full h-full overflow-hidden bg-slate-100">
            <img
              src={`/${image}`}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        )}
        <div className="p-7">
          <div className="flex items-center gap-3">
            <div className="h-9 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
              {info.headline}
            </h2>
          </div>
          {info.body && (
            <p className="mt-4 text-base leading-relaxed text-slate-700 text-xs md:text-md">
              {info.body}
            </p>
          )}
          <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-700/80">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Match Brief
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
