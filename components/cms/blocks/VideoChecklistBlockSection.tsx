import type {VideoChecklistItem} from "@/lib/types";
import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = parsed.pathname.slice(1);
  } else if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.split("/")[2];
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/")[2];
    }
  }

  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export default function VideoChecklistBlockSection({ content }: { content: VideoChecklistItem }) {
  const lists = content.lists || [];
  const embedUrl = getYouTubeEmbedUrl(content.videoUrl);

  if (lists.length === 0 && !embedUrl) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {lists.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {lists.map((list) => (
              <div className="rounded-lg bg-brand-soft p-6" key={list.title}>
                <SketchIcon name={(list.icon || "checklist") as SketchIconName} className="h-10 w-10 text-brand-orange" />
                <h3 className="mt-4 text-lg font-bold text-brand-ink">{list.title}</h3>
                <div className="mt-4 grid gap-2.5">
                  {(list.items || []).map((item) => (
                    <p className="text-sm font-semibold text-neutral-600" key={item}>
                      <span className="mr-2 text-brand-orange">✔</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {embedUrl && (
          <div>
            <div className="overflow-hidden rounded-lg shadow-premium">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title={content.videoCaption || "YouTube video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            {content.videoCaption && (
              <p className="mt-3 text-sm font-semibold text-neutral-600">{content.videoCaption}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
