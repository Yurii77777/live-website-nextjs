"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Page } from "@/models/page.model";
import { puckService } from "@/services/puck.service";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PROTECTED_PAGES } from "@/constants/pages";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const tMessages = useTranslations("admin.messages");
  const locale = useLocale();

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: pages = [],
    isLoading: loading,
    error,
  } = useQuery<Page[]>({
    queryKey: QUERY_KEYS.PAGES,
    queryFn: puckService.getPages,
  });

  const deletePageMutation = useMutation({
    mutationFn: puckService.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      showToast.success(tMessages("pageDeleted"));
    },
    onError: (error: Error) => {
      showToast.error(translateError(error, tMessages));
    },
  });

  async function handleDeletePage(slug: string) {
    if (!confirm(t("deleteConfirm", { slug }))) {
      return;
    }

    deletePageMutation.mutate(slug);
  }

  if (loading) {
    return (
      <section
        className="flex items-center justify-center h-screen"
        role="status"
      >
        <p className="text-lg">{t("loading")}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="flex items-center justify-center h-screen"
        role="alert"
      >
        <p className="text-lg text-red-600">
          {translateError(error, tMessages)}
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Heading variant="h1">{t("title")}</Heading>
        <Link href={ROUTES.ADMIN.CREATE_PAGE}>
          <Button
            variant="default"
            size="sm"
            className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            {t("createNewPage")}
          </Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <section className="text-center py-12">
          <Paragraph variant="muted">{t("noPages")}</Paragraph>
        </section>
      ) : (
        <ul className="grid gap-4">
          {pages.map((page) => (
            <li key={page.id}>
              <article className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                <header className="flex-1">
                  <Heading variant="h3">{page.title}</Heading>
                  <Paragraph variant="small" className="text-gray-500">
                    /{page.slug} •{" "}
                    {page.published ? t("published") : t("draft")} •
                    {t("updated")}{" "}
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </Paragraph>
                </header>
                <nav className="flex gap-2" aria-label="Page actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(ROUTES.ADMIN.EDITOR(page.slug))}
                    className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(`/${locale}${ROUTES.PAGE(page.slug)}`, "_blank")
                    }
                    className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {t("preview")}
                  </Button>
                  {!PROTECTED_PAGES.includes(page.slug as any) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePage(page.slug)}
                      className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    >
                      {t("delete")}
                    </Button>
                  )}
                </nav>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
