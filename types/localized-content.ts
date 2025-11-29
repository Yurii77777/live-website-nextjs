import { Data } from "@measured/puck";
import { Locale } from "@/i18n/routing";

export type LocalizedPuckContent = {
  [K in Locale]: Data;
};
