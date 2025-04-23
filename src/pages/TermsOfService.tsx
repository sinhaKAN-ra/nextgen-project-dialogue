import React from 'react';
import { motion } from 'framer-motion';

const termsSections = [
  {
    title: '1. Introduction',
    content: (
      <>
        <p className="text-white">
          Welcome to <span className="font-semibold text-gradient bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent">Nomore.Report</span> ("we," "our," or "us"). By accessing or using our website, applications, APIs, and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
        </p>
        <p className="mt-4 text-white">
          Nomore.Report is an AI-powered SaaS platform that provides intelligent agents designed to manage business projects and team operations end-to-end.
        </p>
      </>
    )
  },
  {
    title: '2. Definitions',
    content: (
      <ul className="list-disc list-inside space-y-2 text-white">
        <li><b>Account</b>: Your registered account for accessing our Services.</li>
        <li><b>Content</b>: All text, data, information, software, graphics, photographs, and more that are uploaded, created, or otherwise available on our Services.</li>
        <li><b>Customer Data</b>: Any data, information, or material provided or submitted by you to the Services in the course of using the Services.</li>
        <li><b>Subscription</b>: The purchase of access to use our Services for a defined period.</li>
        <li><b>User</b>: An individual who is authorized to use the Services through your Account.</li>
      </ul>
    )
  },
  {
    title: '3. Account Registration',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.1 Account Creation</h3>
        <p className="text-white">
          To access our Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">3.2 Account Responsibilities</h3>
        <p className="text-white">
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
        </p>
      </>
    )
  },
  {
    title: '4. Services and Subscription',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.1 Service Description</h3>
        <p className="text-white">Nomore.Report provides AI-powered tools for project management, reporting, and team operations analysis. Features include document processing, automated reporting, team performance analysis, and decision intelligence.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.2 Subscription Terms</h3>
        <p className="text-white">We offer various subscription plans. Details regarding the features, limitations, and pricing of each plan are available on our pricing page. We reserve the right to modify, terminate, or otherwise amend our offered subscription plans.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.3 Free Trial</h3>
        <p className="text-white">We may offer a free trial of our Services. At the end of the free trial period, you will be charged based on your selected subscription plan unless you cancel prior to the end of the trial period.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.4 Payment and Billing</h3>
        <p className="text-white">Payment must be made using the methods specified on our website. Subscription fees are billed in advance. All payments are non-refundable except as expressly set forth in these Terms.</p>
      </>
    )
  },
  {
    title: '5. Customer Data',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">5.1 Ownership</h3>
        <p className="text-white">You retain all rights to your Customer Data. By submitting Customer Data to Nomore.Report, you grant us a worldwide, non-exclusive license to use, host, store, reproduce, modify, create derivative works, communicate, publish, and distribute such Customer Data solely for the purpose of providing and improving the Services.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">5.2 Data Protection</h3>
        <p className="text-white">We will maintain appropriate administrative, physical, and technical safeguards to protect the security, confidentiality, and integrity of your Customer Data. Please review our Privacy Policy for more information on how we collect, use, and disclose information.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">5.3 Data Retention</h3>
        <p className="text-white">We will retain your Customer Data for as long as your account is active or as needed to provide you with the Services. We will also retain and use your Customer Data as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
      </>
    )
  },
  {
    title: '6. Acceptable Use',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">6.1 Compliance with Laws</h3>
        <p className="text-white">You agree to use the Services in compliance with all applicable laws, regulations, and third-party rights.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">6.2 Prohibited Activities</h3>
        <ul className="list-disc list-inside space-y-2 text-white">
          <li>Use the Services for any illegal purpose or to transmit illegal material</li>
          <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, or that violates third-party rights</li>
          <li>Transmit any harmful code, files, or programs designed to interrupt, damage, or limit the functionality of any software or hardware</li>
          <li>Interfere with or disrupt the integrity or performance of the Services</li>
          <li>Attempt to gain unauthorized access to the Services or related systems or networks</li>
          <li>Use the Services to infringe the intellectual property rights of others</li>
          <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services without express written permission</li>
        </ul>
      </>
    )
  },
  {
    title: '7. Intellectual Property Rights',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">7.1 Our Intellectual Property</h3>
        <p className="text-white">All right, title, and interest in and to the Services (excluding Customer Data) are and will remain the exclusive property of Nomore.Report and its licensors. The Services are protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">7.2 Feedback</h3>
        <p className="text-white">If you provide us with any suggestions, ideas, or feedback regarding the Services ("Feedback"), you grant us a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate such Feedback into our Services.</p>
      </>
    )
  },
  {
    title: '8. Confidentiality',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">8.1 Confidential Information</h3>
        <p className="text-white">Each party agrees to protect the other's Confidential Information with the same standard of care it uses to protect its own Confidential Information, but in no event less than reasonable care.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">8.2 Exceptions</h3>
        <p className="text-white">Information will not be deemed Confidential Information if such information: (i) is known to the receiving party prior to receipt from the disclosing party; (ii) becomes known to the receiving party from a third party; (iii) is or becomes publicly known through no wrongful act of the receiving party; or (iv) is independently developed by the receiving party without reference to the disclosing party's Confidential Information.</p>
      </>
    )
  },
  {
    title: '9. Warranties and Disclaimers',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">9.1 Our Warranties</h3>
        <p className="text-white">We warrant that (i) we have validly entered into these Terms and have the legal power to do so, and (ii) we will provide the Services in a professional manner consistent with general industry standards.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">9.2 Disclaimer of Warranties</h3>
        <p className="text-white">EXCEPT AS EXPRESSLY PROVIDED HEREIN, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND. WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</p>
      </>
    )
  },
  {
    title: '10. Limitation of Liability',
    content: (
      <>
        <p className="text-white">TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL NOMORE.REPORT, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO USE, THE SERVICES.</p>
        <p className="mt-4 text-white">OUR TOTAL LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR YOUR USE OF THE SERVICES SHALL NOT EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SERVICES DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE OF THE CLAIM.</p>
      </>
    )
  },
  {
    title: '11. Indemnification',
    content: (
      <>
        <p className="text-white">You agree to indemnify, defend, and hold harmless Nomore.Report and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that such parties may incur as a result of or arising from your violation of these Terms.</p>
      </>
    )
  },
  {
    title: '12. Term and Termination',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">12.1 Term</h3>
        <p className="text-white">These Terms will remain in effect until terminated by either you or us.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">12.2 Termination by You</h3>
        <p className="text-white">You may terminate these Terms at any time by canceling your subscription and ceasing all use of the Services. You will not receive any refunds if you terminate these Terms.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">12.3 Termination by Us</h3>
        <p className="text-white">We may terminate these Terms or suspend your access to the Services at any time, with or without cause, and with or without notice. We may also terminate or suspend your account for inactivity, which we define as failing to log in to the Services for an extended period of time.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">12.4 Effect of Termination</h3>
        <p className="text-white">Upon termination, your right to use the Services will immediately cease. The following sections shall survive termination: Intellectual Property Rights, Confidentiality, Warranties and Disclaimers, Limitation of Liability, Indemnification, and General Provisions.</p>
      </>
    )
  },
  {
    title: '13. Changes to Terms',
    content: (
      <>
        <p className="text-white">We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. Changes will be effective immediately upon posting. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.</p>
      </>
    )
  },
  {
    title: '14. General Provisions',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.1 Governing Law</h3>
        <p className="text-white">These Terms shall be governed by the laws of the state of [Your State], without regard to its conflict of laws principles.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.2 Dispute Resolution</h3>
        <p className="text-white">Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in [Your City, State].</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.3 Severability</h3>
        <p className="text-white">If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.4 No Waiver</h3>
        <p className="text-white">Our failure to enforce any right or provision of these Terms will not be considered a waiver of such right or provision.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.5 Assignment</h3>
        <p className="text-white">You may not assign these Terms without our prior written consent, but we may assign or transfer these Terms without restriction.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">14.6 Entire Agreement</h3>
        <p className="text-white">These Terms, together with our Privacy Policy and any other agreements expressly incorporated by reference herein, constitute the entire agreement between you and us concerning the Services.</p>
      </>
    )
  },
  {
    title: '15. Contact Information',
    content: (
      <>
        <p className="text-white">If you have any questions about these Terms, please contact us at:</p>
        <address className="not-italic mt-2 text-white">
          Nomore.Report<br />
          [Your Address]<br />
          [Your City, State ZIP]<br />
          Email: <a href="mailto:contact@nomore.report" className="underline text-blue-300">contact@nomore.report</a>
        </address>
      </>
    )
  },
];

const TermsOfService = () => {
  return (
      <div className="bg-gray-900 min-h-screen">
          <motion.section
            initial={{ opacity: 1, y: 50 }}
            whileInView={{ opacity: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="py-28 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black"
          >
        {/* Gradient accent bars */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] rounded-full opacity-80 animate-pulse mb-10" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#32c5ff] to-[#ff6fd8] rounded-full opacity-70 mb-8" />
        
        {/* Subtle gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7f5fff]/10 via-[#32c5ff]/10 to-[#ff6fd8]/10 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="px-3 py-1 text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">Legal & Compliance</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent drop-shadow-xl mb-2">Terms of Service</h1>
            <p className="text-center text-white text-base mb-2">Last Updated: April 23, 2025</p>
          </div>
          <div className="space-y-8">
            {termsSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsOfService;