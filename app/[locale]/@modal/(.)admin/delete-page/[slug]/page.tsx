import { BaseModal } from "@/components/modals/base-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { pageService } from "@/services/page.service";
import { notFound } from "next/navigation";

interface DeletePageModalProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DeletePageModalRoute({
  params,
}: DeletePageModalProps) {
  const { slug } = await params;

  // Fetch page to get its title
  const page = await pageService.findBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <BaseModal>
      <ConfirmDeleteModal slug={slug} title={page.title} />
    </BaseModal>
  );
}
