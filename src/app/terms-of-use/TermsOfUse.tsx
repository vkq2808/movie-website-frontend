"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function TermsOfUsePage() {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["introduction"])
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

  const sections: Section[] = [
    {
      id: "introduction",
      title: "1. Introduction & Acceptance of Terms",
      icon: "📋",
      content: (
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            Welcome to <strong>MovieStream</strong> ("Platform", "Service",
            "we", "us", or "our"). These Terms of Use ("Terms") constitute a
            legally binding agreement between you ("User", "you", or "your") and
            MovieStream regarding your access to and use of our streaming
            platform.
          </p>
          <p>
            By accessing, browsing, or using MovieStream, you acknowledge that
            you have read, understood, and agree to be bound by these Terms in
            their entirety. If you do not agree with any part of these Terms,
            you must immediately cease using the Platform.
          </p>
          <p>
            MovieStream reserves the right to modify these Terms at any time.
            Changes become effective immediately upon posting. Your continued
            use of the Platform after any modification constitutes your
            acceptance of the updated Terms.
          </p>
        </div>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility & Account Responsibilities",
      icon: "✅",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Age & Legal Capacity</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You must be at least 13 years of age to create an account</li>
              <li>Users under 18 must have parental or guardian consent</li>
              <li>
                You must have the legal capacity to enter into binding
                agreements in your jurisdiction
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Account Security</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You agree to provide accurate, current, and complete information
                during registration
              </li>
              <li>
                You are solely responsible for any activities that occur under
                your account
              </li>
              <li>
                You must notify us immediately of any unauthorized access or
                suspicious activity
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Account Usage</h4>
            <p>
              Your account is for personal, non-commercial use only. You may not
              share your account credentials with others or allow third parties
              to access your account.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content-usage",
      title: "3. Content Usage License",
      icon: "🎬",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Limited License Grant</h4>
            <p>
              MovieStream grants you a limited, non-exclusive, non-transferable,
              revocable license to access and stream the content available on
              the Platform for personal, non-commercial purposes only, subject
              to these Terms.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Permitted Use</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Stream movies and series for personal entertainment</li>
              <li>
                Access content on authorized devices within your household
              </li>
              <li>
                Share account access with household members in accordance with
                our subscription plan
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Prohibited Activities</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Downloading, recording, or capturing any content without
                explicit permission
              </li>
              <li>Screen recording, screen sharing, or broadcasting streams</li>
              <li>
                Using VPN or proxy services to circumvent geographical
                restrictions
              </li>
              <li>
                Reverse engineering, decompiling, or accessing the Platform's
                underlying technology
              </li>
              <li>
                Sharing account credentials with non-household members or
                commercial entities
              </li>
              <li>
                Using content for commercial, educational, or public performance
                purposes
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "subscription",
      title: "4. Subscription & Billing",
      icon: "💳",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Subscription Plans</h4>
            <p>
              MovieStream offers various subscription tiers with different
              features and pricing. Your subscription allows you to stream
              content according to your plan's specifications.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Billing & Payments</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Subscription fees are charged at the frequency specified in your
                plan
              </li>
              <li>All prices are displayed before purchase confirmation</li>
              <li>
                You authorize MovieStream to charge your payment method
                automatically
              </li>
              <li>
                Taxes may apply based on your location and are your
                responsibility
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Cancellation & Renewal</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You may cancel your subscription at any time through your
                account settings
              </li>
              <li>
                Cancellations take effect at the end of your current billing
                cycle
              </li>
              <li>
                No refunds will be issued for partial subscription periods
              </li>
              <li>
                Your subscription will automatically renew at the end of each
                billing cycle unless canceled
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "user-conduct",
      title: "5. User Conduct & Prohibited Activities",
      icon: "⚠️",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>You agree not to use the Platform to:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Engage in any illegal, fraudulent, or harmful activities</li>
            <li>
              Harass, threaten, defame, or abuse other users or staff members
            </li>
            <li>
              Create multiple accounts to circumvent restrictions or gain unfair
              advantage
            </li>
            <li>
              Attempt to gain unauthorized access to the Platform or its systems
            </li>
            <li>
              Transmit viruses, malware, or any code of destructive nature
            </li>
            <li>
              Interfere with the proper functioning of the Platform or its
              infrastructure
            </li>
            <li>
              Engage in account sharing beyond household use or with commercial
              intent
            </li>
            <li>
              Attempt to manipulate, circumvent, or bypass any technological
              protection measures
            </li>
            <li>
              Violate any applicable laws, regulations, or third-party rights
            </li>
            <li>Spam, phish, or engage in social engineering activities</li>
          </ul>
          <p className="mt-4">
            Violation of these conduct standards may result in immediate
            suspension or permanent termination of your account.
          </p>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property Rights",
      icon: "©️",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Ownership of Content</h4>
            <p>
              All movies, series, trailers, and related content available on
              MovieStream are owned, licensed, or authorized by the respective
              copyright holders, studios, and production companies. MovieStream
              does not claim ownership of this content.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">
              Platform Intellectual Property
            </h4>
            <p>
              The MovieStream platform, including its design, interface,
              technology, trademarks, logos, and all original content created by
              MovieStream, are the exclusive intellectual property of
              MovieStream and are protected by applicable intellectual property
              laws.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Your Content</h4>
            <p>
              Any content you submit to MovieStream (such as reviews, ratings,
              or comments) grants MovieStream a perpetual, worldwide,
              non-exclusive license to use, modify, and distribute such content
              on the Platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Copyright Compliance</h4>
            <p>
              MovieStream respects intellectual property rights and complies
              with the Digital Millennium Copyright Act (DMCA). If you believe
              content on the Platform infringes your copyright, please contact
              our legal team with detailed information.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content-availability",
      title: "7. Content Availability & Disclaimer",
      icon: "🎥",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">"As Is" Basis</h4>
            <p>
              The Platform and all content are provided on an "as is" and "as
              available" basis without warranties of any kind, express or
              implied.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Content Changes</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                MovieStream continuously updates its library and content may be
                added or removed at any time
              </li>
              <li>
                We are not responsible for unavailability of specific titles or
                content regions
              </li>
              <li>
                Content availability may vary by geographic location and
                subscription tier
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Technical Issues</h4>
            <p>
              MovieStream does not guarantee uninterrupted streaming service.
              While we strive to maintain optimal streaming quality, factors
              such as internet bandwidth, device compatibility, and network
              conditions may affect your experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Parental Controls</h4>
            <p>
              Content on MovieStream is rated according to regional standards.
              Parents and guardians are responsible for monitoring and
              restricting content access through available parental control
              features.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "termination",
      title: "8. Termination & Suspension",
      icon: "🚫",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Termination by User</h4>
            <p>
              You may terminate your account at any time by accessing your
              account settings. Upon termination, you lose access to your
              account and all associated content.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Termination by MovieStream</h4>
            <p>
              MovieStream may suspend or terminate your account immediately,
              without notice, if we determine that you have:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Violated these Terms or any applicable laws</li>
              <li>Engaged in fraudulent or abusive behavior</li>
              <li>Failed to maintain account payment in good standing</li>
              <li>
                Shared account credentials with unauthorized parties at
                commercial scale
              </li>
              <li>Attempted to circumvent technical protection measures</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Effect of Termination</h4>
            <p>
              Upon termination, all rights granted to you under these Terms
              immediately cease. You remain liable for all charges incurred
              prior to termination.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "limitation-liability",
      title: "9. Limitation of Liability",
      icon: "⚖️",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Disclaimers</h4>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOVIESTREAM DISCLAIMS ALL
              WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Limitation of Damages</h4>
            <p>
              IN NO EVENT SHALL MOVIESTREAM BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
              FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM, EVEN IF ADVISED
              OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Maximum Liability</h4>
            <p>
              MOVIESTREAM'S TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT
              OF SUBSCRIPTION FEES YOU PAID IN THE THREE (3) MONTHS PRECEDING
              THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "governing-law",
      title: "10. Governing Law & Dispute Resolution",
      icon: "⚖️",
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Jurisdiction</h4>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of Vietnam, without regard to its conflict of law principles.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Dispute Resolution</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                You agree to attempt to resolve disputes through informal
                negotiation first
              </li>
              <li>
                If negotiation fails, disputes shall be resolved through binding
                arbitration
              </li>
              <li>
                You waive the right to participate in class action lawsuits
                against MovieStream
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Amendment Rights</h4>
            <p>
              MovieStream reserves the right to amend these Terms at any time.
              Continued use of the Platform after amendments constitutes
              acceptance of the modified Terms.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const tableOfContents = sections.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              Legal Document
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Please read these terms carefully before using MovieStream
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

        {/* Table of Contents */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-left text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className="hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left"
              >
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-2xl">{section.icon}</span>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
              </button>

              {expandedSections.has(section.id) && (
                <CardContent className="border-t pt-6">
                  {section.content}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Questions about our Terms?
          </h2>
          <p className="text-gray-700 mb-6">
            If you have any questions or concerns about these Terms of Use,
            please don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Contact Support
            </Button>
            <Button variant="outline">Email: legal@moviestream.com</Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
          <p>
            Last updated on January 15, 2026. MovieStream reserves the right to
            modify these terms at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
