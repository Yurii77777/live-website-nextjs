import { LocalizedPuckContent } from "./localized-content";

export interface PageUpsertData {
  title?: string;
  content: LocalizedPuckContent;
  published?: boolean;
}
