import React from 'react';
import { motion } from 'framer-motion';

const policySections = [
  {
    title: '1. Information We Collect',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">1.1 Information You Provide to Us</h3>
        <p className="text-white">We collect information you provide directly to us when you:</p>
        <ul className="list-disc list-inside space-y-2 text-white pl-6">
          <li>Create an account</li>
          <li>Fill out forms</li>
          <li>Upload content</li>
          <li>Communicate with us</li>
          <li>Subscribe to our services</li>
        </ul>
        <p className="text-white mt-4">This information may include:</p>
        <ul className="list-disc list-inside space-y-2 text-white pl-6">
          <li>Name, email address, and contact information</li>
          <li>Company information</li>
          <li>Billing information</li>
          <li>User content you upload to the Services</li>
          <li>Communications you send to us</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">1.2 Information We Collect Automatically</h3>
        <p className="text-white">We automatically collect certain information when you use our Services, including log information (IP address, browser type, pages viewed), device information, usage data, and location information.</p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">1.3 Information from Cookies and Similar Technologies</h3>
        <p className="text-white">We use cookies and similar tracking technologies to collect information about your interactions with our Services, including session cookies, persistent cookies, analytics cookies, and functionality cookies. For more details, see our Cookie Policy.</p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">1.4 Information from Third Parties</h3>
        <p className="text-white">We may receive information about you from third parties, such as business partners, service providers, or third-party accounts you link to our Services.</p>
      </>
    ),
  },
  {
    title: '2. How We Use Your Information',
    content: (
      <>
        <p className="text-white">We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2 text-white pl-6">
          <li>Provide, maintain, and improve the Services</li>
          <li>Communicate with you (updates, alerts, and promotions)</li>
          <li>Protect the Services and our users</li>
          <li>Train and improve our AI models</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. How We Share Your Information',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.1 With Your Consent</h3>
        <p className="text-white">We may share your information when you direct us to do so.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.2 With Service Providers</h3>
        <p className="text-white">We share information with third-party vendors (e.g., cloud storage, payment processors, analytics, support).</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.3 For Legal Reasons</h3>
        <p className="text-white">We may disclose information to comply with laws, respond to requests, enforce agreements, or protect rights and safety.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.4 Business Transfers</h3>
        <p className="text-white">If we merge or sell assets, your information may be transferred as part of that transaction.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.5 Aggregated or De-identified Data</h3>
        <p className="text-white">We may share aggregated or de-identified data that cannot identify you.</p>
      </>
    ),
  },
  {
    title: '4. Data Retention',
    content: (
      <>
        <p className="text-white">We retain your information as long as your account is active or needed to provide Services and to comply with legal obligations.</p>
      </>
    ),
  },
  {
    title: '5. Data Security',
    content: (
      <>
        <p className="text-white">We implement technical and organizational measures to protect your data, but cannot guarantee 100% security.</p>
      </>
    ),
  },
  {
    title: '6. Your Rights and Choices',
    content: (
      <>
        <p className="text-white">Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal information. To exercise these rights, contact us at privacy@nomore.report.</p>
      </>
    ),
  },
  {
    title: '7. International Transfers',
    content: (
      <>
        <p className="text-white">We may transfer your information across borders with appropriate safeguards.</p>
      </>
    ),
  },
  {
    title: '8. Children’s Privacy',
    content: (
      <>
        <p className="text-white">Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will promptly delete that information.</p>
      </>
    ),
  },
  {
    title: '9. Changes to This Privacy Policy',
    content: (
      <>
        <p className="text-white">We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the Service or by other means, such as email. We encourage you to review the Privacy Policy whenever you access the Services to stay informed about our information practices.</p>
      </>
    ),
  },
  {
    title: '10. Contact Us',
    content: (
      <>
        <p className="text-white">If you have any questions about this Privacy Policy, please contact us at:</p>
        <address className="not-italic text-white mt-2">
          Nomore.Report<br />
          [Your Address]<br />
          [Your City, State ZIP]<br />
          Email: <a href="mailto:privacy@nomore.report" className="underline text-blue-300">privacy@nomore.report</a>
        </address>
      </>
    ),
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <motion.section
        initial={{ opacity: 1, y: 50 }}
        whileInView={{ opacity: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="py-28 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black"
      >
        {/* Accent Bars */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] rounded-full opacity-80 animate-pulse mb-2" />
        {/* <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#32c5ff] to-[#ff6fd8] rounded-full opacity-70 mb-8" /> */}
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7f5fff]/10 via-[#32c5ff]/10 to-[#ff6fd8]/10 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="px-3 py-1 text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">Privacy & Security</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent drop-shadow-xl">Privacy Policy</h1>
            <p className="text-center text-white text-base mb-2">Last Updated: April 23, 2025</p>
          </div>
          <div className="space-y-8">
            {policySections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent">{section.title}</h2>
                <div className="prose prose-invert max-w-none text-white">{section.content}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;