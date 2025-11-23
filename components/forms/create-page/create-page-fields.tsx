"use client";

import { UseFormReturn } from "react-hook-form";
import { CreatePageFormData } from "@/schemas/page.schema";
import { FormField } from "./form-field";

interface CreatePageFieldsProps {
  form: UseFormReturn<CreatePageFormData>;
  translations: {
    pageTitle: string;
    pageTitlePlaceholder: string;
    slug: string;
    slugPlaceholder: string;
    slugHint: string;
  };
  translateError: (key: string) => string;
}

export function CreatePageFields({
  form,
  translations,
  translateError,
}: CreatePageFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <FormField
        id="page-title"
        label={translations.pageTitle}
        placeholder={translations.pageTitlePlaceholder}
        register={register("title")}
        error={errors.title}
        errorMessage={
          errors.title?.message
            ? translateError(
                errors.title.message.replace("admin.messages.", "")
              )
            : undefined
        }
        autoFocus
        className="mb-4"
      />

      <FormField
        id="page-slug"
        label={translations.slug}
        placeholder={translations.slugPlaceholder}
        register={register("slug", {
          onChange: (e) => {
            e.target.value = e.target.value.toLowerCase();
          },
        })}
        error={errors.slug}
        errorMessage={
          errors.slug?.message
            ? translateError(errors.slug.message.replace("admin.messages.", ""))
            : undefined
        }
        hint={translations.slugHint}
        className="mb-4"
      />
    </>
  );
}
