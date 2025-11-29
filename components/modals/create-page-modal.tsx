"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { puckService } from "@/services/puck.service";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/constants/query-keys";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";
import {
  createPageSchema,
  type CreatePageFormData,
} from "@/schemas/page.schema";
import { CreatePageFields } from "@/components/forms/create-page";

export function CreatePageModal() {
  const router = useRouter();
  const tCreate = useTranslations("admin.createPage");
  const tMessages = useTranslations("admin.messages");
  const queryClient = useQueryClient();

  const form = useForm<CreatePageFormData>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const createPageMutation = useMutation({
    mutationFn: puckService.createPage,
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      showToast.success(tMessages("pageCreated"));
      // Use push to properly close modal and navigate
      router.push(ROUTES.ADMIN.EDITOR(newPage.slug));
    },
    onError: (error: Error) => {
      showToast.error(translateError(error, tMessages));
    },
  });

  const onSubmit = (data: CreatePageFormData) => {
    createPageMutation.mutate(data);
  };

  const translations = {
    pageTitle: tCreate("pageTitle"),
    pageTitlePlaceholder: tCreate("pageTitlePlaceholder"),
    slug: tCreate("slug"),
    slugPlaceholder: tCreate("slugPlaceholder"),
    slugHint: tCreate("slugHint"),
  };

  return (
    <>
      <header className="mb-4">
        <Heading variant="h2" id="modal-title" className="text-white">
          {tCreate("title")}
        </Heading>
      </header>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CreatePageFields
          form={form}
          translations={translations}
          translateError={(key) => tMessages(key as any)}
        />
        <footer className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={createPageMutation.isPending}
          >
            {tCreate("cancel")}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={createPageMutation.isPending}
          >
            {createPageMutation.isPending ? tMessages("creating") : tCreate("create")}
          </Button>
        </footer>
      </form>
    </>
  );
}
