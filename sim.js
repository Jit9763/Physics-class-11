const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

// Elements
const speed1Input = document.getElementById('speed1');
const speed2Input = document.getElementById('speed2');
const dist1Disp = document.getElementById('dist1');
const dist2Disp = document.getElementById('dist2');
const val1Disp = document.getElementById('val1');
const val2Disp = document.getElementById('val2');
const resetBtn = document.getElementById('resetBtn');
const accelBtn = document.getElementById('accelBtn');

let obj1 = { x: 0, y: 50, size: 40, color: '#e74c3c', distance: 0, v: 0 };
let obj2 = { x: 0, y: 130, size: 20, color: '#f1c40f', distance: 0, v: 0 };
let isAccelerating = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Roads
    ctx.strokeStyle = '#555';
    ctx.beginPath(); ctx.moveTo(0, 85); ctx.lineTo(canvas.width, 85); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 165); ctx.lineTo(canvas.width, 165); ctx.stroke();

    // Draw Car & Ball
    ctx.fillStyle = obj1.color; ctx.fillRect(obj1.x, obj1.y, obj1.size, 25);
    ctx.fillStyle = obj2.color; ctx.beginPath();
    ctx.arc(obj2.x, obj2.y, obj2.size / 2, 0, Math.PI * 2); ctx.fill();

    update();
    requestAnimationFrame(draw);
}

function update() {
    // Basic scaling factor (0.1) taaki speed control mein rahe
    let s1 = parseFloat(speed1Input.value) * 0.1;
    let s2 = parseFloat(speed2Input.value) * 0.1;

    // Agar Acceleration button daba hai toh speed dheere badhao
    if (isAccelerating) {
        speed1Input.value = parseFloat(speed1Input.value) + 0.02;
        speed2Input.value = parseFloat(speed2Input.value) + 0.01;
    }

    // Position & Meter updates
    obj1.x += s1;
    obj1.distance += s1 * 0.05;
    obj2.x += s2;
    obj2.distance += s2 * 0.05;

    dist1Disp.innerText = obj1.distance.toFixed(2);
    dist2Disp.innerText = obj2.distance.toFixed(2);
    val1Disp.innerText = (s1 * 10).toFixed(1);
    val2Disp.innerText = (s2 * 10).toFixed(1);

    if (obj1.x > canvas.width) obj1.x = -obj1.size;
    if (obj2.x > canvas.width) obj2.x = -obj2.size;
}

accelBtn.addEventListener('mousedown', () => isAccelerating = true);
accelBtn.addEventListener('mouseup', () => isAccelerating = false);
// Mobile touch ke liye
accelBtn.addEventListener('touchstart', () => isAccelerating = true);
accelBtn.addEventListener('touchend', () => isAccelerating = false);

resetBtn.addEventListener('click', () => {
    obj1.x = 0; obj1.distance = 0;
    obj2.x = 0; obj2.distance = 0;
    speed1Input.value = 2; speed2Input.value = 5;
});

draw();
