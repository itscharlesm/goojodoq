const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pipe = document.getElementById('pipe');
const messageOverlay = document.getElementById('messageOverlay');
const loveMessage = document.getElementById('loveMessage');
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

// Butterfly firework
function createButterflyFirework(x, y) {
    const colors = ['#ff99cc', '#ffccff', '#cc99ff', '#ff66cc'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const r = Math.sin(5 * t) * 10;
        const bx = r * Math.cos(t);
        const by = r * Math.sin(t);
        const speed = 1.3;
        particles.push(new Particle(x, y, color, bx * speed / 8, by * speed / 8));
    }
}

// Flower firework
function createFlowerFirework(x, y) {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb'];
    
    for (let petal = 0; petal < 6; petal++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const baseAngle = (Math.PI * 2 * petal) / 6;
        
        for (let i = 0; i < 20; i++) {
            const angle = baseAngle + (Math.random() - 0.5) * 0.8;
            const speed = Math.random() * 3 + 2;
            particles.push(new Particle(
                x, y, color,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            ));
        }
    }
}

// Diamond firework
function createDiamondFirework(x, y) {
    const colors = ['#00ffff', '#66ffff', '#99ffff', '#ccffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const points = [
        [0, -8], [6, 0], [0, 8], [-6, 0]
    ];

    points.forEach(point => {
        for (let i = 0; i < 20; i++) {
            const speed = 1.5;
            particles.push(new Particle(
                x, y, color,
                point[0] * speed / 6 + (Math.random() - 0.5),
                point[1] * speed / 6 + (Math.random() - 0.5)
            ));
        }
    });
}

// Crossette firework
function createCrossetteFirework(x, y) {
    const colors = ['#ff0000', '#ff6600', '#ffff00'];
    
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const speed = 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        ));
    }
}

// Palm tree firework
function createPalmFirework(x, y) {
    const colors = ['#ffaa00', '#ffcc00', '#ffee00'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 2 + 4;
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * speed * 0.3,
            Math.sin(angle) * speed - 3
        ));
    }
}

// Chrysanthemum
function createChrysanthemumFirework(x, y) {
    const colors = ['#9900ff', '#cc00ff', '#ff00ff', '#ff66ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push(new Particle(
            x, y, color,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        ));
    }
}

// Peony firework
function createPeonyFirework(x, y) {
    const colors = ['#ffb6c1', '#ffc0cb', '#ffccdd', '#ffe4e1'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Triple ring firework
function createTripleRingFirework(x, y) {
    const colorSets = [
        ['#ff0000', '#00ff00', '#0000ff'],
        ['#ff00ff', '#ffff00', '#00ffff'],
        ['#ff6600', '#66ff00', '#0066ff']
    ];
    const colors = colorSets[Math.floor(Math.random() * colorSets.length)];

    for (let ring = 0; ring < 3; ring++) {
        const radius = 3 + ring * 2;
        for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
            particles.push(new Particle(
                x, y, colors[ring],
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            ));
        }
    }
}

// Love burst
function createLoveBurstFirework(x, y) {
    createHeartFirework(x, y);
    setTimeout(() => {
        createHeartFirework(x + 50, y - 30);
        createHeartFirework(x - 50, y - 30);
    }, 100);
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

// Function to launch a burst of fireworks
function launchFireworksBurst(duration, startX, startY) {
    const interval = 500; // Launch every 500ms
    const count = duration / interval;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const targetX = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
            const targetY = Math.random() * canvas.height * 0.4 + 50;
            
            const fireworkTypes = [
                createHeartFirework, createStarFirework, createCircleFirework,
                createRingFirework, createSpiralFirework, createWillowFirework,
                createDoubleRingFirework, createButterflyFirework, createFlowerFirework,
                createDiamondFirework, createPeonyFirework
            ];
            
            const randomType = fireworkTypes[Math.floor(Math.random() * fireworkTypes.length)];
            
            launchRocket(startX, startY, targetX, targetY, (x, y) => {
                randomType(x, y);
            });
        }, i * interval);
    }
}

// Messages to display
const messages = [
    "I LOVE YOU<br>ALLIAH BIANCA PELEGRINO",
    "HAPPY SECOND MONTHSARY",
    "More monthsaries to come",
    "testing message"
];

let currentMessageIndex = 0;

