window.addEventListener("load", () => {

  const intro = document.getElementById("intro");
  const bar = document.getElementById("introProgress");
  const app = document.getElementById("app");

  console.log("loader running", { intro, bar, app });

  let p = 0;

  const loop = setInterval(() => {

    p += 5;

    console.log("progress:", p);

    if (bar) {
      bar.style.width = p + "%";
    }

    if (p >= 100) {
      clearInterval(loop);

      setTimeout(() => {
        intro.style.opacity = "0";

        setTimeout(() => {
          intro.remove();
          app.style.display = "block";
        }, 500);

      }, 200);
    }

  }, 80);

});
