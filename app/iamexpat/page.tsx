import IamExpatFunnel from "@/components/iamexpat/IamExpatFunnel";

export default function IamExpatPage() {
  return (
    <main className="min-h-dvh bg-brand-soft">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 py-8 sm:py-12">
        <p className="mb-6 text-sm font-bold tracking-[-0.01em] text-brand-ink">DRO Renovaties</p>
        <div className="flex-1">
          <IamExpatFunnel />
        </div>
      </div>
    </main>
  );
}
