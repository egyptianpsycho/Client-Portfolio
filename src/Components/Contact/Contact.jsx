"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {


  const [status, setStatus] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mzzqwoal", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        
        // SweetAlert2 Success
        Swal.fire({
          title: "Success!",
          text: "Your message was sent successfully. We'll contact you soon.",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#a3e635",
          background: "#1e293b",
          color: "#ffffff", 
          iconColor: "#a3e635", 
        });
        
        setStatus("");
      } else {
        setStatus("error");
        
        // SweetAlert2 Error
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444", // red
          background: "#1e293b",
          color: "#ffffff",
        });
      }
    } catch (error) {
      setStatus("error");
      
      // SweetAlert2 Error
      Swal.fire({
        title: "Error!",
        text: "Failed to send message. Please check your connection.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "#ffffff",
      });
    }
  };

  return (
    <section
      id="CONTACT"
      className="contact-section max-sm:min-h-[115vh] min-h-screen bg-gradient-to-t from-black via-slate-600 to-[#0a212b] relative -mt-0.5"
    >
      <div id="blob1"></div>
      <div id="blob2"></div>
      <div id="blob3"></div>
      <div id="noiseLayer"></div>

      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "none" }}
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".75"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      <div className="w-full min-h-screen absolute text-white overflow-hidden flex justify-center items-start p-8 max-sm:p-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-black/80 to-neutral-700/40 opacity-40" />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 relative z-10 max-sm:gap-16">
          {/* Left Side */}
          <div className="space-y-6 ml-4 max-sm:ml-0">
            <div
              
              className="text-5xl lg:text-7xl font-medium leading-19 max-sm:leading-tight pt-4 max-sm:pt-8 max-sm:mix-blend-difference"
              style={{ fontFamily: '"Work Sans", sans-serif' }}
            >
              <div style={{ overflow: "hidden" }}>
                <h1  className="max-sm:text-[2.5rem]">
                  SHAPING THE
                </h1>
              </div>
              <div style={{ overflow: "hidden" }}>
                <h1 className="max-sm:text-[2.5rem]">
                  FUTURE OF
                </h1>
              </div>
              <div style={{ overflow: "hidden" }}>
                <h1  className="max-sm:text-[2.5rem]">
                  VISUALS,{" "}
                  <span
                    style={{ fontFamily: "Nanum Myeongjo", fontWeight: "400" }}
                  >
                    TODAY
                  </span>
                </h1>
              </div>
            </div>

            <Image
              src="/gradients/sky_gradient_white.png"
              alt="gradient"
              width={300}
              height={300}
              className="-z-20 absolute inset-0 -left-32 sm:-left-48 md:-left-52 top-10 sm:-top-20 object-contain w-[200px] sm:w-[300px] md:w-[400px]"
            />

            
          </div>

          {/* Right Side - Form */}
          <div className="space-y-8 w-full max-w-2xl place-self-end max-sm:place-self-start mt-48 max-sm:mt-0 lg:ml-8 font-bold px-4 lg:px-12 max-sm:px-0">
            <div
              className="text-5xl pb-4 max-sm:pb-6 max-sm:text-[2.5rem] max-sm:leading-tight"
              style={{
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: "600",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <h2 >
                  LET'S COOK{" "}
                  <span className="text-4xl font-extralight max-sm:text-[2rem] max-sm:block">
                    TOGETHER
                  </span>
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-[40rem] max-sm:max-w-full text-lg"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="NAME"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2 placeholder:text-white/60"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2 placeholder:text-white/60"
                />
              </div>

              <div>
                <textarea
                  placeholder="YOUR THOUGHTS"
                  name="message"
                  rows="4"
                  className="w-full bg-transparent border-b border-white/40 focus:border-lime-50 duration-500 outline-none p-2 resize-none placeholder:text-white/60"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-4 cursor-pointer duration-500 px-6 py-2 rounded-full border border-lime-400 text-lime-400 text-sm hover:bg-lime-400 hover:text-black transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {status === "sending"
                    ? "Sending..."
                    : status === "success"
                    ? "Sent!"
                    : "Send It"}
                </span>
              </button>

              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
