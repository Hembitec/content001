import React from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { FileSearch, Brain, Share2, Zap, CheckCircle } from 'lucide-react';

export function Landing() {
  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <span className="text-[1.7rem] font-medium tracking-tight text-blue-950 dark:text-white">ContentIQ</span>
            </div>
            <button
              onClick={scrollToAuth}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50"></div>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="flex flex-col gap-4">
              <span className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-medium text-blue-950 dark:text-white leading-[1.1]">
                Intelligent Content
              </span>
              <span className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-medium text-blue-600 leading-[1.1]">
                Analysis & Generation
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Harness the power of AI to analyze, generate, and optimize your content
              across platforms. From detailed content analysis to social media adaptation.
            </p>
            <div className="flex justify-center mt-12">
              <button
                onClick={scrollToAuth}
                className="px-8 py-3 text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-medium font-bold text-center text-gray-900 dark:text-white mb-16">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileSearch}
              title="Content Analysis"
              description="Get detailed insights on readability, tone, and engagement potential of your content."
            />
            <FeatureCard
              icon={Brain}
              title="AI Generation"
              description="Generate high-quality content with customizable tone and style using advanced AI."
            />
            <FeatureCard
              icon={Share2}
              title="Cross-Platform Optimization"
              description="Optimize your content for multiple social media platforms automatically."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              How ContentIQ Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Transform your content in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl font-medium text-blue-600 dark:text-blue-400">
                1
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-medium font-semibold mb-4 text-gray-900 dark:text-white">
                  Paste Your Content
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply paste your article, blog post, or social media content into ContentIQ's editor.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl font-medium text-blue-600 dark:text-blue-400">
                2
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-medium font-semibold mb-4 text-gray-900 dark:text-white">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes your content for readability, engagement, SEO optimization, and more.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl font-medium text-blue-600 dark:text-blue-400">
                3
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-medium font-semibold mb-4 text-gray-900 dark:text-white">
                  Get Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive actionable suggestions to improve your content's performance across platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Perfect for Every Content Creator
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              See how different professionals use ContentIQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium font-semibold text-gray-900 dark:text-white mb-4">
                Content Writers
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimize blog posts and articles for maximum engagement. Get suggestions for headlines, readability, and SEO improvements.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium font-semibold text-gray-900 dark:text-white mb-4">
                Social Media Managers
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create engaging social media posts optimized for each platform. Get hashtag suggestions and engagement predictions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium font-semibold text-gray-900 dark:text-white mb-4">
                Marketing Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyze marketing copy for effectiveness. Get insights on tone, clarity, and conversion optimization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-medium font-bold text-gray-900 dark:text-white mb-8">
            Ready to Transform Your Content?
          </h2>
          <div className="inline-flex rounded-md shadow">
            <button
              onClick={scrollToAuth}
              className="px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div id="auth-section" className="scroll-mt-20 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="text-left space-y-8">
              <h2 className="text-4xl sm:text-5xl font-medium font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Start Creating Better Content Today
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 font-inter">
                <p className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  Free access to all AI-powered tools
                </p>
                <p className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  Advanced content analysis and optimization
                </p>
                <p className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  Cross-platform content generation
                </p>
                <p className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  Real-time SEO recommendations
                </p>
              </div>
            </div>

            {/* Right Column - Sign Up Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl font-medium font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 font-inter leading-relaxed">{description}</p>
    </div>
  );
}