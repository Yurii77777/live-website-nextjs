import { CreatePageModal } from "@/components/modals/create-page-modal";

export default function CreatePageFullPage() {
  return (
    <section className="container mx-auto p-6 max-w-2xl">
      <article className="bg-white rounded-lg border p-6">
        <CreatePageModal />
      </article>
    </section>
  );
}
