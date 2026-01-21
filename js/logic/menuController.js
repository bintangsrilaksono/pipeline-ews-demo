// ===== MENU VIEW SWITCH =====
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-item")
      .forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.remove("active"));

    const view = item.dataset.view;
    console.log("VIEW:", view);

    if (!view) return;

    const section = document.getElementById(`view-${view}`);
    if (section) section.classList.add("active");

    document.dispatchEvent(
      new CustomEvent("viewChanged", {
        detail: { view },
      }),
    );
  });
});

// ===== TIME FILTER =====
document.querySelectorAll(".time-range li").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".time-range li")
      .forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    const range = item.dataset.range;

    document.dispatchEvent(
      new CustomEvent("timeRangeChanged", {
        detail: { range },
      }),
    );
  });
});
