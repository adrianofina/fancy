document.addEventListener("DOMContentLoaded", () => {

  const intro = document.getElementById("intro");
  const fill  = document.getElementById("introFill");

  if(!intro || !fill) return;

  let progress = 0;

  const loop = setInterval(() => {
    progress += Math.random() * 10;
    fill.style.width = progress + "%";

    if(progress >= 100){
      clearInterval(loop);

      setTimeout(() => {
        intro.style.opacity = "0";
        intro.style.transition = "0.8s ease";

        setTimeout(() => {
          intro.remove();
        }, 800);

      }, 300);
    }

  }, 100);

});
