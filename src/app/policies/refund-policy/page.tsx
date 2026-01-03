import { Metadata } from "next";
import RefundPolicyClient from "./FefundPolicyClient";

export const metadata: Metadata = {
  title: "Refund Policy - MovieStream",
  description:
    "Learn about MovieStream refund policy, refund eligibility, processing times, and how to request a refund.",
  openGraph: {
    title: "Refund Policy - MovieStream",
    description:
      "Understand our refund policies and how we handle customer refund requests.",
    type: "website",
  },
};

export default function Page() {
  return <RefundPolicyClient />;
}
