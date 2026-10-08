/**
 * Scroll-Driven Canvas Background
 * Handles Scene 1 (Hero) and Scene 2 (Focus)
 */

class BackgroundEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // State
        this.scrollProgress = 0; // 0 to 1
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.targetMouseX = this.width / 2;
        this.targetMouseY = this.height / 2;
        
        this.isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;
        this.isVisible = true;

        // Scene Entities
        this.gridY = 0;
        this.logs = this.initLogs();
        this.particles = this.initParticles();

        this.resize();
        this.bindEvents();
        
        // Start loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.render(t));
    }

    initLogs() {
        const logs = [];
        const count = this.isMobile ? 10 : 25;
        const strings = [
            "0x00A1: Analyzing system architecture...",
            "Buffer initialized.",
            "Tracing network packets...",
            "Decrypting payload...",
            "Compiling assets...",
            "System nominal.",
            "Loading modules..."
        ];
        for (let i = 0; i < count; i++) {
            logs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: 0.2 + Math.random() * 0.5,
                text: strings[Math.floor(Math.random() * strings.length)],
                opacity: Math.random() * 0.15
            });
        }
        return logs;
    }

    initParticles() {
        const particles = [];
        const count = this.isMobile ? 20 : 50;
        const symbols = ["</>", "{", "}", ";", "=>", "()"];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 10 + Math.random() * 14
            });
        }
        return particles;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        // Use GSAP ScrollTrigger to track overall page progress
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    this.scrollProgress = self.progress;
                }
            });
        } else {
            // Fallback
            window.addEventListener('scroll', () => {
                const max = document.body.scrollHeight - window.innerHeight;
                this.scrollProgress = Math.max(0, Math.min(1, window.scrollY / max));
            }, { passive: true });
        }

        if (!this.isMobile && !this.prefersReducedMotion) {
            window.addEventListener('mousemove', (e) => {
                this.targetMouseX = e.clientX;
                this.targetMouseY = e.clientY;
            });
        }

        // Observe theme changes
        const observer = new MutationObserver(() => {
            this.isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Visibility API for performance
        document.addEventListener('visibilitychange', () => {
            this.isVisible = document.visibilityState === 'visible';
            if (this.isVisible) {
                this.lastTime = performance.now();
                requestAnimationFrame((t) => this.render(t));
            }
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.isMobile = this.width < 768;
    }

    render(time) {
        if (!this.isVisible) return;
        
        const dt = (time - this.lastTime) / 16.66; // Normalized to 60fps
        this.lastTime = time;

        // Smooth mouse follow
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Mouse Parallax Offsets
        const px = (this.mouseX - this.width / 2) * 0.05;
        const py = (this.mouseY - this.height / 2) * 0.05;

        // Clear Background (Theme based)
        const bgBase = this.isDark ? '#0F172A' : '#F8FAFC';
        this.ctx.fillStyle = bgBase;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Calculate Scene Progresses
        // Scene 1: Hero (0 to 0.25)
        const scene1Progress = Math.max(0, 1 - (this.scrollProgress / 0.25));
        
        // Scene 2: Focus (0.1 to 0.4)
        let scene2Progress = 0;
        if (this.scrollProgress > 0.05 && this.scrollProgress < 0.45) {
            scene2Progress = Math.sin(((this.scrollProgress - 0.05) / 0.4) * Math.PI); // Smooth curve peaking at middle
        }

        // Draw Base Gradient
        this.drawBaseGradient(scene1Progress, scene2Progress);

        if (!this.prefersReducedMotion) {
            if (scene1Progress > 0) this.drawScene1(scene1Progress, dt, px, py);
            if (scene2Progress > 0) this.drawScene2(scene2Progress, dt, px, py);
        }

        // Draw Scroll Progress Bar
        this.drawProgressBar();

        requestAnimationFrame((t) => this.render(t));
    }

    drawBaseGradient(s1, s2) {
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, 0, 0, 
            this.width / 2, this.height / 2, this.height
        );
        
        if (this.isDark) {
            // Subtle cyan tint for Hero, deeper blue for Focus
            const r = Math.floor(6 + (s2 * 10));
            const g = Math.floor(182 - (s2 * 80));
            const b = Math.floor(212 + (s2 * 20));
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.05)`);
            gradient.addColorStop(1, '#0F172A');
        } else {
            gradient.addColorStop(0, `rgba(6, 182, 212, 0.05)`);
            gradient.addColorStop(1, '#F8FAFC');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawScene1(alpha, dt, px, py) {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        // Draw Faint Grid
        this.ctx.strokeStyle = this.isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.04)';
        this.ctx.lineWidth = 1;
        const gridSize = 40;
        this.gridY = (this.gridY + 0.5 * dt) % gridSize;
        
        // Grid Parallax
        const gpx = px * 0.5;
        const gpy = py * 0.5;

        this.ctx.beginPath();
        for (let x = (gpx % gridSize) - gridSize; x < this.width; x += gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
        }
        for (let y = (this.gridY + gpy % gridSize) - gridSize; y < this.height; y += gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
        }
        this.ctx.stroke();

        // Draw Logs
        this.ctx.font = "12px 'JetBrains Mono', monospace";
        this.ctx.fillStyle = this.isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.6)';
        
        this.logs.forEach(log => {
            log.y += log.speed * dt;
            if (log.y > this.height + 20) {
                log.y = -20;
                log.x = Math.random() * this.width;
            }
            this.ctx.globalAlpha = alpha * log.opacity;
            this.ctx.fillText(log.text, log.x - px, log.y - py);
        });

        this.ctx.restore();
    }

    drawScene2(alpha, dt, px, py) {
        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        // Move particles
        this.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            
            // Wrap around
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
        });

        // Draw connections (Network Node Graph)
        // Connection strength increases as Scene 2 peaks
        const maxDist = 150;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const lineAlpha = (1 - (dist / maxDist)) * alpha * 0.3;
                    this.ctx.strokeStyle = this.isDark 
                        ? `rgba(6, 182, 212, ${lineAlpha})`
                        : `rgba(15, 23, 42, ${lineAlpha * 0.5})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x - px * 1.5, p1.y - py * 1.5);
                    this.ctx.lineTo(p2.x - px * 1.5, p2.y - py * 1.5);
                    this.ctx.stroke();
                }
            }
        }

        // Draw symbols / nodes
        this.ctx.font = "14px 'JetBrains Mono', monospace";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.particles.forEach(p => {
            // Morphing logic: as alpha approaches 1, symbols fade into circles
            const morphFactor = alpha; // 0 = fully symbols, 1 = mostly nodes
            
            this.ctx.globalAlpha = alpha * (1 - morphFactor * 0.8);
            this.ctx.fillStyle = this.isDark ? '#94A3B8' : '#64748B';
            this.ctx.fillText(p.symbol, p.x - px * 1.5, p.y - py * 1.5);

            // Draw Node Circle
            this.ctx.globalAlpha = alpha * morphFactor;
            this.ctx.fillStyle = '#06B6D4';
            this.ctx.beginPath();
            this.ctx.arc(p.x - px * 1.5, p.y - py * 1.5, p.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    drawProgressBar() {
        this.ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        this.ctx.fillRect(0, 0, this.width * this.scrollProgress, 2);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new BackgroundEngine('bg-canvas');
});
