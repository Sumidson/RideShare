"use client";
import React, { useEffect, useState } from 'react';
import { Smartphone, Users, CheckCircle, Download, MapPin, Plus } from 'lucide-react';

// Custom animations using CSS classes
const MotionDiv = ({ children, className, delay = 0, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`${className} transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

const RideshareLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <style jsx>{`
        @keyframes moving-car-1 {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes moving-car-2 {
          0% { transform: translateX(-80px); }
          100% { transform: translateX(calc(100vw + 80px)); }
        }
        @keyframes moving-car-3 {
          0% { transform: translateX(-120px); }
          100% { transform: translateX(calc(100vw + 120px)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(10px) rotate(2deg); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
        }
        @keyframes counter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-moving-car-1 { animation: moving-car-1 15s linear infinite; }
        .animate-moving-car-2 { animation: moving-car-2 12s linear infinite 2s; }
        .animate-moving-car-3 { animation: moving-car-3 18s linear infinite 1s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-gradient-text { 
          background-size: 200% 200%;
          animation: gradient-text 3s ease infinite;
        }
        .animate-sway { animation: sway 4s ease-in-out infinite; }
        .animate-sway-reverse { animation: sway 4s ease-in-out infinite reverse; }
        .animate-bounce-horizontal { animation: bounce-horizontal 2s ease-in-out infinite; }
        .animate-counter { animation: counter 1s ease-out; }
      `}</style>

      {/* Moving Car Background */}
      <div className="fixed top-20 w-full h-32 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-full h-full">
          <div className="absolute top-8 w-16 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl shadow-lg animate-moving-car-1">
            <div className="absolute bottom-0 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
            <div className="absolute bottom-0 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-white bg-opacity-30 rounded"></div>
          </div>
          
          <div className="absolute top-16 w-12 h-6 bg-gradient-to-r from-pink-400 to-orange-500 rounded-xl shadow-lg animate-moving-car-2">
            <div className="absolute bottom-0 left-1 w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="absolute bottom-0 right-1 w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white bg-opacity-30 rounded"></div>
          </div>
          
          <div className="absolute top-4 w-14 h-7 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-lg animate-moving-car-3">
            <div className="absolute bottom-0 left-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
            <div className="absolute bottom-0 right-1.5 w-2.5 h-2.5 bg-gray-800 rounded-full"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-7 h-3 bg-white bg-opacity-30 rounded"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-white z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <MotionDiv className="space-y-8" delay={0.2}>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Let's take the{' '}
                  <span className="text-indigo-600 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
                    hassle
                  </span>
                  <br />
                  out of daily commute.
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Connect with fellow commuters, share rides, and make your daily journey more affordable, 
                  eco-friendly, and social. Join thousands who've already transformed their commute.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-lg animate-pulse-slow">
                  <MapPin className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Find a Ride</span>
                </button>
                <button className="group flex items-center justify-center gap-3 bg-white text-indigo-600 border-2 border-indigo-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-indigo-50 hover:scale-105 shadow-lg">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Offer a Ride</span>
                </button>
              </div>
            </MotionDiv>

            <MotionDiv className="relative" delay={0.5}>
              <div className="relative z-10">
                <div className="mx-auto w-72 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-float">
                  <div className="w-full h-full bg-gradient-to-b from-indigo-400 to-purple-500 rounded-2xl relative overflow-hidden">
                    <div className="p-6 text-white">
                      <div className="text-center mb-8">
                        <div className="bg-indigo-600 rounded-full px-4 py-2 inline-block mb-4 animate-pulse">
                          <span className="text-sm font-medium">Be ready. Coming to pick you...</span>
                        </div>
                        <p className="text-xs opacity-80">ARRIVING IN 3 MINS</p>
                      </div>
                      
                      <div className="flex justify-center mb-6">
                        <div className="w-32 h-20 bg-white bg-opacity-20 rounded-2xl relative shadow-lg animate-bounce-slow">
                          <div className="absolute bottom-0 left-4 w-6 h-6 bg-gray-700 rounded-full animate-spin-slow"></div>
                          <div className="absolute bottom-0 right-4 w-6 h-6 bg-gray-700 rounded-full animate-spin-slow"></div>
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white bg-opacity-30 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-8 -left-8 w-16 h-16 bg-indigo-200 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-200 rounded-full animate-pulse opacity-60"></div>
              </div>

              <div className="absolute top-20 -left-20 opacity-30 animate-sway">
                <div className="w-16 h-32 bg-indigo-400 rounded-full relative">
                  <div className="absolute top-2 w-8 h-8 bg-indigo-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="absolute bottom-20 -right-16 opacity-30 animate-sway-reverse">
                <div className="w-16 h-32 bg-purple-400 rounded-full relative">
                  <div className="absolute top-2 w-8 h-8 bg-purple-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <MotionDiv className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative z-10" delay={0.8}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Forget about{' '}
              <span className="text-indigo-600 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                surplus charges
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share the cost, share the journey. Our platform connects you with verified commuters 
              going your way, cutting your travel expenses by up to 70%.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-center">
            <MotionDiv className="flex justify-center" delay={1.0}>
              <div className="relative group cursor-pointer">
                <div className="w-24 h-48 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-full relative shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-wiggle">
                  <div className="absolute top-4 w-12 h-12 bg-indigo-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                    <Smartphone className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md animate-bounce-slow">
                  <span className="text-sm font-medium text-gray-700">Book Ride</span>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv className="flex justify-center relative" delay={1.2}>
              <div className="flex items-center gap-8">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-40 bg-gradient-to-b from-indigo-400 to-indigo-500 rounded-full relative shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-wiggle">
                    <div className="absolute top-3 w-10 h-10 bg-indigo-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-100 p-4 rounded-full mb-2 animate-pulse">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Match Found</span>
                </div>

                <div className="relative group cursor-pointer">
                  <div className="w-20 h-40 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full relative shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-wiggle">
                    <div className="absolute top-3 w-10 h-10 bg-purple-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv className="flex justify-center relative" delay={1.4}>
              <div className="relative group cursor-pointer">
                <div className="w-24 h-48 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full relative shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-wiggle">
                  <div className="absolute top-4 w-12 h-12 bg-orange-600 rounded-full mx-auto left-1/2 transform -translate-x-1/2"></div>
                </div>
                
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <div className="w-24 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl relative shadow-lg animate-bounce-horizontal">
                    <div className="absolute bottom-0 left-2 w-4 h-4 bg-gray-800 rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-0 right-2 w-4 h-4 bg-gray-800 rounded-full animate-spin-slow"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-white bg-opacity-30 rounded-lg"></div>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md animate-bounce-slow">
                  <span className="text-sm font-medium text-gray-700">Ride Share</span>
                </div>
              </div>
            </MotionDiv>
          </div>

          <MotionDiv className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8" delay={1.6}>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2 animate-counter">70%</div>
              <div className="text-gray-600">Cost Savings</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2 animate-counter">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2 animate-counter">25+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold text-indigo-600 mb-2 animate-counter">4.8★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>

      {/* CTA Section */}
      <MotionDiv className="py-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 relative overflow-hidden z-10" delay={2.0}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Ready to transform your{' '}
              <span className="text-yellow-300 animate-pulse">daily commute?</span>
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Join thousands of commuters who have already discovered a smarter, cheaper, and more social way to travel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-indigo-50 hover:scale-105 shadow-lg flex items-center gap-3">
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                <span>Download App</span>
              </button>
              <button className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-indigo-600 hover:scale-105 flex items-center gap-3">
                <Users className="w-6 h-6 group-hover:animate-bounce" />
                <span>Join Community</span>
              </button>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default RideshareLanding;