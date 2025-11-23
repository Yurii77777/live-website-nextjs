export type KnowledgeBaseMetadata =
  | {
      type: "company_info";
      page: string;
      lang: string;
    }
  | {
      type: "technologies";
      page: string;
      lang: string;
    }
  | {
      type: "service";
      service: string;
      page: string;
      lang: string;
    }
  | {
      type: "contacts";
      page: string;
      lang: string;
    }
  | {
      type: "process";
      page: string;
      lang: string;
    }
  | {
      type: "warranty_support";
      page: string;
      lang: string;
    }
  | {
      type: "pricing";
      page: string;
      lang: string;
    }
  | {
      type: "business_domain";
      domain: string;
      lang: string;
    }
  | {
      type: "ui_components";
      category: string;
      lang: string;
    };

export interface KnowledgeBaseSearchResult {
  content: string;
  similarity: number;
  metadata: KnowledgeBaseMetadata;
}
