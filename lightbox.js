(() => {
  const root = document.querySelector(".lightbox");
  const image = document.querySelector(".lightbox__image");
  const backdrop = document.querySelector(".lightbox__backdrop");
  if (!root || !image || !backdrop) return;

  const open = (src) => {
    image.src = src;
    root.hidden = false;
    document.body.classList.add("is-lightbox");
  };

  const close = () => {
    root.hidden = true;
    image.removeAttribute("src");
    document.body.classList.remove("is-lightbox");
  };

  document.querySelectorAll(".study[data-full]").forEach((study) => {
    study.addEventListener("click", () => {
      const src = study.getAttribute("data-full");
      if (src) open(src);
    });
  });

  backdrop.addEventListener("click", close);

  image.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !root.hidden) close();
  });
})();
