"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";
import { CHAT_VALIDATION } from "@/constants/chat";
import type { ChatMessageFormData } from "@/schemas/chat.schema";
import type { UseChatHelpers, UIMessage } from "@ai-sdk/react";

interface ChatFormProps {
  form: UseFormReturn<ChatMessageFormData>;
  sendMessage: UseChatHelpers<UIMessage>["sendMessage"];
}

export function ChatForm({ form, sendMessage }: ChatFormProps) {
  const t = useTranslations("chat");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = form;

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      sendMessage({ text: message });
    },
    onSuccess: () => {
      reset();
    },
    onError: (error: Error) => {
      const errorMessage = translateError(error, t, "chat.") || t("sendFailed");
      showToast.error(errorMessage);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        sendMessageMutation.mutate(data.message.trim());
      })}
      className="border-t relative p-4 shrink-0 bg-gray-900 rounded-t-3xl before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20 before:rounded-t-3xl"
    >
      <div className="flex gap-4 w-full max-w-3xl mx-auto relative z-10">
        <div className="flex-1">
          <Input
            {...register("message")}
            placeholder={t("placeholder")}
            disabled={sendMessageMutation.isPending}
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message &&
            errors.message.message !== "chat.messageRequired" &&
            errors.message.message !== "chat.messageTooShort" && (
              <p className="text-red-400 text-sm mt-1">
                {errors.message.message
                  ? t(errors.message.message.replace("chat.", "") as string)
                  : errors.message.message}
              </p>
            )}
        </div>
        <Button
          type="submit"
          variant="default"
          disabled={
            !isValid ||
            !watch("message")?.trim() ||
            watch("message")?.trim().length < CHAT_VALIDATION.MIN_LENGTH ||
            sendMessageMutation.isPending
          }
        >
          {sendMessageMutation.isPending ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}
