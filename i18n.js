/* ============================================================
   MANIFORIA — i18n + küçük etkileşimler
   · Tüm metinler tek sözlükte (tr/en)
   · Seçim localStorage'da saklanır, <html lang> + meta güncellenir
   · data-i18n      → textContent
   · data-i18n-html → innerHTML (yalnızca sözlükteki güvenli işaretleme)
   · data-lang-content="tr|en" → yasal sayfalarda içerik blokları
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "maniforia_lang";

  var I18N = {
    tr: {
      "hero.eyebrow": "Geleceğini Tasarla",

      "flow1.s1": "Manifestini yaz",
      "flow1.s2": "Gelecekteki senden hikayeni oluşturalım",
      "flow1.s3": "Hikayeni kendi sesinle dinle",

      "flow2.s1": "Selfie yükle",
      "flow2.s2": "Manifestini yaz",
      "flow2.s3": "Seni hayalinin içine koyalım",

      "features.f1": "Her gün olumlama kartları",
      "features.f2": "Günlük Seri Sistemi",
      "features.f3": "Aura puanlarıyla rozetler kazan",

      "appstore.small": "App Store'dan",
      "appstore.big": "İndir",

      "googleplay.small": "Google Play'den",
      "googleplay.big": "İndir",

      "gallery.eyebrow": "Uygulamadan",
      "gallery.title": "Büyünün <em>içine</em> bak",

      "footer.privacy": "Gizlilik Politikası",
      "footer.terms": "Kullanım Koşulları",
      "footer.support": "Destek",
      "footer.rights": "Tüm hakları saklıdır.",

      "legal.privacy.title": "Gizlilik Politikası",
      "legal.terms.title": "Kullanım Koşulları",
      "legal.support.title": "Destek & İletişim",

      pages: {
        index: {
          title: "Maniforia — Manifestini yaz, hikayeni kendi sesinle dinle",
          desc: "Maniforia: manifest ve olumlama uygulaması. Manifestini yaz, gelecekteki senden hikayeni oluşturalım, kendi sesinle dinle. Her gün olumlama kartları, seri sistemi ve Aura rozetleri."
        },
        privacy: {
          title: "Gizlilik Politikası — Maniforia",
          desc: "Maniforia gizlilik politikası."
        },
        terms: {
          title: "Kullanım Koşulları — Maniforia",
          desc: "Maniforia kullanım koşulları."
        },
        support: {
          title: "Destek & İletişim — Maniforia",
          desc: "Maniforia destek ve iletişim."
        }
      }
    },

    en: {
      "hero.eyebrow": "Design Your Future",

      "flow1.s1": "Write your manifest",
      "flow1.s2": "We craft your story from your future self",
      "flow1.s3": "Hear it in your own voice",

      "flow2.s1": "Upload a selfie",
      "flow2.s2": "Write your manifest",
      "flow2.s3": "We place you inside your dream",

      "features.f1": "Daily affirmation cards",
      "features.f2": "Daily streak system",
      "features.f3": "Earn badges with Aura points",

      "appstore.small": "Download on the",
      "appstore.big": "App Store",

      "googleplay.small": "Get it on",
      "googleplay.big": "Google Play",

      "gallery.eyebrow": "From the app",
      "gallery.title": "Step <em>inside</em> the magic",

      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Use",
      "footer.support": "Support",
      "footer.rights": "All rights reserved.",

      "legal.privacy.title": "Privacy Policy",
      "legal.terms.title": "Terms of Use",
      "legal.support.title": "Support & Contact",

      pages: {
        index: {
          title: "Maniforia — Write your manifest, hear it in your own voice",
          desc: "Maniforia: a manifestation and affirmation app. Write your manifest, let us craft your story from your future self, and hear it in your own voice. Daily affirmation cards, streaks and Aura badges."
        },
        privacy: {
          title: "Privacy Policy — Maniforia",
          desc: "Maniforia privacy policy."
        },
        terms: {
          title: "Terms of Use — Maniforia",
          desc: "Maniforia terms of use."
        },
        support: {
          title: "Support & Contact — Maniforia",
          desc: "Maniforia support and contact."
        }
      }
    }
  };

  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === "tr" || saved === "en") return saved;
    // İlk ziyaret: tarayıcı diline göre
    return (navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en";
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyLang(lang);
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.tr;

    document.documentElement.lang = lang;

    // data-i18n → textContent
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    // data-i18n-html → innerHTML (sözlükteki <em> gibi işaretlemeler için)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key]) el.innerHTML = dict[key];
    });

    // Yasal sayfalarda TR/EN içerik blokları
    document.querySelectorAll("[data-lang-content]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang-content") !== lang;
    });

    // Title + meta description + OG
    var page = document.body.getAttribute("data-page") || "index";
    var meta = dict.pages[page];
    if (meta) {
      document.title = meta.title;
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", meta.desc);
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", meta.title);
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", meta.desc);
    }

    // Anahtar durumunu güncelle
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  // ---------- Giriş animasyonları (fade-in-up) ----------
  function initReveals() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = document.querySelectorAll(".reveal");

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  }

  // ---------- Başlat ----------
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    initReveals();
  });
})();
