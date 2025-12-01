import React, { useState, useEffect, useRef } from "react";

const InteractiveEye = ({ size = 80 }) => {
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const eyeRef = useRef(null);
  const isBlinkingRef = useRef(false);

  const blinkTimeoutRef = useRef(null);
  const nextBlinkTimeoutRef = useRef(null);

  useEffect(() => {
    isBlinkingRef.current = isBlinking;
  }, [isBlinking]);

  useEffect(() => {
    // Detectar dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    };
    
    checkDarkMode();
    
    // Observer para cambios de clase
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eyeRef.current || isBlinkingRef.current) return;

      const eye = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), size / 4);

      const maxDistance = size / 6;
      const limitedDistance = Math.min(distance, maxDistance);

      setPupilPosition({
        x: Math.cos(angle) * limitedDistance,
        y: Math.sin(angle) * limitedDistance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const scheduleBlink = () => {
      const delay = Math.random() * 4000 + 3000;
      nextBlinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        blinkTimeoutRef.current = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
      if (nextBlinkTimeoutRef.current)
        clearTimeout(nextBlinkTimeoutRef.current);
    };
  }, [size]);

  return (
    <div
      ref={eyeRef}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="eyeGlow">
            <stop offset="0%" stopColor="#b8a863" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#b8a863" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="irisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4c089" />
            <stop offset="50%" stopColor="#b8a863" />
            <stop offset="100%" stopColor="#8b7355" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#eyeGlow)"
          style={{
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        />

        <circle
          cx="50"
          cy="50"
          r="40"
          fill="white"
          stroke="#2c2c2c"
          strokeWidth="3"
          filter="url(#glow)"
        />

        <path
          d="M 30 40 Q 35 45 30 50"
          stroke="#ff6b6b"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 70 40 Q 65 45 70 50"
          stroke="#ff6b6b"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />

        <circle
          cx={50 + pupilPosition.x}
          cy={50 + pupilPosition.y}
          r="18"
          fill="url(#irisGradient)"
          style={{
            transition: "all 0.08s ease-out",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
          }}
        />

        <circle
          cx={50 + pupilPosition.x}
          cy={50 + pupilPosition.y}
          r="16"
          fill="none"
          stroke="#8b7355"
          strokeWidth="0.5"
          opacity="0.4"
        />

        <circle
          cx={50 + pupilPosition.x}
          cy={50 + pupilPosition.y}
          r="9"
          fill="#1a1a1a"
          style={{
            transition: "all 0.08s ease-out",
          }}
        />

        <ellipse
          cx={54 + pupilPosition.x}
          cy={46 + pupilPosition.y}
          rx="3.5"
          ry="4.5"
          fill="white"
          opacity="0.9"
        />

        <circle
          cx={56 + pupilPosition.x * 0.5}
          cy={48 + pupilPosition.y * 0.5}
          r="1.5"
          fill="white"
          opacity="0.6"
        />

        {/* Parpadeo: círculo oscuro que cubre cuando parpadea */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill={isDarkMode ? "#0a0f0a" : "#2c2c2c"}
          opacity={isBlinking ? "1" : "0"}
          style={{
            transition: "opacity 120ms ease-in-out",
            pointerEvents: "none",
          }}
        />
      </svg>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveEye;