pipe.addEventListener('click', () => {
    if (hasLaunched) return;
    hasLaunched = true;
    instruction.style.display = 'none';

    bgMusic.play().catch(e => console.log('Audio play failed:', e));

    const pipeRect = pipe.getBoundingClientRect();
    const startX = pipeRect.left + pipeRect.width / 2;
    const startY = pipeRect.top;

    // 61-second romantic fireworks show FIRST
    const sequence = [
        // Phase 1: Slow & Romantic Beginning (0-20s) - Gentle, sweet starts
        { delay: 0, type: createHeartFirework },
        { delay: 2500, type: createPeonyFirework },
        { delay: 5000, type: createHeartFirework },
        { delay: 7500, type: createFlowerFirework },
        { delay: 10000, type: createHeartFirework },
        { delay: 12500, type: createButterflyFirework },
        { delay: 15000, type: createHeartFirework },
        { delay: 17500, type: createPeonyFirework },

        // Phase 2: Building Romance (20-35s) - Mix of romantic & colorful
        { delay: 20000, type: createStarFirework },
        { delay: 21500, type: createHeartFirework },
        { delay: 23000, type: createFlowerFirework },
        { delay: 24500, type: createDiamondFirework },
        { delay: 26000, type: createHeartFirework },
        { delay: 27500, type: createButterflyFirework },
        { delay: 29000, type: createPeonyFirework },
        { delay: 30500, type: createStarFirework },
        { delay: 32000, type: createHeartFirework },
        { delay: 33500, type: createFlowerFirework },

        // Phase 3: Accelerating (35-48s) - Faster pace with variety
        { delay: 35000, type: createCircleFirework },
        { delay: 36000, type: createHeartFirework },
        { delay: 37000, type: createRingFirework },
        { delay: 38000, type: createStarFirework },
        { delay: 39000, type: createWillowFirework },
        { delay: 40000, type: createHeartFirework },
        { delay: 41000, type: createSpiralFirework },
        { delay: 42000, type: createButterflyFirework },
        { delay: 43000, type: createDoubleRingFirework },
        { delay: 44000, type: createFlowerFirework },
        { delay: 45000, type: createHeartFirework },
        { delay: 46000, type: createChrysanthemumFirework },
        { delay: 47000, type: createStarFirework },

        // Phase 4: GRAND FINALE (48-61s) - Rapid fire spectacular!
        { delay: 48000, type: createHeartFirework },
        { delay: 48500, type: createStarFirework },
        { delay: 49000, type: createCircleFirework },
        { delay: 49500, type: createHeartFirework },
        { delay: 50000, type: createRingFirework },
        { delay: 50500, type: createFlowerFirework },
        { delay: 51000, type: createWillowFirework },
        { delay: 51500, type: createHeartFirework },
        { delay: 52000, type: createSpiralFirework },
        { delay: 52500, type: createButterflyFirework },
        { delay: 53000, type: createDoubleRingFirework },
        { delay: 53500, type: createHeartFirework },
        { delay: 54000, type: createDiamondFirework },
        { delay: 54500, type: createStarFirework },
        { delay: 55000, type: createCrossetteFirework },
        { delay: 55500, type: createHeartFirework },
        { delay: 56000, type: createPalmFirework },
        { delay: 56500, type: createFlowerFirework },
        { delay: 57000, type: createTripleRingFirework },
        { delay: 57500, type: createHeartFirework },
        { delay: 58000, type: createChrysanthemumFirework },
        { delay: 58500, type: createStarFirework },
        { delay: 59000, type: createPeonyFirework },
        { delay: 59500, type: createHeartFirework },
        { delay: 60000, type: createLoveBurstFirework },
        { delay: 60500, type: createHeartFirework }
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

    // After 61 seconds, start the message sequence
    setTimeout(() => {
        showNextMessage(startX, startY);
    }, 61000);
});

function showNextMessage(startX, startY) {
    if (currentMessageIndex >= messages.length) {
        // All messages shown, sequence complete
        return;
    }

    // Show current message
    loveMessage.innerHTML = messages[currentMessageIndex];
    messageOverlay.classList.remove('hide');
    messageOverlay.classList.add('show');

    // After 5 seconds, hide message and start fireworks
    setTimeout(() => {
        messageOverlay.classList.remove('show');
        messageOverlay.classList.add('hide');

        // Wait for fade out animation, then start fireworks
        setTimeout(() => {
            // Launch fireworks for 5 seconds
            launchFireworksBurst(5000, startX, startY);

            // After 5 seconds of fireworks, show next message
            setTimeout(() => {
                currentMessageIndex++;
                showNextMessage(startX, startY);
            }, 5000);
        }, 1000); // Wait for hide animation
    }, 5000); // Show message for 5 seconds
}

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