import { useEffect, useState, useRef } from 'react';

const TechCompanion = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsChatOpen(true);
    const handleClose = () => setIsChatOpen(false);

    window.addEventListener('open-chat', handleOpen);
    window.addEventListener('close-chat', handleClose);

    return () => {
      window.removeEventListener('open-chat', handleOpen);
      window.removeEventListener('close-chat', handleClose);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return;

      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - botCenterY, e.clientX - botCenterX);

      // MOVEMENT RANGE:
      // Since pupils are smaller, we can let them move more inside the socket.
      const radius = 6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      setEyePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Blink logic
  useEffect(() => {
    if (isHovering) return;
    let timeoutId: NodeJS.Timeout;

    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 2000; // 4-6 seconds
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150); // 150ms blink duration
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [isHovering]);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    window.dispatchEvent(new Event('open-chat'));
  };

  const scaleClass = isChatOpen
    ? (isHovering ? 'scale-95 md:scale-110' : 'scale-95 md:scale-100')
    : (isHovering ? 'scale-110' : 'scale-100');

  const visibilityClass = isChatOpen
    ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
    : 'opacity-100 pointer-events-auto';

  return (
    <div
      ref={botRef}
      className={`fixed bottom-4 right-4 sm:bottom-12 sm:right-12 z-50 transition-all duration-300 ease-in-out cursor-pointer
        ${scaleClass} 
        ${isClicked ? 'animate-spin-fast' : 'animate-float'}
        ${visibilityClass}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      title="I'm watching you!!"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 sm:w-[100px] sm:h-[100px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="5" r="5" fill="#a855f7" className="animate-pulse" />

        {/* Head/Chassis */}
        <rect x="15" y="25" width="70" height="68" rx="14" fill="#0f172a" stroke="#2dd4bf" strokeWidth="3" />

        {/* Face Screen (Darker Background) */}
        <rect x="25" y="38" width="50" height="40" rx="8" fill="#020617" />

        {/* --- STATIC EYE SOCKETS (The "Whites" of the eyes) --- */}
        <circle cx="38" cy="50" r="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <circle cx="62" cy="50" r="10" fill="#1e293b" stroke="#334155" strokeWidth="1" />

        {/* --- MOVING PUPILS --- */}
        <g 
          style={{
            transformOrigin: '50px 50px',
            transform: `translate(${eyePosition.x}px, ${eyePosition.y}px) scaleY(${isBlinking ? 0.1 : 1})`,
          }}
        >
          {/* Smaller, brighter pupils for contrast */}
          <circle cx="38" cy="50" r="4" fill="#2dd4bf" className="drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]" />
          <circle cx="62" cy="50" r="4" fill="#2dd4bf" className="drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]" />

          {/* Tiny reflection dot for "glossy" look */}
          <circle cx="40" cy="48" r="1.5" fill="white" opacity="0.8" />
          <circle cx="64" cy="48" r="1.5" fill="white" opacity="0.8" />
        </g>

        {/* Mouth */}
        {isClicked ? (
          <ellipse 
            cx="50" 
            cy="71" 
            rx="5" 
            ry="6" 
            fill="#2dd4bf" 
            className="animate-pulse" 
          />
        ) : isHovering ? (
          <path 
            d="M40 69 Q50 78 60 69" 
            stroke="#2dd4bf" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none" 
            className="drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]"
          />
        ) : (
          <path 
            d="M44 71 Q50 73 56 71" 
            stroke="#2dd4bf" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none" 
            className="drop-shadow-[0_0_5px_rgba(45,212,191,0.8)]"
          />
        )}

        {/* Feet */}
        <path d="M30 93 L30 100" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
        <path d="M70 93 L70 100" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default TechCompanion;