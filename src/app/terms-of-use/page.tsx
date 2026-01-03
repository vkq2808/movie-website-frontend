import { Metadata } from "next";
import TermsOfUsePage from "./TermsOfUse";

export const metadata: Metadata = {
  title: "Terms of Use - MovieStream",
  description:
    "Read our comprehensive terms of use for the MovieStream platform. Learn about your rights, responsibilities, and our service policies.",
  openGraph: {
    title: "Terms of Use - MovieStream",
    description:
      "Understand the terms governing your use of MovieStream streaming services.",
    type: "website",
  },
};

export default function Page() {
  return <TermsOfUsePage />;
}
