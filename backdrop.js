/**
 * Gemeinsamer Hintergrund für die dunklen Sektionen.
 *
 * Die "System-Map" lag ursprünglich fest verdrahtet im Hero, während die
 * Sektionen "Was ich baue" und "Terminal" eigene, abweichende Raster hatten.
 * Hier steht sie einmal als Factory und bedient alle drei — gleiche Farben,
 * gleiches Muster, gleiche Bewegung.
 *
 * Jede Instanz zeichnet nur, solange ihre Sektion im Bild ist.
 */
(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function createBackdrop(host, canvas) {
        const context = canvas.getContext('2d');
        if (!context) return;

        const pointer = { x: -1000, y: -1000 };
        const nodes = [];
        let frame = 0;
        let width = 0;
        let height = 0;
        let isVisible = true;

        const resize = () => {
            const bounds = host.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = bounds.width;
            height = bounds.height;
            if (!width || !height) return;
            canvas.width = Math.floor(width * ratio);
            canvas.height = Math.floor(height * ratio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);

            nodes.length = 0;
            const columns = Math.max(7, Math.floor(width / 115));
            const rows = Math.max(5, Math.floor(height / 115));
            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    nodes.push({
                        x: ((column + 0.5) / columns) * width,
                        y: ((row + 0.5) / rows) * height,
                        phase: (row * columns + column) * 0.37,
                        active: (row + column) % 7 === 0
                    });
                }
            }
            draw(0);
        };

        const draw = (time) => {
            context.clearRect(0, 0, width, height);
            const currentTime = time * 0.00035;

            const gridSize = 96;
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(184, 205, 198, 0.06)';
            for (let x = 0; x <= width; x += gridSize) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, height);
                context.stroke();
            }
            for (let y = 0; y <= height; y += gridSize) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(width, y);
                context.stroke();
            }

            for (let lane = 0; lane < 5; lane += 1) {
                const baseY = height * (0.18 + lane * 0.16);
                const bend = 22 + lane * 7;
                context.strokeStyle = lane === 2
                    ? 'rgba(143, 211, 255, 0.25)'
                    : 'rgba(184, 205, 198, 0.14)';
                context.beginPath();
                context.moveTo(0, baseY);
                context.bezierCurveTo(width * 0.24, baseY - bend, width * 0.34, baseY + bend, width * 0.56, baseY);
                context.bezierCurveTo(width * 0.76, baseY - bend, width * 0.84, baseY + bend, width, baseY - bend * 0.3);
                context.stroke();

                const pulsePosition = (currentTime * 0.16 + lane * 0.19) % 1;
                const pulseX = width * pulsePosition;
                const pulseY = baseY + Math.sin(pulsePosition * Math.PI * 3 + lane) * bend * 0.35;
                context.fillStyle = lane === 2
                    ? 'rgba(143, 211, 255, 0.9)'
                    : 'rgba(184, 205, 198, 0.7)';
                context.fillRect(pulseX - 2, pulseY - 2, 4, 4);
            }

            nodes.forEach((node) => {
                if (!node.active) return;
                const x = node.x + Math.sin(currentTime + node.phase) * 3;
                const y = node.y + Math.cos(currentTime * 0.8 + node.phase) * 3;
                context.fillStyle = 'rgba(184, 205, 198, 0.55)';
                context.fillRect(x - 2, y - 2, 4, 4);
            });

            if (pointer.x > 0 && pointer.y > 0) {
                context.strokeStyle = 'rgba(143, 211, 255, 0.34)';
                context.setLineDash([3, 6]);
                context.beginPath();
                context.moveTo(pointer.x, 0);
                context.lineTo(pointer.x, height);
                context.moveTo(0, pointer.y);
                context.lineTo(width, pointer.y);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.arc(pointer.x, pointer.y, 22 + Math.sin(currentTime * 8) * 3, 0, Math.PI * 2);
                context.stroke();
            }

            if (!reducedMotion.matches && isVisible && !document.hidden) {
                frame = requestAnimationFrame(draw);
            }
        };

        const start = () => {
            if (reducedMotion.matches || document.hidden || !isVisible || frame) return;
            frame = requestAnimationFrame(draw);
        };
        const stop = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
        };

        host.addEventListener('pointermove', (event) => {
            const bounds = host.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
        }, { passive: true });

        host.addEventListener('pointerleave', () => {
            pointer.x = -1000;
            pointer.y = -1000;
        }, { passive: true });

        window.addEventListener('resize', resize, { passive: true });
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(host);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                isVisible = entries[0]?.isIntersecting ?? true;
                if (isVisible) start();
                else stop();
            }, { threshold: 0 }).observe(host);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        reducedMotion.addEventListener?.('change', () => {
            if (reducedMotion.matches) stop();
            else start();
        });

        resize();
        start();
    }

    // Hero bringt sein Canvas im Markup mit, die übrigen bekommen eins gestellt.
    document.querySelectorAll('[data-backdrop]').forEach((host) => {
        let canvas = host.querySelector('canvas.backdrop-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'backdrop-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            host.prepend(canvas);
        }
        createBackdrop(host, canvas);
    });
})();
