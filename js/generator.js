/* ================================
   GENERATOR � NEW STYLE ENGINE
================================ */

const inputEl = document.getElementById("genInput");

inputEl.addEventListener("input", debounceAutoGenerate);

function debounceAutoGenerate() {
  clearTimeout(inputEl._t);
  inputEl._t = setTimeout(() => {
    if (inputEl.value.length > 3) {
      generateLook();
    }
  }, 400);
}

document.getElementById("genBtn").addEventListener("click", generateLook);

function generateLook() {
  const input = document.getElementById("genInput").value.toLowerCase();
  const result = document.getElementById("genResult");

  if (!input.trim()) {
    result.innerHTML = `
      <div class="gen-placeholder">
        <div class="gen-ph-title">Say something first.</div>
        <div class="gen-ph-sub">I need a feeling to interpret.</div>
      </div>
    `;
    return;
  }

  let moodLine = "";

  if (input.includes("work")) {
    moodLine = "Structured, quiet confidence, minimal distraction.";
  } else if (input.includes("romantic")) {
    moodLine = "Soft silhouettes, warmth hidden in detail.";
  } else if (input.includes("chaos")) {
    moodLine = "Intentional imbalance, controlled unpredictability.";
  } else {
    moodLine = "Effortless composition with subtle authority.";
  }

  result.innerHTML = `
    <div class="outfit-reveal">
      <div class="outfit-main">
        Ivory blazer, tailored trousers, clean base layer, leather loafers
      </div>
      <div class="outfit-note">
        ${moodLine}
      </div>
    </div>
  `;
}
