"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Send,
  Clock,
  X,
  Loader2,
  Calendar,
  DollarSign,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Camera,
} from "lucide-react";

const Chat = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Chat History
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Lens ✨ Ask me about availability, pricing, or let's book your photography session!",
    },
  ]);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Services Data
  const services = [
    {
      name: "Commercial Photography",
      description:
        "High-quality imagery tailored for advertising, marketing, and corporate use",
    },
    {
      name: "Content Creation for Brands",
      description:
        "Strategic photo and video content designed to build brand identity and engagement",
    },
    {
      name: "High End Retouching",
      description:
        "Advanced professional retouching for flawless, polished final visuals",
    },
    {
      name: "Video Editing & Coloring",
      description:
        "Cinematic video editing with professional color grading and visual enhancement",
    },
  ];

  const messagesContainerRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoadingSlots(true);
        const res = await fetch("/api/calendar/availability?days=7");
        const data = await res.json();
        if (data.available) {
          setAvailableSlots(data.available);
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailability();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle initial send from landing
  const handleInitialSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setShowPortal(true);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      // Handle intents from backend
      if (data.intent === "show_schedule") {
        setTimeout(() => setShowSchedule(true), 500);
      } else if (data.intent === "show_pricing") {
        setTimeout(() => setShowPricing(true), 500);
      } else if (data.intent === "book" && data.booking_details) {
        console.log("Booking details:", data.booking_details);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.assistant_message || "I'm here to help!",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle send in portal
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      // Handle intents from backend
      if (data.intent === "show_schedule") {
        try {
          setLoadingSlots(true);
          const res = await fetch("/api/calendar/availability?days=7");
          const resData = await res.json();
          if (resData.available) {
            setAvailableSlots(resData.available);
          }
        } catch (err) {
          console.error("Failed to fetch availability:", err);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }

        setShowSchedule(true);
      } else if (data.intent === "show_pricing") {
        setTimeout(() => setShowPricing(true), 500);
      } else if (data.intent === "book" && data.booking_details) {
        console.log("Booking details:", data.booking_details);
        // TODO: Handle booking confirmation
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.assistant_message || "I'm here to help!",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showPortal) {
        handleSend();
      } else {
        handleInitialSend();
      }
    }
  };

  // Handle sidebar toggle with smooth animation
  const toggleSidebar = (type) => {
    if (type === "schedule") {
      if (showSchedule) {
        setShowSchedule(false);
      } else {
        setShowPricing(false);
        setTimeout(() => setShowSchedule(true), 100);
      }
    } else if (type === "pricing") {
      if (showPricing) {
        setShowPricing(false);
      } else {
        setShowSchedule(false);
        setTimeout(() => setShowPricing(true), 100);
      }
    }
  };

  const selectTimeSlot = (slot, date) => {
    const slotDate = new Date(slot.start);
    const message = `I'd like to book ${slotDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })} on ${new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}`;
    setInput(message);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const hasSidebar = showSchedule || showPricing;

  // Portal Content
  const portalContent = showPortal && (
    <div className="fixed inset-0 z-[999] animate-portal-overlay backdrop-blur-lg">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowPortal(false)}
      />

      {/* Portal Container */}
      <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 animate-portal-content">
        {/* Close Button */}
        <button
          onClick={() => setShowPortal(false)}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 cursor-pointer z-50 p-2 sm:p-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all duration-200 text-neutral-400 hover:text-neutral-200 shadow-xl"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative z-10 w-full max-w-7xl h-[95vh] sm:h-[90vh]">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-full">
            {/* Main Chat Container */}
            <div
              ref={chatContainerRef}
              className={`h-full rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl flex flex-col transition-all duration-700 ease-in-out shadow-2xl ${
                hasSidebar ? "lg:w-[60%] hidden lg:flex" : "w-full"
              }`}
            >
              {/* Header */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-800 flex items-center justify-center ring-2 ring-neutral-700/50">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-neutral-900"></div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-neutral-100">
                      LENS AI
                    </h1>
                    <p className="text-[10px] sm:text-xs text-neutral-500">
                      Your AI Assistant
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6"
                style={{ overscrollBehavior: "contain" }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg ${
                        msg.role === "user"
                          ? "bg-neutral-100 text-neutral-900 rounded-br-sm font-medium"
                          : "bg-neutral-900/80 border border-neutral-800/80 text-neutral-100 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-xl sm:rounded-2xl rounded-tl-sm px-4 sm:px-5 py-3 sm:py-3.5">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="px-4 sm:px-8 pb-3 sm:pb-4 flex-shrink-0">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleSidebar("schedule")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-[11px] sm:text-xs transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                      showSchedule
                        ? "bg-neutral-100 text-neutral-900 border-neutral-100 shadow-lg font-medium"
                        : "bg-neutral-900/50 hover:bg-neutral-800/80 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                    }`}
                  >
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">{showSchedule ? "Hide Schedule" : "View Schedule"}</span>
                    <span className="sm:hidden">Schedule</span>
                  </button>
                  <button
                    onClick={() => toggleSidebar("pricing")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-[11px] sm:text-xs transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                      showPricing
                        ? "bg-neutral-100 text-neutral-900 border-neutral-100 shadow-lg font-medium"
                        : "bg-neutral-900/50 hover:bg-neutral-800/80 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                    }`}
                  >
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Services Info</span>
                    <span className="sm:hidden">Services</span>
                  </button>
                </div>
              </div>

              {/* Input */}
              <div className="px-4 sm:px-8 pb-4 sm:pb-8 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 bg-neutral-900/60 border border-neutral-800 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-neutral-700 transition-all duration-300 shadow-lg">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-600 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none text-xs sm:text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-neutral-100 hover:bg-white text-neutral-900 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Send</span>
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - Schedule or Pricing */}
            <div
              className={`h-full rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl flex flex-col transition-all duration-700 ease-in-out shadow-2xl ${
                hasSidebar
                  ? "w-full lg:w-[40%] opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-8 pointer-events-none hidden lg:flex"
              }`}
              style={{
                filter: hasSidebar ? "blur(0px)" : "blur(10px)",
              }}
            >
              {showSchedule && (
                <>
                  {/* Schedule Header */}
                  <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base sm:text-lg font-semibold text-neutral-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                        Available Times
                      </h2>
                      <button
                        onClick={() => setShowSchedule(false)}
                        className="p-1.5 hover:bg-neutral-800/50 rounded-lg transition-colors text-neutral-500 hover:text-neutral-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-neutral-600">
                      Select your preferred time slot
                    </p>
                  </div>

                  {/* Schedule Content */}
                  <div
                    className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    <div className="space-y-4 sm:space-y-6">
                      {availableSlots.map((day, dayIdx) => (
                        <div
                          key={dayIdx}
                          className="animate-fade-in"
                          style={{ animationDelay: `${dayIdx * 100}ms` }}
                        >
                          <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-neutral-800/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
                            <h3 className="text-xs sm:text-sm font-semibold text-neutral-300">
                              {formatDate(day.date)}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {day.slots.map((slot, slotIdx) => (
                              <button
                                key={slotIdx}
                                onClick={() => selectTimeSlot(slot, day.date)}
                                className="group relative px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-900/60 hover:bg-neutral-100 border border-neutral-800 hover:border-neutral-700 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
                                    {formatTime(slot.start)}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700 group-hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {showPricing && (
                <>
                  {/* Pricing Header */}
                  <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base sm:text-lg font-semibold text-neutral-100 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                        Our Services
                      </h2>
                      <button
                        onClick={() => setShowPricing(false)}
                        className="p-1.5 hover:bg-neutral-800/50 rounded-lg transition-colors text-neutral-500 hover:text-neutral-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-neutral-600">
                      Professional photography packages
                    </p>
                  </div>

                  {/* Pricing Content */}
                  <div
                    className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-2 sm:space-y-3"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    {services.map((service, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setInput(`I'm interested in the ${service.name}`)
                        }
                        className="group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-neutral-800/60 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                          <h4 className="font-semibold text-sm sm:text-base text-neutral-200 group-hover:text-neutral-100 transition-colors">
                            {service.name}
                          </h4>
                        </div>
                        <p className="text-[11px] sm:text-xs text-neutral-500 mb-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes portal-overlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes portal-content {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .animate-portal-overlay {
          animation: portal-overlay 0.3s ease-out forwards;
        }

        .animate-portal-content {
          animation: portal-content 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgb(64, 64, 64);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgb(82, 82, 82);
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Landing Page */}
      <div className="relative min-h-screen bg-gradient-to-b from-black via-[#121E25] to-[#09131B] flex items-center justify-center p-4 sm:p-6 overflow-hidden mb-0.5 -mt-0.5">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-1/20 -left-24 sm:-left-48 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl ${
              showPortal ? "opacity-70" : "opacity-0"
            } transition duration-500`}
          />
          <div
            className={`absolute bottom-1/9 -right-24 sm:-right-42 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl ${
              showPortal ? "opacity-70" : "opacity-0"
            } transition duration-500`}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl w-full text-center px-4">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-neutral-900/50 border border-neutral-800 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
            <span className="text-xs sm:text-sm font-medium text-neutral-400">
              AI-Powered Booking
            </span>
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent px-2">
            Simple & Seamless
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Chat with Lens AI to instantly check availability, explore our
            services, and book your session in seconds.
          </p>

          {/* Main Input */}
          <div className="max-w-2xl mx-auto px-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-neutral-800/30 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-neutral-950 border border-neutral-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 px-2 sm:px-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 ml-1 sm:ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about availability, pricing, or book..."
                    className="flex-1 bg-transparent text-white placeholder-neutral-600 px-1 sm:px-2 py-3 sm:py-4 focus:outline-none text-sm sm:text-base md:text-lg min-w-0"
                  />
                </div>
                <button
                  onClick={handleInitialSend}
                  disabled={!input.trim()}
                  className="bg-neutral-100 hover:bg-white text-neutral-900 rounded-lg sm:rounded-xl px-6 sm:px-8 py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  Start Chat
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-neutral-600">AI Assistance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                {"<"} 2min
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Booking Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">100%</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-neutral-600">
                Instant Confirmation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(portalContent, document.body)}
    </>
  );
};

export default Chat;


// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import {
//   Send,
//   Clock,
//   X,
//   Loader2,
//   Calendar,
//   DollarSign,
//   Sparkles,
//   ChevronRight,
//   MessageCircle,
//   Camera,
// } from "lucide-react";
// import axios from "axios";

// const Chat = () => {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPortal, setShowPortal] = useState(false);
//   const [showSchedule, setShowSchedule] = useState(false);
//   const [showPricing, setShowPricing] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Chat History
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content:
//         "Hi! I'm Lens ✨ Ask me about availability, pricing, or let's book your photography session!",
//     },
//   ]);

//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loadingSlots, setLoadingSlots] = useState(true);

//   // Services Data
//   const services = [
//     {
//       name: "Commercial Photography ",
//       description:
//         "High-quality imagery tailored for advertising, marketing, and corporate use",
//     },
//     {
//       name: "Content Creation for Brands",
//       description:
//         "Strategic photo and video content designed to build brand identity and engagement",
//     },
//     {
//       name: "High End Retouching",
//       description:
//         "Advanced professional retouching for flawless, polished final visuals",
//     },
//     {
//       name: "Video Editing & Coloring",
//       description:
//         "Cinematic video editing with professional color grading and visual enhancement",
//     },
//   ];

//   const messagesContainerRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const fetchAvailability = async () => {
//       try {
//         setLoadingSlots(true);
//         const res = await axios.get("/api/calendar/availability?days=7");
//         if (res.data.available) {
//           setAvailableSlots(res.data.available);
//         }
//       } catch (error) {
//         console.error("Failed to fetch availability:", error);
//       } finally {
//         setLoadingSlots(false);
//       }
//     };
//     fetchAvailability();
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Scroll to bottom
//   useEffect(() => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop =
//         messagesContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Handle initial send from landing
//   const handleInitialSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setShowPortal(true);

//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: currentInput,
//           conversationHistory: messages,
//         }),
//       });

//       const data = await response.json();

//       // Handle intents from backend
//       if (data.intent === "show_schedule") {
//         setTimeout(() => setShowSchedule(true), 500);
//       } else if (data.intent === "show_pricing") {
//         setTimeout(() => setShowPricing(true), 500);
//       } else if (data.intent === "book" && data.booking_details) {
//         console.log("Booking details:", data.booking_details);
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: data.assistant_message || "I'm here to help!",
//         },
//       ]);
//     } catch (error) {
//       console.error("Chat error:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, I'm having trouble connecting. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle send in portal
//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     const currentInput = input;
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: currentInput,
//           conversationHistory: messages,
//         }),
//       });

//       const data = await response.json();

//       // Handle intents from backend
//       if (data.intent === "show_schedule") {
//         try {
//           setLoadingSlots(true);
//           const res = await axios.get("/api/calendar/availability?days=7");
//           if (res.data.available) {
//             setAvailableSlots(res.data.available);
//           }
//         } catch (err) {
//           console.error("Failed to fetch availability:", err);
//           setAvailableSlots([]);
//         } finally {
//           setLoadingSlots(false);
//         }

//         setShowSchedule(true); // open the schedule table
//       } else if (data.intent === "show_pricing") {
//         setTimeout(() => setShowPricing(true), 500);
//       } else if (data.intent === "book" && data.booking_details) {
//         console.log("Booking details:", data.booking_details);
//         // TODO: Handle booking confirmation
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: data.assistant_message || "I'm here to help!",
//         },
//       ]);
//     } catch (error) {
//       console.error("Chat error:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Sorry, I'm having trouble connecting. Please try again.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (showPortal) {
//         handleSend();
//       } else {
//         handleInitialSend();
//       }
//     }
//   };

//   // Handle sidebar toggle with smooth animation
//   const toggleSidebar = (type) => {
//     if (type === "schedule") {
//       if (showSchedule) {
//         setShowSchedule(false);
//       } else {
//         setShowPricing(false);
//         setTimeout(() => setShowSchedule(true), 100);
//       }
//     } else if (type === "pricing") {
//       if (showPricing) {
//         setShowPricing(false);
//       } else {
//         setShowSchedule(false);
//         setTimeout(() => setShowPricing(true), 100);
//       }
//     }
//   };

//   const selectTimeSlot = (slot, date) => {
//     const slotDate = new Date(slot.start);
//     const message = `I'd like to book ${slotDate.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//     })} on ${new Date(date).toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "long",
//       day: "numeric",
//     })}`;
//     setInput(message);
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatTime = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//     });
//   };

//   const hasSidebar = showSchedule || showPricing;

//   // Portal Content
//   const portalContent = showPortal && (
//     <div className="fixed inset-0 z-[999] animate-portal-overlay backdrop-blur-lg">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40 "
//         onClick={() => setShowPortal(false)}
//       />

//       {/* Portal Container */}
//       <div className="relative w-full h-full flex items-center justify-center p-6 animate-portal-content">
//         {/* Background elements */}

//         {/* Close Button */}
//         <button
//           onClick={() => setShowPortal(false)}
//           className="absolute top-8 right-8 cursor-pointer z-50 p-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all duration-200 text-neutral-400 hover:text-neutral-200 shadow-xl"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="relative z-10 w-full max-w-7xl h-[90vh]">
//           <div className="flex gap-4 h-full">
//             {/* Main Chat Container */}
//             <div
//               ref={chatContainerRef}
//               className={`h-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl flex flex-col transition-all duration-700 ease-in-out shadow-2xl ${
//                 hasSidebar ? "w-[60%]" : "w-full"
//               }`}
//             >
//               {/* Header */}
//               <div className="px-8 py-6 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center ring-2 ring-neutral-700/50">
//                       <Sparkles className="w-5 h-5 text-neutral-300" />
//                     </div>
//                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900"></div>
//                   </div>
//                   <div>
//                     <h1 className="text-xl font-semibold text-neutral-100">
//                       LENS AI
//                     </h1>
//                     <p className="text-xs text-neutral-500">
//                       Your AI Assistant
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div
//                 ref={messagesContainerRef}
//                 className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
//                 style={{ overscrollBehavior: "contain" }}
//               >
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex ${
//                       msg.role === "user" ? "justify-end" : "justify-start"
//                     } animate-fade-in`}
//                     style={{ animationDelay: `${idx * 50}ms` }}
//                   >
//                     <div
//                       className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-lg ${
//                         msg.role === "user"
//                           ? "bg-neutral-100 text-neutral-900 rounded-br-sm font-medium"
//                           : "bg-neutral-900/80 border border-neutral-800/80 text-neutral-100 rounded-tl-sm"
//                       }`}
//                     >
//                       <p className="text-sm leading-relaxed">{msg.content}</p>
//                     </div>
//                   </div>
//                 ))}

//                 {loading && (
//                   <div className="flex justify-start">
//                     <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl rounded-tl-sm px-5 py-3.5">
//                       <div className="flex gap-1.5">
//                         <div
//                           className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
//                           style={{ animationDelay: "0ms" }}
//                         />
//                         <div
//                           className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
//                           style={{ animationDelay: "150ms" }}
//                         />
//                         <div
//                           className="w-2 h-2 bg-neutral-600 rounded-full animate-bounce"
//                           style={{ animationDelay: "300ms" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Quick Actions */}
//               <div className="px-8 pb-4 flex-shrink-0">
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={() => toggleSidebar("schedule")}
//                     className={`px-4 py-2 border rounded-full text-xs transition-all duration-300 flex items-center gap-2 ${
//                       showSchedule
//                         ? "bg-neutral-100 text-neutral-900 border-neutral-100 shadow-lg font-medium"
//                         : "bg-neutral-900/50 hover:bg-neutral-800/80 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
//                     }`}
//                   >
//                     <Calendar className="w-3.5 h-3.5" />
//                     {showSchedule ? "Hide Schedule" : "View Schedule"}
//                   </button>
//                   <button
//                     onClick={() => toggleSidebar("pricing")}
//                     className={`px-4 py-2 border rounded-full text-xs transition-all duration-300 flex items-center gap-2 ${
//                       showPricing
//                         ? "bg-neutral-100 text-neutral-900 border-neutral-100 shadow-lg font-medium"
//                         : "bg-neutral-900/50 hover:bg-neutral-800/80 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
//                     }`}
//                   >
//                     <Camera className="w-3.5 h-3.5" />
//                     Services Info
//                   </button>
//                 </div>
//               </div>

//               {/* Input */}
//               <div className="px-8 pb-8 flex-shrink-0">
//                 <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-2 focus-within:border-neutral-700 transition-all duration-300 shadow-lg">
//                   <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     disabled={loading}
//                     placeholder="Ask me anything..."
//                     className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-600 px-4 py-3 focus:outline-none text-sm"
//                   />
//                   <button
//                     onClick={handleSend}
//                     disabled={loading || !input.trim()}
//                     className="bg-neutral-100 hover:bg-white text-neutral-900 rounded-xl px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 font-semibold text-sm"
//                   >
//                     {loading ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <>
//                         Send
//                         <Send className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar - Schedule or Pricing */}
//             <div
//               className={`h-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950/95 backdrop-blur-xl flex flex-col transition-all duration-700 ease-in-out shadow-2xl ${
//                 hasSidebar
//                   ? "w-[40%] opacity-100 translate-x-0"
//                   : "w-0 opacity-0 translate-x-8 pointer-events-none"
//               }`}
//               style={{
//                 filter: hasSidebar ? "blur(0px)" : "blur(10px)",
//               }}
//             >
//               {showSchedule && (
//                 <>
//                   {/* Schedule Header */}
//                   <div className="px-6 py-5 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
//                     <div className="flex items-center justify-between mb-1">
//                       <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
//                         <Calendar className="w-5 h-5 text-neutral-400" />
//                         Available Times
//                       </h2>
//                       <button
//                         onClick={() => setShowSchedule(false)}
//                         className="p-1.5 hover:bg-neutral-800/50 rounded-lg transition-colors text-neutral-500 hover:text-neutral-300"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <p className="text-xs text-neutral-600">
//                       Select your preferred time slot
//                     </p>
//                   </div>

//                   {/* Schedule Content */}
//                   <div
//                     className="flex-1 overflow-y-auto px-6 py-5"
//                     style={{ overscrollBehavior: "contain" }}
//                   >
//                     <div className="space-y-6">
//                       {availableSlots.map((day, dayIdx) => (
//                         <div
//                           key={dayIdx}
//                           className="animate-fade-in"
//                           style={{ animationDelay: `${dayIdx * 100}ms` }}
//                         >
//                           <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800/50">
//                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-500"></div>
//                             <h3 className="text-sm font-semibold text-neutral-300">
//                               {formatDate(day.date)}
//                             </h3>
//                           </div>

//                           <div className="grid grid-cols-2 gap-2">
//                             {day.slots.map((slot, slotIdx) => (
//                               <button
//                                 key={slotIdx}
//                                 onClick={() => selectTimeSlot(slot, day.date)}
//                                 className="group relative px-4 py-3 bg-neutral-900/60 hover:bg-neutral-100 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all duration-300 hover:scale-105"
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-900 transition-colors">
//                                     {formatTime(slot.start)}
//                                   </span>
//                                   <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-900 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
//                                 </div>
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               )}

//               {showPricing && (
//                 <>
//                   {/* Pricing Header */}
//                   <div className="px-6 py-5 border-b border-neutral-800/80 bg-neutral-900/50 flex-shrink-0">
//                     <div className="flex items-center justify-between mb-1">
//                       <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
//                         <DollarSign className="w-5 h-5 text-neutral-400" />
//                         Our Services
//                       </h2>
//                       <button
//                         onClick={() => setShowPricing(false)}
//                         className="p-1.5 hover:bg-neutral-800/50 rounded-lg transition-colors text-neutral-500 hover:text-neutral-300"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <p className="text-xs text-neutral-600">
//                       Professional photography packages
//                     </p>
//                   </div>

//                   {/* Pricing Content */}
//                   <div
//                     className="flex-1 overflow-y-auto px-6 py-5 space-y-3"
//                     style={{ overscrollBehavior: "contain" }}
//                   >
//                     {services.map((service, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() =>
//                           setInput(`I'm interested in the ${service.name}`)
//                         }
//                         className="group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 hover:bg-neutral-800/60 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
//                         style={{ animationDelay: `${idx * 100}ms` }}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="font-semibold text-base text-neutral-200 group-hover:text-neutral-100 transition-colors">
//                             {service.name}
//                           </h4>
                          
//                         </div>
//                         <p className="text-xs text-neutral-500 mb-2 leading-relaxed">
//                           {service.description}
//                         </p>
                        
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes portal-overlay {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes portal-content {
//           from {
//             opacity: 0;
//             transform: scale(0.96) translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.4s ease-out forwards;
//         }

//         .animate-portal-overlay {
//           animation: portal-overlay 0.3s ease-out forwards;
//         }

//         .animate-portal-content {
//           animation: portal-content 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }

//         /* Custom scrollbar */
//         ::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }

//         ::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         ::-webkit-scrollbar-thumb {
//           background: rgb(64, 64, 64);
//           border-radius: 3px;
//         }

//         ::-webkit-scrollbar-thumb:hover {
//           background: rgb(82, 82, 82);
//         }
//       `}</style>
//     </div>
//   );

//   return (
//     <>
//       {/* Landing Page */}
//       <div className="relative min-h-screen bg-gradient-to-b from-black via-[#121E25] to-[#09131B]  flex items-center justify-center p-6 overflow-hidden mb-0.5 -mt-0.5">
//         {/* Background elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <img
//             src="/gradients/sky_gradient_white.png"
//             className={`absolute top-1/20 -left-48 w-96 h-96  blur-xl  ${
//               showPortal ? "opacity-70" : "opacity-0"
//             } transition duration-500`}
//             alt=""
//           />
//           <img
//             src="/gradients/sky_gradient_white.png"
//             className={`absolute bottom-1/9  -right-42 w-96 h-96  blur-xl  ${
//               showPortal ? "opacity-70" : "opacity-0"
//             } transition duration-500`}
//             alt=""
//           />
//         </div>

//         {/* Main Content */}
//         <div className="relative z-10 max-w-4xl w-full text-center">
//           {/* Logo/Brand */}
//           <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-neutral-900/50 border border-neutral-800 rounded-full backdrop-blur-sm">
//             <Sparkles className="w-5 h-5 text-neutral-400" />
//             <span className="text-sm font-medium text-neutral-400">
//               AI-Powered Booking
//             </span>
//           </div>

//           {/* Hero Text */}
//           <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-gradient">
//             Simple & Seamless
//             {/* <span className="block text-gradient">
//             Find your path.

//             </span> */}
//           </h1>

//           <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed">
//             Chat with Lens AI to instantly check availability, explore our
//             services, and book your session in seconds.
//           </p>

//           {/* Main Input */}
//           <div className="max-w-2xl mx-auto">
//             <div className="relative group">
//               <div className="absolute -inset-0.5 bg-neutral-800/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
//               <div className="relative flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-2xl p-3 shadow-2xl">
//                 <MessageCircle className="w-5 h-5 text-neutral-600 ml-3" />
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={handleKeyPress}
//                   placeholder="Ask about availability, pricing, or book a session..."
//                   className="flex-1 bg-transparent text-white placeholder-neutral-600 px-2 py-4 focus:outline-none text-lg"
//                 />
//                 <button
//                   onClick={handleInitialSend}
//                   disabled={!input.trim()}
//                   className="bg-neutral-100 hover:bg-white text-neutral-900 rounded-xl px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
//                 >
//                   Start Chat
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-2">24/7</div>
//               <div className="text-sm text-neutral-600">AI Assistance</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-2">
//                 {"<"} 2min
//               </div>
//               <div className="text-sm text-neutral-600">Booking Time</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-2">100%</div>
//               <div className="text-sm text-neutral-600">
//                 Instant Confirmation
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Portal */}
//       {mounted &&
//         typeof document !== "undefined" &&
//         createPortal(portalContent, document.body)}
//     </>
//   );
// };

// export default Chat;
