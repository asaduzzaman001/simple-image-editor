let data;
let currentImage;
const imageInput = document.getElementById("image-input");
const btnImageInput = document.getElementById("btn-image-input");
const cancelBtn = document.getElementById("cancel");
const placeholder = document.getElementById("placeholder");
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-btn");

async function loadData() {
  try {
    const response = await fetch("./data.json");
    data = await response.json();

    loadFilters();
  } catch (error) {
    console.error("Failed to load:", error);
    alert("Failed to load data. Please try again later.");
  }
}

function loadFilters() {
  const toolsContainer = document.getElementById("tools-container");

  data.filters.forEach((filter) => {
    const tool = document.createElement("div");
    tool.className = "tool";
    tool.innerHTML = `
            <div class="info">
              <label for="${filter.name}">${filter.name}</label>
              <div class="value">
                <input
                  type="number"
                  name="${filter.name}"
                  id="${filter.name}-number"
                  class="number-input"
                  value="${filter.value}"
                  step="1"
                />
                <span>${filter.unit}</span>
              </div>
            </div>
            <input
              type="range"
              name="${filter.name}"
              id="${filter.name}"
              class="range"
              min="${filter.min}"
              max="${filter.max}"
              value="${filter.value}"
              step ="1"
            />
    `;
    toolsContainer.appendChild(tool);
  });
  const ranges = document.querySelectorAll(".range");
  const inputs = document.querySelectorAll(".number-input");
  controlValues(ranges);
  controlValues(inputs);
}

function resetFilters(items) {
  items.forEach((item) => {
    const defaultValue = data.filters.find(
      (filter) => filter.name === item.name
    ).value;
    item.value = defaultValue;
  });
  applyFilters(items);
}
function controlValues(items) {
  items.forEach((item) => {
    item.oninput = (e) => {
      let targetValue = e.target.value;
      let targetName = e.target.name;
      let input;
      if (e.target.type === "range") {
        input = document.getElementById(`${targetName}-number`);
      } else {
        input = document.getElementById(`${targetName}`);
      }
      input.value = targetValue;
      applyFilters(items);
    };
  });
}

function chooseImage(e) {
  let file = e.target.files[0];
  if (!file) return;
  const inputs = document.querySelectorAll(".number-input");
  const ranges = document.querySelectorAll(".range");
  resetFilters(ranges);
  resetFilters(inputs);

  const image = new Image();
  image.src = URL.createObjectURL(file);

  image.onload = () => {
    currentImage = image;
    placeholder.classList.add("vanish");
    canvas.classList.remove("vanish");
    cancelBtn.classList.remove("vanish");

    // 🔹 Screen / container width (mobile friendly)
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.7;

    // 🔹 Original ratio
    let ratio = image.width / image.height;

    let newWidth = image.width;
    let newHeight = image.height;

    // 🔹 Resize logic (ratio বজায় রেখে)
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / ratio;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * ratio;
    }

    // 🔹 Canvas resize
    canvas.width = newWidth;
    canvas.height = newHeight;

    // 🔹 Clear & draw
    drawImage();
  };
}

function imageControler() {
  cancelBtn.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add("vanish");
    placeholder.classList.remove("vanish");
    cancelBtn.classList.add("vanish");
    imageInput.value = "";
    currentImage = null;

    // Reset filters
    const inputs = document.querySelectorAll(".number-input");
    const ranges = document.querySelectorAll(".range");
    resetFilters(ranges);
    resetFilters(inputs);
  };

  imageInput.onchange = chooseImage;
  btnImageInput.onchange = chooseImage;

  resetBtn.onclick = () => {
    const inputs = document.querySelectorAll(".number-input");
    const ranges = document.querySelectorAll(".range");
    resetFilters(ranges);
    resetFilters(inputs);
  };

  downloadBtn.onclick = () => {
    if (!currentImage) {
      alert("No image to download. Please choose an image first.");
      return;
    }

    const file = imageInput.files[0] || btnImageInput.files[0];
    const fileName = file.name;
    // --- Create a temp full-resolution canvas ---
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");

    exportCanvas.width = currentImage.width;
    exportCanvas.height = currentImage.height;

    // --- Grab current filter values ---
    const ranges = document.querySelectorAll(".range");
    const tempFilters = Array.from(ranges);

    // --- Apply filters ---
    exportCtx.filter = buildFilters(tempFilters);

    // --- Draw full image at actual resolution ---
    exportCtx.drawImage(currentImage, 0, 0);

    // --- Create download link ---
    const link = document.createElement("a");
    link.download = `edited-${fileName}`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };
}

function drawImage(items) {
  if (!currentImage) return;
  ctx.filter = items ? buildFilters(items) : "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
}

function buildFilters(items) {
  let filterStr = "";
  items.forEach((item) => {
    const [name, val] = [item.name, item.value];
    const unit = data.filters.find((f) => f.name === name).unit;
    filterStr += `${name}(${val}${unit}) `;
  });
  return filterStr.trim();
}

function applyFilters(items) {
  drawImage(items);
}

imageControler();
loadData();
