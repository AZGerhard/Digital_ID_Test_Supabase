import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// Supabase
const SUPABASE_URL = "https://xvcripzxljsaidaekjza.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2Y3JpcHp4bGpzYWlkYWVranphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg2NDAsImV4cCI6MjA4MDIzNDY0MH0.3g9SfTLdG1tgLrEYrTv9YLO3cgS0zs8IFuO0nDb8gI8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Router
const path = window.location.pathname;

if (path.includes("index") || path === "/" || path.endsWith(".github.io/")) {
    loadProductList();
} else if (path.includes("artikel.html")) {
    loadProductDetail();
}

// Produktliste 
async function loadProductList() {
    const { data, error } = await supabase.from("product_v2").select("public_key");

    if (error) return console.error(error);

    const list = document.getElementById("product-list");
    data.forEach(p => {
        list.innerHTML += `<li><a href="artikel.html?key=${p.public_key}">${p.public_key}</a></li>`;
    });
}

// Key aus URL
function getKey() {
    return new URLSearchParams(window.location.search).get("key");
}

// Seriennummer formatieren
function formatSerial(serial) {
    if (!serial) return serial;
    serial = String(serial);
    const digits = serial.replace(/\D/g, '');
    if (digits.length < 12) return serial;
    return `${digits.slice(0,2)}/${digits.slice(2,8)}/${digits.slice(8,11)}/${digits.slice(11,12)}`;
}

// Icon je Typ
const iconMap = {
    pdf:     "📄",
    youtube: "▶️",
    zip:     "📦",
};

// Anhänge dynamisch rendern
function renderAnhaenge(liste, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Container leeren falls schon was drin ist
    container.innerHTML = "";

    if (!liste || liste.length === 0) {
        container.innerHTML = `<p class="no-docs">No documents available</p>`;
        return;
    }

    liste.forEach(doc => {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        const icon = iconMap[doc.type] || "📎";

        if (doc.type === "youtube") {
            btn.innerText = `${icon} Show Instruction Video`;
        } else if (doc.type === "zip") {
            btn.innerText = `${icon} Document Container: ${doc.label}`;
        } else {
            btn.innerText = `${icon} Show PDF: ${doc.label}`;
        }

        btn.addEventListener("click", () => window.open(doc.url, "_blank"));
        container.appendChild(btn);
    });
}

