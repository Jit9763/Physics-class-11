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

    // Simulator dispatcher (sheetName के आधार पर)
    if (sheetName.toLowerCase().includes("motion")) simulateMotion();
    else simulatePlaceholder(sheetName);
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

// Simulator: Motion
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

// Simulator: Placeholder for other topics
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