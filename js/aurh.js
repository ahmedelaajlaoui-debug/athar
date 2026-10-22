/* auth.js — comptes utilisateurs (inscription, connexion, appels API authentifiés) */
window.AUTH = (function () {
  const KEY = "aa_token";
  const token = () => localStorage.getItem(KEY);

  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token()) headers.Authorization = "Bearer " + token();
    let res;
    try {
      res = await fetch(path, {
        method: opts.method || "GET",
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
    } catch (e) {
      return { ok: false, status: 0, data: { error: "Serveur injoignable. Réessayez." } };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  async function register(fields) {
    const r = await api("/api/auth/register", { method: "POST", body: fields });
    if (r.ok) localStorage.setItem(KEY, r.data.token);
    return r;
  }

  async function login(email, password) {
    const r = await api("/api/auth/login", { method: "POST", body: { email, password } });
    if (r.ok) localStorage.setItem(KEY, r.data.token);
    return r;
  }

  async function me() {
    if (!token()) return null;
    const r = await api("/api/auth/me");
    if (!r.ok) {
      if (r.status === 401) localStorage.removeItem(KEY);
      return null;
    }
    return r.data.user;
  }

  function logout() {
    localStorage.removeItem(KEY);
  }

  return { token, api, register, login, me, logout };
})();