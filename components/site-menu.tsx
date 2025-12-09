"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PuckRenderer } from "@/components/puck-renderer";
import { puckService } from "@/services/puck.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { STALE_TIME } from "@/constants/react-query";

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("menu");

  const { data: menuData } = useQuery({
    queryKey: QUERY_KEYS.SITE_MENU,
    queryFn: () => puckService.getSiteMenu(),
    staleTime: STALE_TIME.FIVE_MINUTES,
  });

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("title")} className="group">
          <Menu className="h-6 w-6 text-white/30 group-hover:text-white transition-colors" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="mt-6" onClick={handleMenuItemClick}>
          {menuData ? (
            <PuckRenderer data={menuData} />
          ) : (
            <p className="text-muted-foreground text-sm">
              {t("notConfigured")}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
