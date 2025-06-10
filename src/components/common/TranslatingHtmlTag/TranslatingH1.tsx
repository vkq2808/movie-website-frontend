'use client';

import { useTranslation } from "@/contexts/translation.context";
import { TranslationKey } from "@/utils/translation.util";

// children and props
export default function TranslatingH1({ children, ...props }: { children: React.ReactNode;[key: string]: any }) {
  const { t } = useTranslation();

  return (
    <h1 className="text-4xl font-bold mb-8 text-center">
      {t(children as TranslationKey) || children}
    </h1>
  );
}