import { useLayoutEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import gsap from 'gsap';

const Footer = () => {
  const footerRef = useRef(null);
  const quoteRef = useRef(null);

  // The useLayoutEffect logic for GSAP animations has been removed as per instructions.
  // useLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     // gsap.from(footerRef.current, {
  //     //   opacity: 0,
  //     //   y: 30,
  //     //   duration: 0.8,
  //     //   delay: 1.2,
  //     //   ease: 'power2.out'
  //     // });

  //     // Subtle floating animation on quote
  //     gsap.to(quoteRef.current, {
  //       y: -5,
  //       duration: 2,
  //       repeat: -1,
  //       yoyo: true,
  //       ease: 'sine.inOut'
  //     });
  //   }, footerRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <footer 
      ref={footerRef}
      className="text-center py-8 mt-12 relative animate-enter delay-500 border-t border-gray-800/50"
    >
      <div 
        ref={quoteRef}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <Quote className="w-5 h-5 text-cyan-400/50" />
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
        
        <p className="text-gray-400 italic text-lg">
          "The path of growth is walked one step at a time."
        </p>
        
        <div className="mt-6 text-gray-600 text-sm">
          <span className="gradient-text font-semibold">PRIMUS AETERNUS</span>
          <span className="mx-2">•</span>
          <span>Growth System v1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
