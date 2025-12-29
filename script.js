async function loadData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    loadFilters(data);
  } catch (error) {
    console.error("Failed to load:", error);
    alert("Failed to load data. Please try again later.");
  }
}

function loadFilters(data) {
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

function controlValues(items) {
  items.forEach((item) => {
    item.addEventListener("input", (e) => {
      const value = e.target.value;
      const name = e.target.name;
      let input;
      if (e.target.type === "range") {
        input = document.getElementById(`${name}-number`);
      } else {
        input = document.getElementById(`${name}`);
      }
      input.value = value;
    });
  });
}

function imageControler() {
  const imageInput = document.getElementById("image-input");

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const canvas = document.getElementById("image-canvas");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      document.getElementById("placeholder").classList.add("vanish");
      canvas.classList.remove("vanish");

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
    };
  });
}

imageControler();

loadData();
