import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ theme, children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!theme || theme.type !== 'animated') return;

    const container = containerRef.current;
    if (!container) return;

    // Clear any existing animations
    container.innerHTML = '';

    let cleanup = null;

    switch (theme.animation) {
      case 'particles':
        createParticles(container, theme);
        break;
      case 'matrix':
        createMatrixRain(container, theme);
        break;
      case 'pulse':
        cleanup = createPulseWaves(container, theme);
        break;
      case 'constellation':
        createConstellation(container, theme);
        break;
      case 'typing':
        cleanup = createTypingEffect(container, theme);
        break;
      case 'dna':
        createDNAHelix(container, theme);
        break;
      default:
        break;
    }

    // Return cleanup function
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [theme]);

  const createParticles = (container, theme) => {
    const particleCount = theme.particleCount || 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');

      // Create different particle types based on theme name
      if (theme.name === 'Golden Stars' || theme.name === 'Fire Sparks') {
        // Create star-shaped particles
        particle.innerHTML = '✦';
        particle.style.cssText = `
          position: absolute;
          font-size: ${Math.random() * 16 + 12}px;
          color: ${theme.particleColor || '#ffffff'};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.8 + 0.2};
          animation: sparkle 3s ease-in-out infinite, float 6s ease-in-out infinite;
          animation-delay: ${Math.random() * 6}s, ${Math.random() * 3}s;
          pointer-events: none;
          z-index: 2;
          will-change: transform, opacity;
          text-shadow: 0 0 10px ${theme.particleColor || '#ffffff'};
        `;
      } else {
        // Create circular particles for other themes
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 8 + 4}px;
          height: ${Math.random() * 8 + 4}px;
          background-color: ${theme.particleColor || '#ffffff'};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.7 + 0.3};
          animation: float 6s ease-in-out infinite;
          animation-delay: ${Math.random() * 6}s;
          pointer-events: none;
          z-index: 2;
          will-change: transform;
          box-shadow: 0 0 10px ${theme.particleColor || '#ffffff'};
        `;
      }

      container.appendChild(particle);
    }
  };

  const createMatrixRain = (container, theme) => {
    const columns = Math.floor(window.innerWidth / 25);
    const chars =
      theme.speed === 'fast'
        ? '01'
        : '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const animationDuration =
      theme.speed === 'fast' ? '2s' : theme.speed === 'slow' ? '4s' : '3s';

    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.style.cssText = `
        position: absolute;
        left: ${i * 25}px;
        top: 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
        color: ${theme.textColor || '#00FF41'};
        pointer-events: none;
        z-index: 2;
        will-change: transform;
      `;

      // Create falling characters
      for (let j = 0; j < 25; j++) {
        const char = document.createElement('div');
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.className = 'matrix-char';
        char.style.cssText = `
          animation: matrixRain ${animationDuration} linear infinite;
          animation-delay: ${Math.random() * 5}s;
          opacity: ${Math.random() * 0.8 + 0.2};
          line-height: 1.2;
          will-change: transform, opacity;
        `;
        column.appendChild(char);
      }

      container.appendChild(column);
    }
  };

  const createPulseWaves = (container, theme) => {
    const pulseSpeed = theme.pulseSpeed || '2s';
    const waveInterval =
      theme.pulseSpeed === '1.5s'
        ? 800
        : theme.pulseSpeed === '3s'
          ? 1800
          : 1200;

    const createWave = () => {
      const wave = document.createElement('div');
      wave.className = 'pulse-wave';
      wave.style.cssText = `
        position: absolute;
        left: ${Math.random() * 80 + 10}%;
        top: ${Math.random() * 80 + 10}%;
        width: 30px;
        height: 30px;
        border: 3px solid ${theme.waveColor || '#3B82F6'};
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: pulse ${pulseSpeed} ease-out infinite;
        animation-delay: ${Math.random() * 1}s;
        will-change: transform, opacity;
      `;
      container.appendChild(wave);

      // Remove wave after animation
      const duration = parseFloat(pulseSpeed) * 1000 + 500; // Convert to ms and add buffer
      setTimeout(() => {
        if (wave.parentNode) {
          wave.parentNode.removeChild(wave);
        }
      }, duration);
    };

    // Create initial waves
    for (let i = 0; i < 3; i++) {
      setTimeout(createWave, i * 300);
    }

    // Create waves periodically
    const interval = setInterval(createWave, waveInterval);

    // Cleanup function
    return () => clearInterval(interval);
  };

  const createConstellation = (container, theme) => {
    const starCount = theme.starCount || 50;
    const stars = [];

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3 + 1;
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${theme.particleColor || '#ffffff'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.2};
        pointer-events: none;
        z-index: 2;
        box-shadow: 0 0 ${size * 2}px ${theme.particleColor || '#ffffff'};
        animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(star);
      stars.push({
        element: star,
        x: parseFloat(star.style.left),
        y: parseFloat(star.style.top),
      });
    }

    // Create constellation lines
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const star1 = stars[i];
        const star2 = stars[j];
        const distance = Math.sqrt(
          Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
        );

        if (distance < 20 && Math.random() > 0.7) {
          const line = document.createElement('div');
          line.style.cssText = `
            position: absolute;
            height: 1px;
            background: linear-gradient(90deg, transparent, ${theme.particleColor || '#ffffff'}, transparent);
            left: ${Math.min(star1.x, star2.x)}%;
            top: ${(star1.y + star2.y) / 2}%;
            width: ${Math.abs(star1.x - star2.x)}%;
            opacity: 0.3;
            pointer-events: none;
            z-index: 1;
            animation: fadeIn 2s ease-in-out infinite alternate;
          `;
          container.appendChild(line);
        }
      }
    }
  };

  const createTypingEffect = (container, theme) => {
    const phrases = theme.phrases || [
      'LOADING...',
      'INITIALIZING...',
      'CONNECTING...',
      'PROCESSING...',
    ];
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    const typewriter = document.createElement('div');
    typewriter.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      color: ${theme.textColor || '#00FF41'};
      text-align: center;
      pointer-events: none;
      z-index: 2;
    `;
    container.appendChild(typewriter);

    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    `;

    const type = () => {
      const current = phrases[currentPhrase];

      if (isDeleting) {
        currentChar--;
        typewriter.innerHTML = current.substring(0, currentChar);
      } else {
        currentChar++;
        typewriter.innerHTML = current.substring(0, currentChar);
      }

      typewriter.appendChild(cursor);

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentChar === current.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    type();

    return () => {
      // Cleanup handled by component unmount
    };
  };

  const createDNAHelix = (container, theme) => {
    const helixHeight = window.innerHeight;
    const helixWidth = 200;
    const turns = 8;
    const pointsPerTurn = 20;

    for (let turn = 0; turn < turns; turn++) {
      for (let point = 0; point < pointsPerTurn; point++) {
        const angle = (point / pointsPerTurn) * Math.PI * 2;
        const y =
          (turn / turns) * helixHeight +
          (point / pointsPerTurn) * (helixHeight / turns);

        // Left strand
        const leftPoint = document.createElement('div');
        leftPoint.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: ${theme.primaryColor || '#00FFFF'};
          border-radius: 50%;
          left: ${50 + Math.cos(angle) * 15}%;
          top: ${(y / helixHeight) * 100}%;
          opacity: 0.8;
          pointer-events: none;
          z-index: 2;
          box-shadow: 0 0 6px ${theme.primaryColor || '#00FFFF'};
          animation: float ${6 + Math.random() * 2}s ease-in-out infinite;
          animation-delay: ${(turn + point / pointsPerTurn) * 0.1}s;
        `;
        container.appendChild(leftPoint);

        // Right strand
        const rightPoint = document.createElement('div');
        rightPoint.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: ${theme.secondaryColor || '#FF00FF'};
          border-radius: 50%;
          left: ${50 + Math.cos(angle + Math.PI) * 15}%;
          top: ${(y / helixHeight) * 100}%;
          opacity: 0.8;
          pointer-events: none;
          z-index: 2;
          box-shadow: 0 0 6px ${theme.secondaryColor || '#FF00FF'};
          animation: float ${6 + Math.random() * 2}s ease-in-out infinite;
          animation-delay: ${(turn + point / pointsPerTurn) * 0.1 + 0.5}s;
        `;
        container.appendChild(rightPoint);

        // Connection lines every few points
        if (point % 4 === 0) {
          const connection = document.createElement('div');
          connection.style.cssText = `
            position: absolute;
            height: 1px;
            width: 30%;
            background: linear-gradient(90deg, ${theme.primaryColor || '#00FFFF'}, ${theme.secondaryColor || '#FF00FF'});
            left: ${50 - 15}%;
            top: ${(y / helixHeight) * 100}%;
            opacity: 0.4;
            pointer-events: none;
            z-index: 1;
            animation: pulse 2s ease-in-out infinite;
            animation-delay: ${(turn + point / pointsPerTurn) * 0.2}s;
          `;
          container.appendChild(connection);
        }
      }
    }
  };

  if (!theme || theme.type !== 'animated') {
    return <>{children}</>;
  }

  const getBackgroundStyle = () => {
    const style: {
      backgroundColor: any;
      backgroundImage?: any;
      backgroundSize?: string;
    } = {
      backgroundColor: theme.backgroundColor,
    };

    if (theme.animation === 'gradient') {
      (style as any).backgroundImage = (theme as any).backgroundImage;
      style.backgroundSize = (theme as any).backgroundSize || '400% 400%';
    }

    return style;
  };

  return (
    <div
      className={`relative w-full h-full ${theme.animation === 'gradient' ? 'animated-gradient' : ''}`}
      style={getBackgroundStyle()}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ pointerEvents: 'none', zIndex: 1 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
