// "use client";
// import React from "react";

// export const TestimonialCard = ({ name, position, company, testimonial, photo }) => (
//   <div className="group/testimonial relative w-[30rem] h-[25rem] shrink-0 bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out">
//     <img
//       src={photo}
//       alt={name}
//       className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover/testimonial:opacity-40 transition-opacity"
//     />
//     <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
//       <p className="text-lg italic mb-4 text-neutral-200 leading-relaxed">
//         “{testimonial}”
//       </p>
//       <div className="mt-auto">
//         <h3 className="text-xl font-semibold">{name}</h3>
//         <p className="text-sm opacity-80">
//           {position} — {company}
//         </p>
//       </div>
//     </div>
//   </div>
// );


"use client";
import React from "react";
import ShinyText from "./ShinyText";
import Image from "next/image";

export const TestimonialCard = ({
  name,
  position,
  company,
  testimonial,
  photo,
}) => (
  <div className="group/testimonial h-96 w-[30rem] bg-white/10 backdrop-blur-md border border-white/20 text-white p-8 rounded-2xl shrink-0 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:border-white/40 transition duration-500">
    
    <div className="flex flex-col justify-between h-full ">
      <p className="text-2xl leading-relaxed italic opacity-90  ">“{testimonial}”</p>

      <div className="flex items-center gap-4 mt-8">
        <img
          className="size-14 rounded-full object-cover border border-white/30"
          src={photo}
          alt={`${name}'s photo`}
        />
        
        
        <div>
          <h2 className=" relative flex items-center gap-2 text-lg font-semibold shiny-text ">
            {name}
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="absolute -right-6 top-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.6943 0.900204C5.51166 1.05585 5.42033 1.13369 5.3228 1.19906C5.09922 1.34891 4.84813 1.45291 4.58408 1.50504C4.46888 1.52779 4.34927 1.53733 4.11006 1.55642C3.50903 1.60439 3.2085 1.62836 2.95778 1.71692C2.37788 1.92175 1.92175 2.37788 1.71692 2.95778C1.62836 3.2085 1.60439 3.50903 1.55642 4.11006C1.53733 4.34927 1.52779 4.46888 1.50504 4.58408C1.45291 4.84813 1.34891 5.09922 1.19906 5.3228C1.13369 5.42033 1.05586 5.51165 0.900204 5.6943C0.509124 6.15323 0.313577 6.38265 0.198917 6.62258C-0.0663056 7.1775 -0.0663056 7.8225 0.198917 8.37743C0.313584 8.61735 0.509124 8.84678 0.900204 9.3057C1.05584 9.48833 1.13369 9.57968 1.19906 9.67718C1.34891 9.90075 1.45291 10.1519 1.50504 10.4159C1.52779 10.5311 1.53733 10.6508 1.55642 10.8899C1.60439 11.491 1.62836 11.7915 1.71692 12.0422C1.92175 12.6221 2.37788 13.0783 2.95778 13.2831C3.2085 13.3716 3.50903 13.3956 4.11006 13.4436C4.34927 13.4627 4.46888 13.4722 4.58408 13.495C4.84813 13.5471 5.09922 13.6511 5.3228 13.801C5.42033 13.8663 5.51165 13.9441 5.6943 14.0998C6.15323 14.4909 6.38265 14.6864 6.62258 14.8011C7.1775 15.0663 7.8225 15.0663 8.37743 14.8011C8.61735 14.6864 8.84678 14.4909 9.3057 14.0998C9.48833 13.9441 9.57968 13.8663 9.67718 13.801C9.90075 13.6511 10.1519 13.5471 10.4159 13.495C10.5311 13.4722 10.6508 13.4627 10.8899 13.4436C11.491 13.3956 11.7915 13.3716 12.0422 13.2831C12.6221 13.0783 13.0783 12.6221 13.2831 12.0422C13.3716 11.7915 13.3956 11.491 13.4436 10.8899C13.4627 10.6508 13.4722 10.5311 13.495 10.4159C13.5471 10.1519 13.6511 9.90075 13.801 9.67718C13.8663 9.57968 13.9441 9.48833 14.0998 9.3057C14.4909 8.84678 14.6864 8.61735 14.8011 8.37743C15.0663 7.8225 15.0663 7.1775 14.8011 6.62258C14.6864 6.38265 14.4909 6.15323 14.0998 5.6943C13.9441 5.51165 13.8663 5.42033 13.801 5.3228C13.6511 5.09922 13.5471 4.84813 13.495 4.58408C13.4722 4.46888 13.4627 4.34927 13.4436 4.11006C13.3956 3.50903 13.3716 3.2085 13.2831 2.95778C13.0783 2.37788 12.6221 1.92175 12.0422 1.71692C11.7915 1.62836 11.491 1.60439 10.8899 1.55642C10.6508 1.53733 10.5311 1.52779 10.4159 1.50504C10.1519 1.45291 9.90075 1.34891 9.67718 1.19906C9.57968 1.13369 9.48833 1.05586 9.3057 0.900204C8.84678 0.509124 8.61735 0.313584 8.37743 0.198917C7.8225 -0.0663056 7.1775 -0.0663056 6.62258 0.198917C6.38265 0.313577 6.15323 0.509124 5.6943 0.900204ZM10.7801 5.89736C11.0185 5.65898 11.0185 5.2725 10.7801 5.03412C10.5418 4.79575 10.1552 4.79575 9.91688 5.03412L6.27923 8.6718L5.0831 7.4757C4.84472 7.23735 4.45824 7.23735 4.21987 7.4757C3.9815 7.71405 3.9815 8.10053 4.21987 8.33895L5.84759 9.96668C6.08595 10.205 6.47243 10.205 6.71085 9.96668L10.7801 5.89736Z"
                fill="#2196F3"
              />
            </svg>
          </h2>
          <p className="text-sm text-gray-300">
            {position} @{company}
          </p>
        </div>
      </div>
    </div>
  </div>
);
