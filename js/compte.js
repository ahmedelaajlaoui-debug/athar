/* compte.js — connexion, inscription et « Mes commandes » (page profil.html) */
document.addEventListener("DOMContentLoaded", async () => {
  const LABELS = {
    NOUVELLE: ["🟡", "Commande reçue"],
    CONFIRMEE: ["🟢", "Confirmée par la coopérative"],
    EN_PREPARATION: ["🧵", "En préparation"],
    EXPEDIEE: ["🚚", "Expédiée"],
    LIVREE: ["✅", "Livrée"],
    ANNULEE: ["❌", "Annulée"],
  };
  const $ = (id) => document.getElementById(id);

  function orderHtml(o) {
    const rows = o.items
      .map((i) => {
        const l = LABELS[i.status] || LABELS.NOUVELLE;
        return `<div class="price-line"><span>${AA.esc(i.name)} × ${i.qty}</span><span>${l[0]} ${l[1]}</span></div>`;
      })
      .join("");
    return (
      `<div class="form-card mb-2"><strong>Commande ${AA.esc(o.ref)}</strong> · ` +
      new Date(o.createdAt).toLocaleDateString("fr-FR") +
      rows +
      `<div class="price-line price-line--total"><span>Total produits</span><span>${AA.formatMAD(o.total)}</span></div></div>`
    );
  }

  async function showUser(user) {
    document.dispatchEvent(new CustomEvent("aa:auth", { detail: user })); // met à jour l'en-tête (profil.js)
    $("auth-guest").classList.add("hidden");
    $("auth-user").classList.remove("hidden");
    $("auth-name").textContent = user.name;
    $("auth-email").textContent = user.email;

    const box = $("orders-status");
    const r = await AUTH.api("/api/my/orders");
    if (!r.ok) {
      box.innerHTML = '<p class="muted">Impossible de charger vos commandes.</p>';
      return;
    }
    box.innerHTML = r.data.length
      ? r.data.map(orderHtml).join("")
      : '<p class="muted">Aucune commande pour le moment.</p>';
  }

  function showGuest() {
    $("auth-user").classList.add("hidden");
    $("auth-guest").classList.remove("hidden");
  }

  // Retour vers checkout.html après connexion (profil.html?next=checkout.html)
  function afterAuth() {
    const next = new URLSearchParams(location.search).get("next");
    if (next && /^[a-z0-9_-]+\.html$/i.test(next)) {
      location.href = next;
      return true;
    }
    return false;
  }

  const user = await AUTH.me();
  if (user) showUser(user);
  else showGuest();

  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("login-error").textContent = "";
    const r = await AUTH.login($("l-email").value.trim(), $("l-pass").value);
    if (!r.ok) {
      $("login-error").textContent = r.data.error || "Erreur";
      return;
    }
    if (!afterAuth()) showUser(r.data.user);
  });

  $("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("register-error").textContent = "";
    const r = await AUTH.register({
      name: $("r-name").value,
      phone: $("r-phone").value,
      email: $("r-email").value,
      password: $("r-pass").value,
    });
    if (!r.ok) {
      $("register-error").textContent = r.data.error || "Erreur";
      return;
    }
    if (!afterAuth()) showUser(r.data.user);
  });

  $("logout-btn").addEventListener("click", () => {
    AUTH.logout();
    document.dispatchEvent(new CustomEvent("aa:logout"));
    showGuest();
  });
});