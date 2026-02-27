// ==========================================
// SECTION 1: ENGINE LOGIC (Isse mat chedna)
// ==========================================
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
let currentChapter = null;

const chapters = {}; // Yahan saare chapters save honge

function addChapter(id, data) {
    chapters[id] = data;
    const btn = document.createElement('button');
    btn.innerText = data.menuName;
    btn.onclick = () => loadChapter(id);
    document.getElementById('chapterMenu').appendChild(btn);
}

function loadChapter(id) {
    currentChapter = chapters[id];
    document.getElementById('chTitle').innerText = currentChapter.title;
    document.getElementById('chDef').innerHTML = `<p>${currentChapter.def}</p>`;
    document.getElementById('chDashboard').innerHTML = currentChapter.dashboardHTML || '';
    document.getElementById('chControls').innerHTML = currentChapter.controlsHTML || '';
    
    // Canvas Reset
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250;
    
    if(currentChapter.init) currentChapter.init();
}

function animate() {
    if(currentChapter && currentChapter.draw) {
        currentChapter.draw();
    }
    requestAnimationFrame(animate);
}
animate();

// ==========================================
// SECTION 2: CHAPTERS DATA (Yahan Naya Code Paste Karein)
// ==========================================

// --- CHAPTER 1: GATI (MOTION) ---
addChapter('motion', {
    menuName: "गति (Motion)",
    title: "गति की परिभाषा",
    def: "यदि कोई वस्तु समय के साथ स्थिति बदले तो उसे गति में कहा जाता है।",
    controlsHTML: `<button onclick="chapters.motion.reset()">Reset</button>`,
    x: 0,
    init: function() { this.x = 0; },
    draw: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, 100, 40, 20);
        this.x += 2;
        if(this.x > canvas.width) this.x = -40;
    },
    reset: function() { this.x = 0; }
});

// --- CHAPTER 2: PROJECTILE (PRASHEP) ---
addChapter('projectile', {
    menuName: "प्रक्षेप्य (Projectile)",
    title: "प्रक्षेप्य गति",
    def: "जब किसी पिंड को किसी कोण पर फेंका जाता है (Parabola path)।",
    controlsHTML: `<button onclick="chapters.projectile.fire()">Fire Ball</button>`,
    ball: { x: 0, y: 200, vx: 0, vy: 0, active: false },
    init: function() { this.ball.active = false; },
    fire: function() {
        this.ball = { x: 0, y: 200, vx: 5, vy: -8, active: true };
    },
    draw: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "green"; ctx.fillRect(0, 200, canvas.width, 50); // Ground
        ctx.fillStyle = "blue";
        ctx.beginPath(); ctx.arc(this.ball.x, this.ball.y, 8, 0, Math.PI*2); ctx.fill();
        if(this.ball.active) {
            this.ball.x += this.ball.vx; this.ball.vy += 0.2; this.ball.y += this.ball.vy;
            if(this.ball.y > 200) this.ball.active = false;
        }
    }
});

// AB AGLE CHAPTER KE LIYE BAS NICHE NAYA 'addChapter' PASTE KARTE JAIYE...
