import { CardGridSkeleton, PageHeaderSkeleton } from "@/components/common/skeletons";

export default function CommitteeLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <CardGridSkeleton count={8} columns="sm:grid-cols-2 lg:grid-cols-4" aspect="aspect-square" />
        </div>
      </section>
    </div>
  );
}