// Produktdetails
async function loadProductDetail() {
    const key = getKey();
    if (!key) return;

    const { data, error } = await supabase
        .from("product_v2")
        .select("*")
        .eq("public_key", key)
        .single();

    if (error || !data) {
        document.body.innerHTML = `
            <header class="header">
                <img src="images/AZ_Logo.png" alt="Firmenlogo" class="logo">
                <h1>Digital Product Passport</h1>
                <a href="index.html" class="back-link">← Zurück</a>
            </header>
            <main>
                <div class="error-container">
                    <div class="error-card">
                        <div class="error-icon">⚠️</div>
                        <h2>Produkt nicht gefunden</h2>
                        <p>Die gesuchte Seriennummer existiert nicht in unserer Datenbank.</p>
                        <a href="index.html" class="btn error-btn">Zurück zur Produktliste</a>
                    </div>
                </div>
            </main>
        `;
        return;
    }

    // Typ Mapping
    const typMapped = {
        "F-2 ISO":  "Durchgangs-Kükenhahn",
        "F-2 ANSI": "Durchgangs-Kükenhahn"
    };

    // Bild
    document.getElementById("produktbild").src = data.bild_url;

    // Titel
    document.getElementById("typ_mapping").innerText = typMapped[data.typ] || data.typ;
    document.getElementById("bezeichnung_title").innerText = data.bezeichnung;

    // Seriennummer
    document.getElementById("serien_nr").innerText = formatSerial(data.serien_nr);

    // Ersatzlink dynamisch setzen
    const ersatzLink = document.getElementById("dpp-ersatz-link");
    if (ersatzLink) {
        const serialFromURL = new URLSearchParams(window.location.search).get("key") || data.serien_nr;
        ersatzLink.href = `https://az-armaturen-shop.com/product/ersatzdichtungen/?serial=${encodeURIComponent(formatSerial(data.serien_nr))}`;
    }

    // Tabelle
    document.getElementById("auftrags_nr").innerText           = data.auftrags_nr;
    // document.getElementById("produktionstermin").innerText     = data.produktionstermin;
    document.getElementById("produktionstermin").innerText = 
    new Date(data.produktionstermin).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    document.getElementById("artikel_nr").innerText            = data.artikel_nr;
    document.getElementById("typ").innerText                   = data.typ;
    document.getElementById("bezeichnung").innerText           = data.bezeichnung;
    document.getElementById("abdichtung").innerText            = data.abdichtung;
    document.getElementById("anschlussart").innerText          = data.anschlussart;
    document.getElementById("ausfuehrung").innerText           = data.ausfuehrung;
    document.getElementById("nennweite").innerText             = data.nennweite;
    document.getElementById("nenndruck").innerText             = data.nenndruck;
    document.getElementById("baulaenge_mm").innerText          = data.baulaenge_mm;
    document.getElementById("anschluss_norm").innerText        = data.anschluss_norm;
    document.getElementById("gehaeuse").innerText              = data.gehaeuse;
    document.getElementById("deckel").innerText                = data.deckel;
    document.getElementById("kueken").innerText                = data.kueken;

    // Auskleidung dynamisch – nur anzeigen wenn Wert vorhanden
    const tabelle = document.getElementById("technische-tabelle");
    
    if (data.auskleidung_kueken || data.auskleidung_gehaeuse) {
        // Dichtbuchse-Zeile verstecken
        document.getElementById("dichtbuchse").closest("tr").style.display = "none";
    }

    if (data.auskleidung_kueken) {
        tabelle.innerHTML += `<tr><th>Auskleidung Kueken</th><td>${data.auskleidung_kueken}</td></tr>`;
    }
    if (data.auskleidung_gehaeuse) {
        tabelle.innerHTML += `<tr><th>Auskleidung Gehaeuse</th><td>${data.auskleidung_gehaeuse}</td></tr>`;
    }

    document.getElementById("dichtbuchse").innerText           = data.dichtbuchse;
    document.getElementById("flanschdurchmesser_mm").innerText = data.flanschdurchmesser_mm;
    document.getElementById("flanschstaerke_mm").innerText     = data.flanschstaerke_mm;
    document.getElementById("kueken_wellenende").innerText     = data.kueken_wellenende;
    document.getElementById("schrauben").innerText             = data.schrauben;
    document.getElementById("kupplung_schluesselform").innerText = data.kupplung_schluesselform;
    document.getElementById("konsole_aufnahme").innerText      = data.konsole_aufnahme;
    document.getElementById("gewicht_kg").innerText            = data.gewicht_kg;
    
    // Anhänge dynamisch rendern
    renderAnhaenge(data.anhaenge,     "anhaenge-container");
    renderAnhaenge(data.vdi_anhaenge, "vdi-container");
}

// Accordion
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("accordion-header") || e.target.closest(".accordion-header")) {
        const accordion = e.target.closest(".accordion");
        accordion.classList.toggle("open");
    }
});

// Link kopieren
const copyBtn = document.getElementById("copy-link-btn");
if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        copyBtn.innerText = "✅ Kopiert!";
        setTimeout(() => copyBtn.innerText = "🔗 Link kopieren", 2000);
    });
}

// Per Mail teilen
const mailBtn = document.getElementById("share-mail-btn");
if (mailBtn) {
    mailBtn.addEventListener("click", () => {
        const url = window.location.href;
        const subject = encodeURIComponent("Digitaler Produktpass");
        const body = encodeURIComponent(`Hier ist der Link zum Digitalen Produktpass:\n\n${url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
}