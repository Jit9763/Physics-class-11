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
// इस function को अपने sim.js में रखें और जब भी यह topic लोड हो तो call करें:
// Example: if (sheetName.toLowerCase().includes("स्थिति")) showPositionPathDisplacement();

// ===============================
// Content + UI for: स्थिति, पथ लम्बाई एवं विस्थापन
// (Standalone function — dispatcher से बस call करें)
// ===============================
(function(){
  // keep a handle to cancel any canvas animation started by this module
  let _rafId = null;

  function clearCanvasAndCancel() {
    if (_rafId) {
      cancelAnimationFrame(_rafId);
      _rafId = null;
    }
    const canvas = document.getElementById("mainCanvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function showPositionPathDisplacement() {
    // cancel previous animations and clear canvas
    clearCanvasAndCancel();

    // DOM elements
    const titleEl = document.getElementById("chTitle");
    const defEl = document.getElementById("chDef");
    const notesEl = document.getElementById("chNotes");
    const dashEl = document.getElementById("chDashboard");
    const canvas = document.getElementById("mainCanvas");

    if (!titleEl || !defEl || !notesEl || !dashEl) {
      console.error("showPositionPathDisplacement: required DOM elements missing (chTitle/chDef/chNotes/chDashboard).");
      return;
    }

    // Content
    titleEl.textContent = "स्थिति, पथ लम्बाई एवं विस्थापन";
    defEl.textContent = "किसी भी वस्तु की गति का अध्ययन करने के लिए चार प्रकार के कारकों का होना आवश्यक है। यह है वस्तु की स्थिति, पथ की लम्बाई, वस्तु का विस्थापन और समय। इन चार कारकों के अलावा एक संदर्भ बिन्दु की भी आवश्यकता होती है जिसकी सापेक्ष वस्तु की गति का अध्ययन किया जाता है।";

    // Notes (interactive)
    const items = [
      { name: "स्थिति (Position)", text: "किसी निश्चित संदर्भ बिन्दु के सापेक्ष वस्तु का स्थान; निर्देशांक (x, y) से दर्शाया जा सकता है।" },
      { name: "पथ लम्बाई (Path length)", text: "वस्तु द्वारा तय की गई कुल दूरी; यह हमेशा धनात्मक और स्केलर मात्रा है।" },
      { name: "विस्थापन (Displacement)", text: "प्रारम्भिक और अन्तिम स्थिति के बीच की सीधी रेखा; यह दिशा सहित वेक्टर मात्रा है।" },
      { name: "समय (Time)", text: "गति के अध्ययन के लिए आवश्यक समय अंतराल; गति और चाल जैसी मात्राएँ समय पर निर्भर करती हैं।" },
      { name: "संदर्भ बिन्दु (Reference point)", text: "वह बिन्दु जिसके सापेक्ष स्थिति और विस्थापन मापे जाते हैं।" }
    ];

    // render notes
    notesEl.innerHTML = "";
    const ul = document.createElement("ul");
    ul.style.paddingLeft = "18px";
    ul.style.lineHeight = "1.6";
    items.forEach((it, idx) => {
      const li = document.createElement("li");
      li.style.marginBottom = "10px";

      const strong = document.createElement("strong");
      strong.textContent = it.name + ": ";
      strong.style.cursor = "pointer";

      const span = document.createElement("span");
      span.textContent = it.text;
      span.style.marginLeft = "6px";
      span.style.color = "#333";

      // toggle highlight on click for clarity
      strong.addEventListener("click", () => {
        span.style.color = span.style.color === "rgb(51, 51, 51)" ? "#1a73e8" : "#333";
      });

      li.appendChild(strong);
      li.appendChild(span);
      ul.appendChild(li);
    });
    notesEl.appendChild(ul);

    // dashboard summary
    dashEl.innerHTML = `
      <div style="font-weight:600; margin-bottom:6px">सारांश</div>
      <div style="font-size:0.95em; color:#333">
        स्थिति = स्थान; पथ लम्बाई = कुल दूरी; विस्थापन = दिशा सहित वेक्टर; समय = अवधी; संदर्भ बिन्दु आवश्यक।
      </div>
    `;

    // small visual demo on canvas (position vs displacement)
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = 560;
      canvas.height = 220;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // draw reference point and two paths to show difference between path length and displacement
      const refX = 40, refY = 110;
      ctx.font = "14px Arial";
      ctx.fillStyle = "#222";
      ctx.fillText("Reference Point", refX - 10, refY - 20);

      // path: a curved route (path length)
      const pathPoints = [
        {x: 80, y: 160},
        {x: 160, y: 60},
        {x: 260, y: 150},
        {x: 360, y: 80},
        {x: 480, y: 140}
      ];

      // draw reference point
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(refX, refY, 5, 0, Math.PI*2);
      ctx.fill();

      // draw path (dashed)
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 2;
      ctx.setLineDash([6,4]);
      ctx.beginPath();
      ctx.moveTo(refX, refY);
      pathPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);

      // draw straight displacement (solid red)
      const last = pathPoints[pathPoints.length - 1];
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(refX, refY);
      ctx.lineTo(last.x, last.y);
      ctx.stroke();

      // labels
      ctx.fillStyle = "#444";
      ctx.fillText("Path (total distance)", 120, 40);
      ctx.fillStyle = "red";
      ctx.fillText("Displacement (vector)", 360, 40);

      // animate a small dot moving along the curved path to show path length
      let t = 0;
      function animateDot() {
        // compute position along piecewise linear approximation of path
        const segments = [{x:refX,y:refY}, ...pathPoints];
        // total length
        let segLens = [];
        let total = 0;
        for (let i=0;i<segments.length-1;i++){
          const dx = segments[i+1].x - segments[i].x;
          const dy = segments[i+1].y - segments[i].y;
          const L = Math.hypot(dx,dy);
          segLens.push(L);
          total += L;
        }
        // progress along total by (t % total)
        const speed = 60; // pixels per second
        const prog = (t * speed) % total;
        let acc = 0, px=segments[0].x, py=segments[0].y;
        for (let i=0;i<segLens.length;i++){
          if (acc + segLens[i] >= prog) {
            const remain = prog - acc;
            const ratio = remain / segLens[i];
            px = segments[i].x + (segments[i+1].x - segments[i].x) * ratio;
            py = segments[i].y + (segments[i+1].y - segments[i].y) * ratio;
            break;
          }
          acc += segLens[i];
        }

        // redraw small moving dot
        ctx.clearRect(0, 180, canvas.width, 40); // clear bottom area only (keep path)
        // draw dot on path
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI*2);
        ctx.fill();

        // draw displacement arrow head (static)
        ctx.fillStyle = "red";
        const dx = last.x - refX, dy = last.y - refY;
        const midx = refX + dx*0.6, midy = refY + dy*0.6;
        ctx.beginPath();
        ctx.moveTo(midx, midy);
        // small arrow head
        const ang = Math.atan2(dy, dx);
        ctx.lineTo(midx - 8*Math.cos(ang - 0.3), midy - 8*Math.sin(ang - 0.3));
        ctx.lineTo(midx - 8*Math.cos(ang + 0.3), midy - 8*Math.sin(ang + 0.3));
        ctx.closePath();
        ctx.fill();

        t += 0.016; // approx 60fps
        _rafId = requestAnimationFrame(animateDot);
      }

      // start animation
      _rafId = requestAnimationFrame(animateDot);
    }
  }

  // expose globally so dispatcher can call it without changing old code
  window.showPositionPathDisplacement = showPositionPathDisplacement;
})();
// ---------- Lightweight Chapter Registry (paste at end of sim.js) ----------
(function(){
  const registry = [];

  // register: name (display), matcher (string|regex|function), handler(workbook,sheetName,rows)
  function registerChapter(name, matcher, handler) {
    registry.push({name, matcher, handler});
    console.log("Chapter registered:", name);
  }

  function findHandler(sheetName) {
    const key = (sheetName || "").toLowerCase().trim();
    for (const r of registry) {
      if (typeof r.matcher === "function" && r.matcher(key)) return r.handler;
      if (typeof r.matcher === "string" && key.includes(r.matcher.toLowerCase())) return r.handler;
      if (r.matcher instanceof RegExp && r.matcher.test(key)) return r.handler;
      if (r.name && r.name.toLowerCase().trim() === key) return r.handler;
    }
    return null;
  }

  // wrap existing global loadSheet if present
  if (typeof window.loadSheet === "function") {
    const original = window.loadSheet;
    window.loadSheet = function(workbook, sheetName) {
      try { original(workbook, sheetName); } catch(e) { console.error("original loadSheet error:", e); }

      try {
        const handler = findHandler(sheetName);
        if (!handler) return;
        // try to build rows (safe)
        let rows = null;
        try {
          const sheet = workbook && workbook.Sheets && workbook.Sheets[sheetName];
          rows = sheet && typeof XLSX !== "undefined" && XLSX.utils ? XLSX.utils.sheet_to_json(sheet, {header:1, raw:false}) : null;
        } catch(e) { rows = null; }
        // optional: stop previous animations if helper exists
        if (typeof cancelAllAnimations === "function") cancelAllAnimations();
        handler(workbook, sheetName, rows);
      } catch(err) {
        console.error("Chapter handler error for", sheetName, err);
      }
    };
    console.log("loadSheet wrapped to support ChapterRegistry.");
  } else {
    // fallback: expose manual trigger
    window.callRegisteredChapter = function(sheetName, workbook, rows) {
      const h = findHandler(sheetName);
      if (h) h(workbook, sheetName, rows);
    };
    console.log("loadSheet not found — use callRegisteredChapter(sheetName) to trigger handlers.");
  }

  // expose register API
  window.ChapterRegistry = {
    register: registerChapter,
    _list: function(){ return registry.map(r => r.name); }
  };
})();
// अगर आपके पास पहले से simulateTypesOfMotion() defined है:
ChapterRegistry.register(
  "गति के प्रकार",
  "गति के प्रकार",
  function(workbook, sheetName, rows) {
    if (typeof simulateTypesOfMotion === "function") simulateTypesOfMotion();
  }
);

