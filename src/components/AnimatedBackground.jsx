import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let circuits = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > canvas.height) {
          this.reset();
        }

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -1;
        }
      }

      draw() {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const color = isDarkMode ? 'rgba(0, 221, 0, ' : 'rgba(184, 168, 99, ';
        ctx.fillStyle = `${color}${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = `${color}${this.opacity * 0.5})`;
      }
    }

    class Circuit {
      constructor() {
        this.reset();
      }

      reset() {
        this.x1 = Math.random() * canvas.width;
        this.y1 = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
        this.x2 = this.x1 + Math.cos(this.angle) * this.length;
        this.y2 = this.y1 + Math.sin(this.angle) * this.length;
        this.progress = 0;
        this.speed = Math.random() * 0.02 + 0.01;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.reset();
        }
      }

      draw() {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const color = isDarkMode ? 'rgba(0, 221, 0, ' : 'rgba(184, 168, 99, ';
        
        ctx.strokeStyle = `${color}${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `${color}${this.opacity})`;

        const currentX = this.x1 + (this.x2 - this.x1) * this.progress;
        const currentY = this.y1 + (this.y2 - this.y1) * this.progress;

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        ctx.fillStyle = `${color}${this.opacity * 2})`;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fill();

        if (this.progress < 0.1) {
          ctx.fillStyle = `${color}${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x1, this.y1, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 30 : 50;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const initCircuits = () => {
      circuits = [];
      const circuitCount = window.innerWidth < 768 ? 8 : 15;
      for (let i = 0; i < circuitCount; i++) {
        circuits.push(new Circuit());
      }
    };

    initParticles();
    initCircuits();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      
      if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(10, 15, 10, 1)');
        gradient.addColorStop(1, 'rgba(5, 8, 5, 1)');
      } else {
        gradient.addColorStop(0, 'rgba(245, 245, 245, 1)');
        gradient.addColorStop(1, 'rgba(230, 230, 230, 1)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.shadowBlur = 0;

      circuits.forEach(circuit => {
        circuit.update();
        circuit.draw();
      });

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      const isDarkModeLines = document.documentElement.classList.contains('dark-mode');
      ctx.strokeStyle = isDarkModeLines ? 'rgba(0, 221, 0, 0.1)' : 'rgba(184, 168, 99, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = 1 - distance / 150;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
};

export default AnimatedBackground;