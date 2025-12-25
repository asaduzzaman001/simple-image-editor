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
  const ranges = document.querySelectorAll(".range");
  const inputs = document.querySelectorAll(".number-input");

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
    // if (file) {
    //   document.getElementById("placeholder").classList.add("vanish");
    // }
    const canvas = document.getElementById("image-canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      imagePreview.src = URL.createObjectURL(file);
    };

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    console.log(canvas);
  });
}
imageControler();

loadData();
