import React from 'react';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-900 tracking-tight">
            Intelligent Content
            <br />
            <span className="text-blue-600">Analysis & Generation</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of AI to analyze, generate, and optimize your content across platforms.
            From detailed content analysis to social media adaptation.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold border-2 border-blue-100 hover:border-blue-200 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e0effe_100%)]"></div>
    </div>
  );
}