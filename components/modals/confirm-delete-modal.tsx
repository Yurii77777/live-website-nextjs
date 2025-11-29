"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { puckService } from "@/services/puck.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTES } from "@/constants/routes";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";

interface ConfirmDeleteModalProps {
  slug: string;
  title: string;
}

export function ConfirmDeleteModal({ slug, title }: ConfirmDeleteModalProps) {
  const router = useRouter();
  const tDashboard = useTranslations("admin.dashboard");
  const tMessages = useTranslations("admin.messages");
  const tCreatePage = useTranslations("admin.createPage");
  const queryClient = useQueryClient();

  const deletePageMutation = useMutation({
    mutationFn: puckService.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      showToast.success(tMessages("pageDeleted"));
      router.push(ROUTES.ADMIN.DASHBOARD);
    },
    onError: (error: Error) => {
      showToast.error(translateError(error, tMessages));
      router.back();
    },
  });

  const handleDelete = () => {
    deletePageMutation.mutate(slug);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <header className="mb-4">
        <Heading variant="h2" id="modal-title" className="text-white">
          {tDashboard("delete")}
        </Heading>
      </header>
      <div className="mb-6">
        <Paragraph className="text-gray-300">
          {tDashboard("deleteConfirm", { slug: title })}
        </Paragraph>
      </div>
      <footer className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={deletePageMutation.isPending}
        >
          {tCreatePage("cancel")}
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleDelete}
          disabled={deletePageMutation.isPending}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {deletePageMutation.isPending ? tMessages("deleting") : tDashboard("delete")}
        </Button>
      </footer>
    </>
  );
}
