const { createApp, ref, onMounted, watch } = Vue;

createApp({
    setup() {
        const sigma = ref(10);
        const rho = ref(28);
        const beta = ref(2.66);
        const butterflyCanvasRef = ref(null);
        let ctx = null;
        let animationFrameId = null;

        // --- Color Palettes ---
        const colorPalettes = [
            { name: "Cool Blues", colors: ["#007bff", "#00c4ff", "#ffffff"] },
            { name: "Warm Sunset", colors: ["#ff6f61", "#ffcc00", "#ffe680"] },
            { name: "Emerald Green", colors: ["#2ecc71", "#55efc4", "#a2ffbf"] },
            { name: "Purple Haze", colors: ["#9b59b6", "#e0aaff", "#f8d7ff"] },
            { name: "Monochrome", colors: ["#333", "#666", "#fff"] },
        ];
        const selectedPaletteName = ref(colorPalettes[0].name); // Initialize to the first palette
        const lineThickness = ref(2); // Default line thickness
        const particleCount = ref(200); // Number of butterflies
        const glowEffect = ref(true); // Enable glow effect
        const backgroundEffect = ref(true); // Enable background effect

        onMounted(() => {
            const canvas = butterflyCanvasRef.value;
            if (canvas) {
                ctx = canvas.getContext('2d');
                resizeCanvas();
                startAnimation();
            } else {
                console.error("Canvas element not found!");
            }
        });

        // Watch for changes in parameters and restart animation
        watch([sigma, rho, beta, selectedPaletteName, lineThickness, particleCount, glowEffect, backgroundEffect], () => {
            stopAnimation();
            startAnimation();
        });

        // --- Lorenz Attractor Simulation ---
        const lorenzEquations = (x, y, z, s, r, b) => {
            const dx = s * (y - x);
            const dy = x * (r - z) - y;
            const dz = x * y - b * z;
            return [dx, dy, dz];
        };

        const rungeKutta4Step = (x, y, z, s, r, b, stepSize) => {
            const k1 = lorenzEquations(x, y, z, s, r, b);
            const k2 = lorenzEquations(
                x + stepSize / 2 * k1[0],
                y + stepSize / 2 * k1[1],
                z + stepSize / 2 * k1[2],
                s, r, b
            );
            const k3 = lorenzEquations(
                x + stepSize / 2 * k2[0],
                y + stepSize / 2 * k2[1],
                z + stepSize / 2 * k2[2],
                s, r, b
            );
            const k4 = lorenzEquations(
                x + stepSize * k3[0],
                y + stepSize * k3[1],
                z + stepSize * k3[2],
                s, r, b
            );

            const nextX = x + stepSize / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
            const nextY = y + stepSize / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
            const nextZ = z + stepSize / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);

            return [nextX, nextY, nextZ];
        };

        // --- Animation Logic ---
        const generateButterflyPoints = (s, r, b, stepSize, numPoints) => {
            let points = [];
            let x = 0.01, y = 0.0, z = 0.0;
            for (let i = 0; i < numPoints; i++) {
                [x, y, z] = rungeKutta4Step(x, y, z, s, r, b, stepSize);
                points.push({ x, y, z });
            }
            return points;
        };

        const renderBackground = () => {
            if (!ctx || !backgroundEffect.value) return;

            const canvas = butterflyCanvasRef.value;
            const width = canvas.width;
            const height = canvas.height;

            // Create a gradient background
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#1a1a1a');
            gradient.addColorStop(1, '#000000');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add star-like specks
            ctx.fillStyle = 'white';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 2;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const drawButterfly = (x, y, size, angle, color) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(size, size);

            // Draw a simple butterfly shape
            ctx.beginPath();
            ctx.moveTo(0, -5); // Top of the body
            ctx.lineTo(-2, 0); // Left wing tip
            ctx.quadraticCurveTo(-5, -3, -5, -8); // Left wing curve
            ctx.quadraticCurveTo(-5, -3, -2, -6); // Back to body
            ctx.lineTo(2, -6); // Right wing connection
            ctx.quadraticCurveTo(5, -3, 5, -8); // Right wing curve
            ctx.quadraticCurveTo(5, -3, 2, 0); // Back to body
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();
        };

        const renderButterflies = (points, index) => {
            if (!ctx || !butterflyCanvasRef.value) return;

            const canvas = butterflyCanvasRef.value;
            const width = canvas.width;
            const height = canvas.height;
            const scale = Math.min(width, height) / 30;
            const offsetX = width / 2;
            const offsetY = height / 2;

            const selectedPalette = colorPalettes.find(palette => palette.name === selectedPaletteName.value);
            const colors = selectedPalette ? selectedPalette.colors : ['#007bff', '#00c4ff', '#ffffff'];

            // Clear the canvas with a semi-transparent overlay for fading effect
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;

            // Render butterflies
            for (let i = 0; i < particleCount.value && i < index; i++) {
                const pointIndex = Math.floor(i / particleCount.value * index);
                const point = points[pointIndex];
                const x = point.x * scale + offsetX;
                const y = point.y * scale + offsetY;

                const t = pointIndex / points.length;
                const color = interpolateColor(colors, t);

                // Calculate angle based on direction of movement
                const nextPoint = points[Math.min(pointIndex + 1, points.length - 1)];
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

                // Randomize size and opacity
                const size = 0.5 + Math.random() * 1.5;
                ctx.globalAlpha = 0.5 + Math.random() * 0.5;

                drawButterfly(x, y, size, angle, color);
            }

            ctx.globalAlpha = 1; // Reset alpha
        };

        const interpolateColor = (colors, t) => {
            const segment = Math.floor(t * (colors.length - 1));
            const localT = t * (colors.length - 1) - segment;
            const c1 = hexToRgb(colors[segment]);
            const c2 = hexToRgb(colors[segment + 1]);
            const r = Math.round(c1.r + (c2.r - c1.r) * localT);
            const g = Math.round(c1.g + (c2.g - c1.g) * localT);
            const b = Math.round(c1.b + (c2.b - c1.b) * localT);
            return `rgb(${r}, ${g}, ${b})`;
        };

        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        };

        const animateButterflies = (points) => {
            let index = 0;
            const drawFrame = () => {
                renderBackground();
                if (index < points.length) {
                    renderButterflies(points, index);
                    index += 10;
                    animationFrameId = requestAnimationFrame(drawFrame);
                }
            };
            drawFrame();
        };

        const startAnimation = () => {
            const currentSigma = sigma.value;
            const currentRho = rho.value;
            const currentBeta = beta.value;
            const points = generateButterflyPoints(currentSigma, currentRho, currentBeta, 0.01, 10000);
            animateButterflies(points);
        };

        const stopAnimation = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        const resizeCanvas = () => {
            const canvas = butterflyCanvasRef.value;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', () => {
            resizeCanvas();
            stopAnimation();
            startAnimation();
        });

        return {
            sigma, rho, beta,
            butterflyCanvasRef,
            colorPalettes,
            selectedPaletteName,
            lineThickness,
            particleCount,
            glowEffect,
            backgroundEffect,
            startAnimation
        };
    }
}).mount('#app');