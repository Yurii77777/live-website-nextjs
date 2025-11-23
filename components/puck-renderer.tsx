import { Render } from "@measured/puck";
import { useLocale } from "next-intl";
import { config } from "@/configs/puck.config";
import { getLocalizedContent, type LocalizedPuckContent } from "@/types/localized-content";
import { Locale } from "@/i18n/routing";

interface PuckRendererProps {
  data: LocalizedPuckContent;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  const locale = useLocale() as Locale;
  const localizedData = getLocalizedContent(data, locale);

  return <Render config={config} data={localizedData} />;
}
