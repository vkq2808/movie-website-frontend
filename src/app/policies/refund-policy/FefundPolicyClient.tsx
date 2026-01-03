"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface PolicyItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function RefundPolicyClient() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["general-statement", "subscription-refunds"])
  );

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const policyItems: PolicyItem[] = [
    {
      id: "general-statement",
      title: "1. General Refund Policy Statement",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            MovieStream values your satisfaction and is committed to fair refund
            practices. This Refund Policy outlines the circumstances under which
            refunds may be requested and the procedures for processing them.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">Our Commitment:</p>
            <p className="text-green-800">
              We offer refunds for subscription charges when specific conditions
              are met, as detailed in this policy. Our goal is to ensure
              transparency and fairness in all refund transactions.
            </p>
          </div>
          <p>
            Please note that refund eligibility depends on the type of purchase,
            subscription status, and reasons for the refund request. Not all
            requests will qualify for refunds under our policy.
          </p>
        </div>
      ),
    },
    {
      id: "subscription-refunds",
      title: "2. Subscription Refund Conditions",
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      content: (
        <div className="space-y-5 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Refundable Subscription Charges
            </h4>
            <p className="mb-4">
              Refunds for subscription charges may be issued under the following
              conditions:
            </p>
            <div className="space-y-3 ml-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Within 30 Days of Subscription Purchase
                  </p>
                  <p className="text-gray-600 mt-1">
                    If you cancel your subscription within 30 days of your first
                    payment and have streamed less than 10 hours of content, you
                    are eligible for a full refund.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Billing Errors</p>
                  <p className="text-gray-600 mt-1">
                    If you were incorrectly charged, double-charged, or charged
                    for an unauthorized renewal, you are eligible for a refund
                    of the erroneous charges.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Service Unavailability
                  </p>
                  <p className="text-gray-600 mt-1">
                    If the Platform experiences extended service outages (24+
                    hours) preventing you from accessing your subscription, you
                    may request a credit or refund.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Subscription Tier Cancellation
                  </p>
                  <p className="text-gray-600 mt-1">
                    If a subscription tier is permanently discontinued,
                    remaining subscribers may request a refund for the unused
                    portion of their billing period.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Trial Period Refunds
            </h4>
            <p>
              If you subscribed to a free trial and were unexpectedly charged
              after the trial period ended due to a system error or unclear
              cancellation, you are eligible for a full refund of those charges.
              Please contact our support team within 15 days of the charge.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "non-refundable",
      title: "3. Non-Refundable Cases",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">
            The following cases are NOT eligible for refunds:
          </p>

          <div className="space-y-3">
            {[
              {
                title: "Extended Subscription Usage",
                desc: "If you have actively used the subscription beyond the 30-day window, refunds for regular subscription charges cannot be issued.",
              },
              {
                title: "Content Rental/Purchase",
                desc: "One-time movie rentals or purchase licenses are non-refundable once activated or downloaded.",
              },
              {
                title: "Voluntary Account Cancellation",
                desc: "Canceling your subscription does not entitle you to a refund for the current billing period. Your access continues until the period ends.",
              },
              {
                title: "Premium Features",
                desc: "Upgrades to premium features or ad-free viewing purchased during your subscription are non-refundable.",
              },
              {
                title: "Gift Cards & Prepaid Credits",
                desc: "Gift cards and prepaid subscription credits are non-refundable once purchased.",
              },
              {
                title: "Change of Mind",
                desc: "Refunds are not issued simply because you changed your mind about the service after the 30-day period.",
              },
              {
                title: "Account Suspension",
                desc: "If your account was suspended or terminated due to violation of our Terms of Use, no refunds will be issued.",
              },
              {
                title: "Third-Party Payment Processing Issues",
                desc: "Disputes with third-party payment processors must be addressed directly with your bank or payment provider.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "technical-issues",
      title: "4. Technical Issues & Service Credits",
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            While we strive to maintain a reliable streaming service, technical
            issues can sometimes occur. MovieStream handles technical issues as
            follows:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Streaming Quality Issues
              </h4>
              <p>
                If you consistently experience poor streaming quality
                (buffering, low resolution) due to our systems, please report
                the issue. We will investigate and may offer a service credit if
                the issue persists beyond 7 days.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Login Problems
              </h4>
              <p>
                If you cannot access your account due to a system error on our
                end, we will work to restore access. If restoration takes more
                than 24 hours, you may request a service credit.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Service Outages
              </h4>
              <p>
                Extended service outages are unusual, but if they occur and
                prevent you from using your subscription, we will provide a
                service credit equivalent to one day of your subscription for
                every full day of downtime (after 24 hours of initial outage).
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Billing System Errors
              </h4>
              <p>
                If our billing system causes an error affecting your account, we
                will correct it and issue appropriate refunds or credits
                immediately upon discovery.
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Service credits are typically issued as account credits that can
              be applied to future subscriptions. In some cases, credits may be
              converted to refunds at our discretion.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "refund-process",
      title: "5. Refund Request Process",
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      content: (
        <div className="space-y-5 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Step-by-Step Refund Request
            </h4>
            <div className="space-y-3">
              {[
                {
                  num: 1,
                  title: "Contact Support",
                  desc: 'Email our support team at support@moviestream.com with "Refund Request" in the subject line.',
                },
                {
                  num: 2,
                  title: "Provide Information",
                  desc: "Include your account email, order ID, transaction date, and a detailed explanation of your refund request.",
                },
                {
                  num: 3,
                  title: "Verification",
                  desc: "Our team will review your account history and verify your request against this policy.",
                },
                {
                  num: 4,
                  title: "Decision",
                  desc: "We will inform you of the refund decision within 5-7 business days.",
                },
                {
                  num: 5,
                  title: "Processing",
                  desc: "If approved, the refund will be processed to your original payment method.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Required Information
            </h4>
            <p className="mb-2">
              To expedite your refund request, please provide:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
              <li>Your MovieStream account email address</li>
              <li>Order ID or transaction ID (from your receipt)</li>
              <li>Payment method used (last 4 digits)</li>
              <li>Date of transaction</li>
              <li>Clear description of the issue or reason for refund</li>
              <li>Any relevant screenshots or error messages</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "processing-time",
      title: "6. Refund Processing Timeline",
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-indigo-900">
                  Request Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-indigo-900">
                <div>
                  <p className="font-semibold">5-7 Business Days</p>
                  <p className="text-sm">
                    Review & decision time after request submission
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-indigo-900">
                  Refund Settlement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-indigo-900">
                <div>
                  <p className="font-semibold">7-14 Business Days</p>
                  <p className="text-sm">
                    Refund appears in your bank account after approval
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-700" />
            <AlertDescription className="text-yellow-800">
              <strong>Note:</strong> Processing times may vary depending on your
              payment method and financial institution. Some banks may take
              additional 3-5 business days to process the refund.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Timeframe for Refund Requests
            </h4>
            <p className="text-gray-700">
              Refund requests must be submitted within <strong>90 days</strong>{" "}
              of the transaction. Requests submitted after this period may not
              be eligible for refund, though we encourage you to contact us to
              discuss your situation.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact-info",
      title: "7. Contact Information & Support",
      icon: <AlertCircle className="w-6 h-6 text-green-600" />,
      content: (
        <div className="space-y-5 text-sm text-gray-700">
          <p>
            If you have questions about this refund policy or need to submit a
            refund request, please contact our customer support team using the
            following methods:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-green-900">
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-900">
                <p className="font-mono text-sm break-all">
                  support@moviestream.com
                </p>
                <p className="text-xs mt-2">Response time: 24-48 hours</p>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-green-900">
                  Refund Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-900">
                <p className="font-mono text-sm break-all">
                  refunds@moviestream.com
                </p>
                <p className="text-xs mt-2">Dedicated refund team</p>
              </CardContent>
            </Card>
          </div>

          <div className="border-l-4 border-green-600 pl-4 py-2">
            <h4 className="font-semibold text-gray-900 mb-2">
              Account Settings
            </h4>
            <p>
              You can also manage your subscription and review refund
              eligibility directly through your account settings on the
              MovieStream platform.
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Important:</strong> Always keep your refund request
              confirmation and transaction IDs for reference. This will help us
              process your request more efficiently.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">
              Policy Document
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Clear, transparent refund guidelines for MovieStream customers
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Last Updated:</span> January 2026
            </div>
            <div>
              <span className="font-semibold">Effective Date:</span> January 1,
              2026
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Quick Summary:</strong> We offer refunds for subscription
            charges within 30 days of purchase (if less than 10 hours streamed),
            billing errors, and service unavailability. Refund requests must be
            submitted within 90 days of the transaction.
          </AlertDescription>
        </Alert>

        {/* Policy Items */}
        <div className="space-y-4">
          {policyItems.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              className="hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full text-left"
              >
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {item.icon}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    {expandedSections.has(item.id) ? (
                      <span className="text-gray-400 flex-shrink-0">▼</span>
                    ) : (
                      <span className="text-gray-400 flex-shrink-0">▶</span>
                    )}
                  </div>
                </CardHeader>
              </button>

              {expandedSections.has(item.id) && (
                <CardContent className="border-t pt-6">
                  {item.content}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "When can I get a refund if I just subscribed?",
                a: "You can request a refund within 30 days of your first payment if you have streamed less than 10 hours of content.",
              },
              {
                q: "What if I was charged twice by mistake?",
                a: "Double charges are eligible for immediate refund. Please contact us right away with your transaction details.",
              },
              {
                q: "Can I get a refund after 30 days?",
                a: "Generally no, unless there was a billing error or service issue. Ongoing subscriptions are not refundable after 30 days.",
              },
              {
                q: "How long does a refund take?",
                a: "Refund requests are reviewed within 5-7 business days. Once approved, the refund appears in your account within 7-14 business days.",
              },
              {
                q: "What is the 10-hour streaming limit?",
                a: "To ensure fairness, our 30-day refund guarantee only applies if you have used the service minimally (less than 10 hours). After 10 hours, the subscription is considered accepted.",
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{item.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  {item.a}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Need to request a refund?
          </h2>
          <p className="text-gray-700 mb-6">
            Our support team is here to help. Send us an email with your refund
            request and we'll respond within 24-48 hours.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              Email Support
            </Button>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              View Account Settings
            </Button>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-xs text-gray-600">
          <p>
            This Refund Policy is subject to change at any time. MovieStream
            reserves the right to modify refund terms with 30 days notice.
          </p>
          <p className="mt-2">Last updated on January 15, 2026.</p>
        </div>
      </div>
    </div>
  );
}
