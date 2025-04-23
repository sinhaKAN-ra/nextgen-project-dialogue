import React from 'react';
import { motion } from 'framer-motion';

const cookieSections = [
  {
    title: '1. What Are Cookies?',
    content: (
      <p className="text-white">
        Cookies are small text files that are stored on your browser or device when you visit a website. Cookies allow us to recognize your browser or device and remember certain information about your visit, like your preferences and settings.
      </p>
    ),
  },
  {
    title: '2. Types of Cookies We Use',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">2.1 Essential Cookies</h3>
        <p className="text-white">These cookies are necessary for the Services to function properly. They enable core functionality such as security, account login, and remembering your preferences. You cannot opt out of these cookies.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">2.2 Performance and Analytics Cookies</h3>
        <p className="text-white">These cookies collect information about how visitors use our Services, such as which pages they visit most often and if they receive error messages. The information collected is aggregated and anonymous.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">2.3 Functionality Cookies</h3>
        <p className="text-white">These cookies allow our Services to remember choices you make and provide enhanced, more personal features. For example, they may remember your language preferences or the region you are in.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">2.4 Targeting and Advertising Cookies</h3>
        <p className="text-white">These cookies are used to deliver advertisements that are more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.</p>
      </>
    ),
  },
  {
    title: '3. Specific Cookies We Use',
    content: (
      <table className="w-full text-white mb-4">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 text-left">Type</th>
            <th className="py-2 text-left">Name</th>
            <th className="py-2 text-left">Purpose</th>
            <th className="py-2 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-700"><td className="py-2">Essential</td><td className="py-2">session_id</td><td className="py-2">Manages user sessions</td><td className="py-2">Session</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Essential</td><td className="py-2">auth_token</td><td className="py-2">Authentication</td><td className="py-2">30 days</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Essential</td><td className="py-2">csrf_token</td><td className="py-2">Security</td><td className="py-2">Session</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Performance</td><td className="py-2">_ga</td><td className="py-2">Google Analytics - Distinguishes users</td><td className="py-2">2 years</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Performance</td><td className="py-2">_gid</td><td className="py-2">Google Analytics - Identifies user session</td><td className="py-2">24 hours</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Functionality</td><td className="py-2">lang</td><td className="py-2">Stores language preference</td><td className="py-2">1 year</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Functionality</td><td className="py-2">theme</td><td className="py-2">Stores UI theme preference</td><td className="py-2">1 year</td></tr>
          <tr className="border-b border-gray-700"><td className="py-2">Targeting</td><td className="py-2">_fbp</td><td className="py-2">Facebook Pixel - Tracks conversions</td><td className="py-2">90 days</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    title: '4. Third-Party Cookies',
    content: (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.1 Analytics and Performance</h3>
        <p className="text-white">We use Google Analytics to help us understand how visitors use our Services. Google Analytics uses cookies to collect information about the number of visitors, where they come from, and how they use our website.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.2 Marketing and Advertising</h3>
        <p className="text-white">We may use cookies from advertising partners, such as Google Ads and Facebook, to deliver personalized advertisements to you based on your interests and online behavior.</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">4.3 Social Media Features</h3>
        <p className="text-white">Our Services may include features from social media platforms, such as "Like" or "Share" buttons. These features may set cookies that collect information about your IP address and which page you're visiting.</p>
      </>
    ),
  },
  {
    title: '5. How to Manage Cookies',
    content: (
      <>
        <p className="text-white">Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience and functionality on our Services. Here's how to manage cookies in popular browsers:</p>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Chrome</h3>
        <ol className="list-decimal list-inside space-y-1 text-white pl-6">
          <li>Click on the menu in the top right corner</li>
          <li>Select "Settings"</li>
          <li>Click on "Privacy and security"</li>
          <li>Click on "Cookies and other site data"</li>
          <li>Choose your preferred settings</li>
        </ol>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Firefox</h3>
        <ol className="list-decimal list-inside space-y-1 text-white pl-6">
          <li>Click on the menu in the top right corner</li>
          <li>Select "Options" (or "Preferences" on Mac)</li>
          <li>Click on "Privacy & Security"</li>
          <li>Under "Cookies and Site Data," choose your preferred settings</li>
        </ol>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Safari</h3>
        <ol className="list-decimal list-inside space-y-1 text-white pl-6">
          <li>Go to "Preferences"</li>
          <li>Click on "Privacy"</li>
          <li>Under "Cookies and website data," choose your preferred settings</li>
        </ol>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Microsoft Edge</h3>
        <ol className="list-decimal list-inside space-y-1 text-white pl-6">
          <li>Click on the menu in the top right corner</li>
          <li>Select "Settings"</li>
          <li>Click on "Cookies and site permissions"</li>
          <li>Click on "Manage and delete cookies and site data"</li>
          <li>Choose your preferred settings</li>
        </ol>
      </>
    ),
  },
  {
    title: '6. Cookie Consent',
    content: (
      <p className="text-white">When you first visit our Services, we may display a cookie banner allowing you to accept or decline non-essential cookies. You can change your preferences at any time through our cookie settings in the footer of our website.</p>
    ),
  },
  {
    title: '7. Do Not Track Signals',
    content: (
      <p className="text-white">Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activities tracked. Our Services do not currently respond to "Do Not Track" signals.</p>
    ),
  },
  {
    title: '8. Changes to This Cookie Policy',
    content: (
      <p className="text-white">We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised policy. We encourage you to periodically review this page for the latest information on our cookie practices.</p>
    ),
  },
//   {
//     title: '9. Contact Us',
//     content: (
//       <>
//         <p className="text-white">If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
//         <address className="not-italic mt-2 text-white">
//           Nomore.Report<br />
//           [Your Address]<br />
//           [Your City, State ZIP]<br />
//           Email: <a href="mailto:privacy@nomore.report" className="underline text-blue-300">privacy@nomore.report</a>
//         </address>
//       </>
//     ),
//   },
];

const CookiePolicy: React.FC = () => (
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
        <div className="text-center mb-12 space-y-4">
          <span className="px-3 py-1 text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">Cookies</span>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] bg-clip-text text-transparent drop-shadow-xl">Cookie Policy</h1>
          <p className="text-white text-base">Last Updated: April 23, 2025</p>
        </div>
        <div className="space-y-8">
          {cookieSections.map((section, idx) => (
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

export default CookiePolicy;