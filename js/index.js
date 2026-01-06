const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pipe = document.getElementById('pipe');
const messageOverlay = document.getElementById('messageOverlay');
const instruction = document.getElementById('instruction');
const bgMusic = document.getElementById('bgMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Stars
const stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random()
    });
}

function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.3, Math.min(1, star.opacity));
    });
}

// Firework particles
const particles = [];
let hasLaunched = false;

class Particle {
    constructor(x, y, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx || (Math.random() - 0.5) * 8;
        this.vy = vy || (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.color = color;
        this.gravity = 0.05;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.008;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Heart shape firework
function createHeartFirework(x, y) {
    const colors = ['#ff1493', '#ff69b4', '#ff85c1', '#ffb6d9'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let t = 0; t < Math.PI * 2; t += 0.08) {
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const speed = 1.5;
        particles.push(new Particle(x, y, color, heartX * speed / 10, heartY * speed / 10));
    }
}

// Star shape firework
function createStarFirework(x, y) {
    const colors = ['#ffd700', '#ffeb3b', '#fff59d', '#ffe082'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const outerAngle = angle;
        const innerAngle = angle + Math.PI / 5;

        for (let j = 0; j < 15; j++) {
            const t = j / 15;
            const currentAngle = outerAngle + (innerAngle - outerAngle) * t;
            const radius = t < 0.5 ? 8 : 4;
            const speed = 1.5;

            particles.push(new Particle(
                x, y, color,
                Math.cos(currentAngle) * radius * speed / 5,
                Math.sin(currentAngle) * radius * speed / 5
            ));
        }
    }
}

// Circle firework
function createCircleFirework(x, y) {
    const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0099ff', '#9900ff', '#ff00ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Ring firework
function createRingFirework(x, y) {
    const colors = ['#00ffff', '#00ff99', '#66ffcc', '#99ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const speed = 6;
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        ));
    }
}

// Spiral firework
function createSpiralFirework(x, y) {
    const colors = ['#ff00ff', '#ff66ff', '#cc00ff', '#9900ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let angle = 0; angle < Math.PI * 8; angle += 0.2) {
        const radius = angle * 0.3;
        const speed = 1.2;
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * radius * speed / 5,
            Math.sin(angle) * radius * speed / 5
        ));
    }
}

// Willow firework
function createWillowFirework(x, y) {
    const colors = ['#ffaa00', '#ff8800', '#ff6600', '#ff4400'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const speed = Math.random() * 4 + 2;
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed - 2
        ));
    }
}

// Double ring
function createDoubleRingFirework(x, y) {
    const colors = ['#00ff00', '#00ff99', '#99ff00', '#ccff00'];

    for (let ring = 0; ring < 2; ring++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const radius = ring === 0 ? 4 : 7;
        for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
            particles.push(new Particle(
                x, y, color,
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            ));
        }
    }
}

function launchRocket(startX, startY, targetX, targetY, callback) {
    let rocket = {
        x: startX,
        y: startY,
        vx: (targetX - startX) / 60,
        vy: (targetY - startY) / 60,
        trail: []
    };

    let frame = 0;
    function animateRocket() {
        if (frame < 60) {
            rocket.x += rocket.vx;
            rocket.y += rocket.vy;
            rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1 });

            if (rocket.trail.length > 20) rocket.trail.shift();

            rocket.trail.forEach((t) => {
                t.alpha -= 0.05;
                ctx.save();
                ctx.globalAlpha = t.alpha;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffaa00';
                ctx.fill();
                ctx.restore();
            });

            ctx.beginPath();
            ctx.arc(rocket.x, rocket.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            frame++;
            requestAnimationFrame(animateRocket);
        } else {
            callback(rocket.x, rocket.y);
        }
    }
    animateRocket();
}

pipe.addEventListener('click', () => {
    if (hasLaunched) return;
    hasLaunched = true;
    instruction.style.display = 'none';

    // Play music
    bgMusic.play().catch(e => console.log('Audio play failed:', e));

    const pipeRect = pipe.getBoundingClientRect();
    const startX = pipeRect.left + pipeRect.width / 2;
    const startY = pipeRect.top;

    // Fireworks show sequence with varying speeds
    const sequence = [
        // Phase 1: Rapid fire (0-5s) - Quick bursts
        { delay: 0, type: createCircleFirework },
        { delay: 400, type: createStarFirework },
        { delay: 800, type: createRingFirework },
        { delay: 1200, type: createCircleFirework },
        { delay: 1600, type: createWillowFirework },
        { delay: 2000, type: createSpiralFirework },
        { delay: 2400, type: createCircleFirework },
        { delay: 2800, type: createDoubleRingFirework },
        { delay: 3200, type: createStarFirework },
        { delay: 3600, type: createCircleFirework },
        { delay: 4000, type: createRingFirework },
        { delay: 4400, type: createWillowFirework },

        // Phase 2: Slow dramatic (5-15s) - Spaced out
        { delay: 6000, type: createHeartFirework },
        { delay: 7500, type: createStarFirework },
        { delay: 9000, type: createHeartFirework },
        { delay: 10500, type: createSpiralFirework },
        { delay: 12000, type: createHeartFirework },
        { delay: 13500, type: createDoubleRingFirework },

        // Phase 3: Medium pace with shapes (15-25s)
        { delay: 15500, type: createStarFirework },
        { delay: 16500, type: createHeartFirework },
        { delay: 17500, type: createStarFirework },
        { delay: 18500, type: createHeartFirework },
        { delay: 19500, type: createWillowFirework },
        { delay: 20500, type: createSpiralFirework },
        { delay: 21500, type: createHeartFirework },
        { delay: 22500, type: createStarFirework },

        // Phase 4: Grand finale rapid fire (25-32s)
        { delay: 25000, type: createCircleFirework },
        { delay: 25400, type: createStarFirework },
        { delay: 25800, type: createHeartFirework },
        { delay: 26200, type: createRingFirework },
        { delay: 26600, type: createWillowFirework },
        { delay: 27000, type: createSpiralFirework },
        { delay: 27400, type: createDoubleRingFirework },
        { delay: 27800, type: createHeartFirework },
        { delay: 28200, type: createStarFirework },
        { delay: 28600, type: createCircleFirework },
        { delay: 29000, type: createHeartFirework },
        { delay: 29400, type: createStarFirework },
        { delay: 29800, type: createRingFirework },
        { delay: 30200, type: createWillowFirework },
        { delay: 30600, type: createHeartFirework },
        { delay: 31000, type: createStarFirework }
    ];

    sequence.forEach(item => {
        setTimeout(() => {
            const targetX = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
            const targetY = Math.random() * canvas.height * 0.4 + 50;

            launchRocket(startX, startY, targetX, targetY, (x, y) => {
                item.type(x, y);
            });
        }, item.delay);
    });

    // Show message after fireworks
    setTimeout(() => {
        messageOverlay.classList.add('show');
    }, 33000);
});

function animate() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();