// आपकी sheet: "स्थिति, पथ लम्बाई एवं विस्थापन"
ChapterRegistry.register(
  "स्थिति, पथ लम्बाई एवं विस्थापन",
  "स्थिति, पथ लम्बाई एवं विस्थापन",
  function(workbook, sheetName, rows) {
    if (typeof window.showPositionPathDisplacement === "function") {
      window.showPositionPathDisplacement();
    } else {
      // fallback: छोटा UI update
      const dash = document.getElementById("chDashboard");
      if (dash) dash.innerHTML = "<strong>सारांश:</strong> स्थिति, पथ लम्बाई एवं विस्थापन";
    }
  }
);
// ---------- Distance chapter handler (interactive simulator) ----------
(function(){
  function format(n){ return Math.round(n*100)/100; }

  function distanceChapterHandler(workbook, sheetName, rows) {
    // stop any previous animations if helper exists
    if (typeof cancelAllAnimations === "function") cancelAllAnimations();
    if (window._distanceRaf) { cancelAnimationFrame(window._distanceRaf); window._distanceRaf = null; }

    // DOM refs
    const dash = document.getElementById("chDashboard");
    const notesEl = document.getElementById("chNotes");
    const canvas = document.getElementById("mainCanvas");
    if (!dash || !notesEl || !canvas) {
      console.error("Required elements missing for distanceChapterHandler");
      return;
    }

    // UI: dashboard controls
    dash.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div>
          <button id="distPlay">Play</button>
          <button id="distPause">Pause</button>
          <button id="distReset">Reset</button>
        </div>
        <div style="min-width:160px">
          <label>Speed: <input id="distSpeed" type="range" min="20" max="300" value="100"></label>
        </div>
        <div style="min-width:160px">
          <label>Time: <span id="distTimer">0.00</span> s</label>
        </div>
        <div style="min-width:160px">
          <label>Distance (path): <span id="distPath">0.00</span> px</label>
        </div>
        <div style="min-width:160px">
          <label>Displacement: <span id="distDisp">0.00</span> px</label>
        </div>
      </div>
    `;

    // Notes: short explanation
    notesEl.innerHTML = `
      <div><strong> स्थिति (Position):</strong> किसी निश्चित संदर्भ बिन्दु के सापेक्ष वस्तु का स्थान; निर्देशांक (x, y) से दर्शाया जा सकता है।
<strong>पथ लम्बाई (Path length):</strong> वस्तु द्वारा तय की गई कुल दूरी; यह हमेशा धनात्मक और स्केलर मात्रा है।
<strong> विस्थापन (Displacement)</strong> प्रारम्भिक और अन्तिम स्थिति के बीच की सीधी रेखा; यह दिशा सहित वेक्टर मात्रा है।
<strong>समय (Time):</strong> गति के अध्ययन के लिए आवश्यक समय अंतराल; गति और चाल जैसी मात्राएँ समय पर निर्भर करती हैं।
<strong>संदर्भ बिन्दु (Reference point):</strong> वह बिन्दु जिसके सापेक्ष स्थिति और विस्थापन मापे जाते हैं।</div>
      <div style="margin-top:6px;color:#555"></div>
    `;

    // Canvas setup
    const ctx = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 320;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Path definition (you can change these points or derive from rows if needed)
    const path = [
      {x:80, y:260},
      {x:160, y:120},
      {x:260, y:200},
      {x:360, y:80},
      {x:480, y:220},
      {x:600, y:140}
    ];

    // draw axes function
    function drawAxes(){
      ctx.save();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      // x axis
      ctx.beginPath(); ctx.moveTo(40,280); ctx.lineTo(canvas.width-20,280); ctx.stroke();
      // y axis
      ctx.beginPath(); ctx.moveTo(40,20); ctx.lineTo(40,300); ctx.stroke();
      // ticks
      ctx.fillStyle = "#999"; ctx.font = "11px Arial";
      for (let x=80;x<=640;x+=40){
        ctx.beginPath(); ctx.moveTo(x,276); ctx.lineTo(x,284); ctx.stroke();
        ctx.fillText((x-40).toString(), x-6, 300);
      }
      for (let y=40;y<=280;y+=40){
        ctx.beginPath(); ctx.moveTo(36,y); ctx.lineTo(44,y); ctx.stroke();
        ctx.fillText((280-y).toString(), 6, y+4);
      }
      ctx.restore();
    }

    // draw path (dashed) and nodes
    function drawPath(){
      ctx.save();
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 2;
      ctx.setLineDash([6,4]);
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i=1;i<path.length;i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();
      ctx.setLineDash([]);
      // nodes
      ctx.fillStyle = "#666";
      for (let p of path){
        ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    // compute segment lengths and total
    const segments = [{x:path[0].x,y:path[0].y}, ...path];
    const segLens = [];
    for (let i=0;i<segments.length-1;i++){
      const dx = segments[i+1].x - segments[i].x;
      const dy = segments[i+1].y - segments[i].y;
      segLens.push(Math.hypot(dx,dy));
    }
    const totalLen = segLens.reduce((a,b)=>a+b,0);

    // state
    let playing = false;
    let t = 0; // seconds
    let speedPxPerSec = 100; // default
    let traveled = 0; // path length traveled in px
    let lastTime = null;

    // UI refs
    const btnPlay = document.getElementById("distPlay");
    const btnPause = document.getElementById("distPause");
    const btnReset = document.getElementById("distReset");
    const speedInput = document.getElementById("distSpeed");
    const timerEl = document.getElementById("distTimer");
    const pathEl = document.getElementById("distPath");
    const dispEl = document.getElementById("distDisp");

    // event listeners
    btnPlay.onclick = () => { playing = true; lastTime = null; };
    btnPause.onclick = () => { playing = false; lastTime = null; };
    btnReset.onclick = () => { playing = false; t = 0; traveled = 0; lastTime = null; updateDisplays(); drawFrame(0); };
    speedInput.oninput = (e) => { speedPxPerSec = Number(e.target.value); };

    // helper: get position along path for given traveled length
    function posAtLength(L){
      if (L <= 0) return {x:segments[0].x, y:segments[0].y};
      let acc = 0;
      for (let i=0;i<segLens.length;i++){
        if (acc + segLens[i] >= L) {
          const remain = L - acc;
          const r = remain / segLens[i];
          const sx = segments[i].x, sy = segments[i].y;
          const ex = segments[i+1].x, ey = segments[i+1].y;
          return {x: sx + (ex-sx)*r, y: sy + (ey-sy)*r};
        }
        acc += segLens[i];
      }
      // beyond end
      const last = segments[segments.length-1];
      return {x:last.x, y:last.y};
    }

    // update numeric displays
    function updateDisplays(){
      timerEl.textContent = format(t);
      pathEl.textContent = format(traveled);
      // displacement = distance from start to current straight-line
      const start = segments[0];
      const cur = posAtLength(traveled);
      const disp = Math.hypot(cur.x - start.x, cur.y - start.y);
      dispEl.textContent = format(disp);
    }

    // draw one frame (keeps axes and path static)
    function drawFrame(alpha){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawAxes();
      drawPath();

      // draw displacement vector (red) from start to current
      const start = segments[0];
      const cur = posAtLength(traveled);
      ctx.save();
      ctx.strokeStyle = "red"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(cur.x, cur.y); ctx.stroke();
      // arrow head
      const dx = cur.x - start.x, dy = cur.y - start.y;
      const ang = Math.atan2(dy, dx);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(cur.x, cur.y);
      ctx.lineTo(cur.x - 8*Math.cos(ang - 0.3), cur.y - 8*Math.sin(ang - 0.3));
      ctx.lineTo(cur.x - 8*Math.cos(ang + 0.3), cur.y - 8*Math.sin(ang + 0.3));
      ctx.closePath(); ctx.fill();
      ctx.restore();

      // draw moving dot (blue) at cur
      ctx.fillStyle = "#1a73e8";
      ctx.beginPath(); ctx.arc(cur.x, cur.y, 8, 0, Math.PI*2); ctx.fill();

      // small labels
      ctx.fillStyle = "#333"; ctx.font = "12px Arial";
      ctx.fillText("Start", start.x - 20, start.y + 20);
      ctx.fillText("Current", cur.x + 10, cur.y - 10);
    }

    // animation loop
    function loop(ts){
      if (!lastTime) lastTime = ts;
      const dt = (ts - lastTime) / 1000; // seconds
      lastTime = ts;
      if (playing) {
        t += dt;
        traveled += speedPxPerSec * dt;
        if (traveled > totalLen) traveled = totalLen; // stop at end
      }
      updateDisplays();
      drawFrame();
      // stop automatically when reached end
      if (traveled >= totalLen) playing = false;
      window._distanceRaf = requestAnimationFrame(loop);
    }

    // initial draw and start paused
    traveled = 0; t = 0; playing = false; updateDisplays(); drawFrame();
    // start RAF so UI updates even when paused (but movement only when playing)
    if (!window._distanceRaf) window._distanceRaf = requestAnimationFrame(loop);
  }

  // register this handler (sheet name: "distance" or exact localized name)
  if (window && window.ChapterRegistry && typeof window.ChapterRegistry.register === "function") {
    // register for English "distance" and Hindi "distance" sheet name if needed
    window.ChapterRegistry.register("distance", "distance", distanceChapterHandler);
    window.ChapterRegistry.register("distance (localized)", "distance".toLowerCase(), distanceChapterHandler);
    console.log("Distance chapter handler registered.");
  } else {
    // fallback: expose globally so you can call manually
    window.distanceChapterHandler = distanceChapterHandler;
    console.log("ChapterRegistry not found — distanceChapterHandler exposed on window.");
  }
})();