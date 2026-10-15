import VideoTestimonialPlayer from "@/components/ervaringen/VideoTestimonialPlayer";
import type {VideoTestimonial} from "@/lib/cms";

// Toont niets zolang er geen video's zijn: geen leeg gat op de pagina.
export default function VideoTestimonialsSection({testimonials}: {testimonials: VideoTestimonial[]}) {
  if (testimonials.length === 0) return null;

  const featured = testimonials.find((item) => item.featured) || testimonials[0];
  const others = testimonials.filter((item) => item.id !== featured.id);

  return (
    <section className="bg-white py-14 sm:py-20" id="videos">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Zien is geloven</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            Hoor het van de mensen zelf.
          </h2>
        </div>

        <div className="mt-10 mx-auto max-w-5xl">
          <VideoTestimonialPlayer featured testimonial={featured} />
        </div>

        {others.length > 0 ? (
          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((testimonial) => (
              <VideoTestimonialPlayer key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
