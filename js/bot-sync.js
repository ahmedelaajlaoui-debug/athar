/* bot-sync.js : ajoute dans AA.products les produits publiés par le bot WhatsApp */
(function () {
  try {
    if (typeof AA === "undefined" || !Array.isArray(AA.products)) return;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/products", false);
    xhr.send();
    if (xhr.status !== 200) return;

    var botProducts = JSON.parse(xhr.responseText);
    var cats = Array.isArray(AA.categories) ? AA.categories : [];

    botProducts.forEach(function (p) {
      var id = String(p.id);
      if (AA.products.some(function (x) { return String(x.id) === id; })) return;

      var artisanId = "coop-" + p.coopId;
      if (Array.isArray(AA.artisans) && !AA.artisans.some(function (a) { return a.id === artisanId; })) {
        AA.artisans.push({
          id: artisanId,
          name: p.cooperativeName,
          city: p.city,
          craft: p.category,
          specialty: (p.cooperativeDetails && p.cooperativeDetails.specialty) || "",
          photo: "",
          verified: true
        });
      }

      AA.products.push({
        id: id,
        name: p.name,
        price: p.price,
        cat: cats.indexOf(p.category) !== -1 ? p.category : (cats[0] || p.category),
        image: p.images && p.images[0] ? "/uploads/" + p.images[0] : "",
        images: (p.images || []).map(function (f) { return "/uploads/" + f; }),
        video: p.video ? "/videos/" + p.video : "",
        desc: p.description,
        description: p.description,
        artisan: artisanId,
        city: p.city,
        stock: p.stock,
        inStock: p.available,
        verified: true,
        fromBot: true,
        coopName: p.cooperativeName || "",
        region: p.region || "",
        qrCode: p.qrCode ? "/qrcodes/" + p.qrCode : ""
      });
    });
  } catch (e) {
    console.warn("bot-sync :", e.message);
  }
})();
