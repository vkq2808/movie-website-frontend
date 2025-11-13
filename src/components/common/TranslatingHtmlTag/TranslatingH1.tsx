'use client';

import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/utils/translation.util";

// children and props
export default function TranslatingH1({ children, ...props }: { children: React.ReactNode;[key: string]: string | React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <h1 className="text-4xl font-bold mb-8 text-center" {...props}>
      {t(children as TranslationKey) || children}
    </h1>
  );
}