function generateOutfit(){

  const result = document.getElementById("outfitResult");
  result.innerHTML = "Curating your look...";

  setTimeout(() => {

    const pool = items.length ? items : [];

    const pick = () => pool[Math.floor(Math.random() * pool.length)];

    const outfit = [pick(), pick(), pick()];

    result.innerHTML = `
      <div class="outfit-card reveal">
        <h3>Curated Ensemble</h3>
        <p>${outfit[0].name}</p>
        <p>${outfit[1].name}</p>
        <p>${outfit[2].name}</p>
        <small>A composition from your archive</small>
      </div>
    `;
  }, 900);
}
