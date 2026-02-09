import { Award, Camera, Image as Mg, Users } from "lucide-react";
import Image  from "next/image";
import React from "react";

const Status = () => {
  return (
    <div className=" bg-gradient-to-r from-black to-[#0a212b]/20 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8  overflow-hidden">
      <div className="footer-section stats-section mb-16 sm:mb-70 w-full max-w-6xl mx-auto">
        <div className="sts-sc grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          <Image
            src="/gradients/sky_gradient_white.png"
            alt="gradient"
            width={400}
            height={400}
            className="absolute inset-0 opacity-40 scale-150 
            top-[0%] left-[50%] sm:left-[80%] lg:left-[115%] 
            z-200 object-contain pointer-events-none"
          />

          {/* Happy Clients */}
          <div className="text-center group stat-card">
            <div className="relative mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-t to-[#000000] via-red-50/10 from-[#0a212b]/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users fill="grey" className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t to-[#2b3132] via-gray-700 from-[#166a8e]/60 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div
              className="stat-number text-2xl sm:text-3xl font-bold text-gradient-stats mb-2"
              data-value="240"
            >
              240
            </div>
            <div className="text-gray-400 text-xs sm:text-sm shiny-text">Happy Clients</div>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/75 border mt-2 bg-slate-700/40 text-slate-200/90 border-gray-50/30">
              +1.5k this year
            </div>
          </div>

          {/* Photography Awards */}
          <div className="text-center group stat-card">
            <div className="relative mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-t to-[#000000] via-red-50/10 from-[#0a212b]/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t to-[#2b3132] via-gray-700 from-[#166a8e]/60 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div
              className="stat-number text-gradient-stats text-2xl sm:text-3xl font-bold  mb-2"
              data-value="15"
            >
              15
            </div>
            <div className="text-gray-400 text-xs sm:text-sm shiny-text">
              Photography Awards
            </div>
            <div className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/75 border bg-slate-700/40 text-slate-200/90 border-gray-50/30">
              Recognized Worldwide
            </div>
          </div>

          {/* Photoshoots Completed */}
          <div className="text-center group stat-card">
            <div className="relative mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-t to-[#000000] via-red-50/10 from-[#0a212b]/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t to-[#2b3132] via-gray-700 from-[#166a8e]/60 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div
              className="stat-number text-2xl sm:text-3xl font-bold text-gradient-stats mb-2"
              data-value="1200"
            >
              1200
            </div>
            <div className="text-gray-400 text-xs sm:text-sm shiny-text">
              Photoshoots Completed
            </div>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/75 border mt-2 bg-slate-700/40 text-slate-200/90 border-gray-50/30">
              Studio & Outdoor
            </div>
          </div>

          {/* Years of Experience */}
          <div className="text-center group stat-card">
            <div className="relative mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-t to-[#000000] via-red-50/10 from-[#0a212b]/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mg className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t to-[#2b3132] via-gray-700 from-[#166a8e]/60 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div
              className="stat-number text-2xl sm:text-3xl font-bold text-gradient-stats mb-2"
              data-value="7"
            >
              7
            </div>
            <div className="text-gray-400 text-xs sm:text-sm shiny-text">
              Years of Experience
            </div>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-black/75 border mt-2 bg-slate-700/40 text-slate-200/90 border-gray-50/30">
              Professional Photographer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;