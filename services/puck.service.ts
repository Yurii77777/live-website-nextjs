import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { Page } from "@/models/page.model";

export const puckService = {
  async getPages(): Promise<Page[]> {
    const response = await fetch(API_ENDPOINTS.PUCK.PAGES);
    if (!response.ok) {
      throw new Error("admin.messages.loadFailed");
    }
    return response.json();
  },

  async createPage(data: {
    slug: string;
    title: string;
  }): Promise<Page> {
    const response = await fetch(API_ENDPOINTS.PUCK.PAGES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "admin.messages.createFailed");
    }

    return response.json();
  },

  async deletePage(slug: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.PUCK.PAGE(slug), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("admin.messages.deleteFailed");
    }
  },
};
