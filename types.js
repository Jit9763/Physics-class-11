// types.js
const canvas = document.getElementById('typeCanvas');
const ctx = canvas.getContext('2d');

// Canvas ko mobile screen ke hisaab se set karna
canvas.width = canvas.parentElement.clientWidth;
canvas.height = 200;

// Dashboard Elements
const s1Disp = document.getElementById('s1');
const s2Disp = document.getElementById('s2');
const accelBtn = document.getElementById('accelBtn');

// Initial Data
let car1 = { x: 0, y: 30, speed: 2, color: '#3498db', label: 'Uniform' };
let car2 = { x: 0, y: 110, speed: 2, color: '#e67e22', label: 'Non-Uniform' };
let isAccelerating = false;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Road Drawing
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 20, canvas.width, 60); 
    ctx.fillRect(0, 100, canvas.width, 60);

    // Car 1 (Blue)
    ctx.fillStyle = car1.color;
    ctx.fillRect(car1.x, car1.y + 15, 40, 25);
    
    // Car 2 (Orange)
    ctx.fillStyle = car2.color;
    ctx.fillRect(car2.x, car2.y + 15, 40, 25);

    update();
    requestAnimationFrame(draw);
}

function update() {
    // Car 1: Constant Speed
    car1.x += car1.speed;

    // Car 2: Acceleration logic
    if (isAccelerating) {
        car2.speed += 0.05; // Yahan se acceleration speed badhao
    }
    car2.x += car2.speed;

    // Reset loop
    if (car1.x > canvas.width) car1.x = -40;
    if (car2.x > canvas.width) {
        car2.x = -40;
        // Agar button chhod diya hai toh speed reset kar do comparison ke liye
        if(!isAccelerating) car2.speed = 2; 
    }

    // Dashboard Update (Check karein ki s1 aur s2 IDs html mein hain)
    if(s1Disp) s1Disp.innerText = car1.speed.toFixed(1);
    if(s2Disp) s2Disp.innerText = car2.speed.toFixed(1);
}

// Button Interaction (Mobile + Mouse)
const start = (e) => { e.preventDefault(); isAccelerating = true; };
const stop = () => { isAccelerating = false; };

accelBtn.addEventListener('mousedown', start);
accelBtn.addEventListener('mouseup', stop);
accelBtn.addEventListener('touchstart', start);
accelBtn.addEventListener('touchend', stop);

draw();
