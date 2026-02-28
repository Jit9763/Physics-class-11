// Google Sheet (published as Excel file with multiple sheets)
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSdWuvZY7JkL6I6Cs0abRuGVfB1gitMGIDtb2z3M4ZKLVAlf2l8r8uGxaDkMIOnVC2E40z1sNqHV0w/pub?output=xlsx";

// Load workbook
async function loadWorkbook() {
    const response = await fetch(sheetURL);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, {type:"array"});

    // हर sheet के लिए nav button बनाओ
    const menu = document.getElementById("chapterMenu");
    workbook.SheetNames.forEach(sheetName => {
        const btn = document.createElement("button");
        btn.textContent = sheetName;
        btn.onclick = () => loadSheet(workbook, sheetName);
        menu.appendChild(btn);
    });

    // Default: पहला sheet load करो
    loadSheet(workbook, workbook.SheetNames[0]);
}

// Load one sheet
function loadSheet(workbook, sheetName) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, {header:1});

    const title = rows[0][0];
    const definition = rows[1][0];
    const notes = rows.slice(2).map(r => r[0]);

    document.getElementById("chTitle").textContent = title;
    document.getElementById("chDef").textContent = definition;
    document.getElementById("chNotes").innerHTML = notes.join("<br>");

    // Active button highlight
    const menu = document.getElementById("chapterMenu");
    [...menu.children].forEach(b => b.classList.remove("active"));
    [...menu.children].find(b => b.textContent === sheetName).classList.add("active");

    // Dispatcher: sheetName के आधार पर simulation चलाओ
    if (sheetName.toLowerCase().includes("motion")) {
        simulateMotion();
    } else if (sheetName.toLowerCase().includes("गति के प्रकार")) {
        simulateTypesOfMotion();
    } else {
        simulatePlaceholder(sheetName);
    }
}

// Notes download
function downloadNotes() {
    const notes = document.getElementById("chNotes").innerText;
    const blob = new Blob([notes], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Notes.txt";
    link.click();
}

// ===============================
// Simulator: Motion
// ===============================
function simulateMotion() {
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500; canvas.height = 300;

    let velocity = 5;
    let x = 20;

    function animate(t) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.fillRect(x, 150, 40, 40);

        x = 20 + velocity * (t/30);
        if (x < canvas.width - 50) requestAnimationFrame(() => animate(t+1));
    }
    animate(0);

    document.getElementById("chDashboard").innerHTML = `
        <p>Velocity: ${velocity} m/s</p>
        <p>Displacement: ${velocity * 5} m</p>
    `;
}

// ===============================
// Simulator: गति के प्रकार (Types of Motion)
// ===============================
function simulateTypesOfMotion() {
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 600; 
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let angle = 0;
    let x = 50;
    let direction = 1;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Linear Motion (रेखीय गति)
        ctx.fillStyle = "blue";
        ctx.fillRect(x, 50, 40, 40);
        x += 2 * direction;
        if (x > 500 || x < 50) direction *= -1;

        // 2. Circular Motion (वृत्तीय गति)
        ctx.fillStyle = "green";
        let cx = 300 + 80 * Math.cos(angle);
        let cy = 200 + 80 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();

        // 3. Oscillatory Motion (दोलनात्मक गति)
        ctx.fillStyle = "red";
        let ox = 500;
        let oy = 300 + 50 * Math.sin(angle * 2);
        ctx.beginPath();
        ctx.arc(ox, oy, 20, 0, Math.PI * 2);
        ctx.fill();

        angle += 0.05;
        requestAnimationFrame(animate);
    }
    animate();

    document.getElementById("chDashboard").innerHTML = `
        <h3>गति के प्रकार</h3>
        <p><span style="color:blue">रेखीय गति:</span> वस्तु सीधी रेखा में आगे‑पीछे चलती है।</p>
        <p><span style="color:green">वृत्तीय गति:</span> वस्तु वृत्ताकार पथ पर घूमती है।</p>
        <p><span style="color:red">दोलनात्मक गति:</span> वस्तु आगे‑पीछे दोहराव करती है (जैसे पेंडुलम)।</p>
    `;
}

// ===============================
// Simulator: Placeholder for other topics
// ===============================
function simulatePlaceholder(name) {
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500; canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(`${name} Simulation Placeholder`, 150, 150);
    document.getElementById("chDashboard").innerHTML = `<p>Simulation for ${name} coming soon...</p>`;
}

// Start
loadWorkbook();