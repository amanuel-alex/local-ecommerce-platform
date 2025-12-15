'use client'

import Link from 'next/link'
import { 
  Search, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Users, 
  FileText, 
  Mail, 
  Phone,
  ChevronRight,
  Headphones,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  HelpCircle
} from 'lucide-react'
import { useState } from 'react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to 'My Orders' in your dashboard. Click on the order you want to track, and you'll see real-time tracking information including shipping updates."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for certain business accounts."
    },
    {
      question: "How can I return a product?",
      answer: "Products can be returned within 30 days of delivery. Go to 'My Orders', select the item you want to return, and follow the return process. Return shipping is free for defective items."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping typically takes 7-14 business days depending on the destination."
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 1 hour of placement if they haven't been processed for shipping. Go to 'My Orders' and click 'Cancel Order' next to the order you wish to cancel."
    },
    {
      question: "How do I create a seller account?",
      answer: "Go to our 'Become a Seller' page and fill out the application form. Once approved, you'll have access to your seller dashboard where you can list products and manage orders."
    }
  ]

  const helpCategories = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Payments & Billing",
      description: "Questions about payment methods, billing issues, and refunds",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Shipping & Delivery",
      description: "Track orders, shipping methods, and delivery times",
      color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: "Returns & Refunds",
      description: "Return policies, refund processes, and exchanges",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Account & Security",
      description: "Account management, security, and privacy",
      color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Seller Support",
      description: "For sellers: listing products, managing orders, payments",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Live chat, phone support, and emergency assistance",
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
  ]

  const contactMethods = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      action: "Start Chat",
      link: "#"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      description: "Send us an email and we'll reply within 24 hours",
      action: "Send Email",
      link: "mailto:support@markethub.com"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Support",
      description: "Call us Monday-Friday, 9AM-6PM EST",
      action: "Call Now",
      link: "tel:+1-800-123-4567"
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you today?
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Get answers to your questions, contact our support team, or browse our help articles
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full pl-12 py-4 rounded-full border-0 bg-white/10 backdrop-blur-sm placeholder:text-white/70 text-white focus:ring-2 focus:ring-white/30 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Browse Help Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Find answers organized by topic
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <button className="flex items-center justify-between w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <span className="font-medium">Browse Articles</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Quick answers to common questions
              </p>
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              View All FAQs
            </button>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronRight 
                    className={`h-5 w-5 transition-transform ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Still need help?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Our support team is here to help you 24/7
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {contactMethods.map((method, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {method.description}
                    </p>
                    <Link 
                      href={method.link}
                      className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                      {method.action}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Average response time: <span className="font-semibold">Under 5 minutes</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our support team is available 24/7 to assist you with any questions or concerns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Additional Resources
          </h2>
          
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Guides
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Video className="h-4 w-4 mr-2" />
                Videos
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                Community
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Getting Started Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to use MarketHub effectively
              </p>
              <button className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Read Guide
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Seller Handbook
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete guide for sellers on our platform
              </p>
              <button className="w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Read Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Submit a support ticket and our team will get back to you as soon as possible
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Submit Ticket
            </button>
            <button className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}