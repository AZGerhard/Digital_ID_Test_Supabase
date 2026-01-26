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
    const { data, error } = await supabase.from("product").select("serien_nr");

    if (error) return console.error(error);

    const list = document.getElementById("product-list");
    data.forEach(p => {
        list.innerHTML += `<li><a href="artikel.html?key=${p.serien_nr}">${p.serien_nr}</a></li>`;
    });
}

// Key aus URL
function getKey() {
    return new URLSearchParams(window.location.search).get("key");
}

// Produktdetails
async function loadProductDetail() {
    const key = getKey();
    if (!key) return;

    const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("serien_nr", key)
        .single();

    if (error || !data) {
        document.body.innerHTML = "<h2>Produkt nicht gefunden</h2>";
        return;
    }

    // Bild
    document.getElementById("produktbild").src = data.bild_url;

    // Titel
    document.getElementById("typ_title").innerText = data.typ;
    document.getElementById("bezeichnung_title").innerText = data.bezeichnung;
    // Tabelle

    document.getElementById("serien_nr").innerText = data.serien_nr;
    document.getElementById("auftrags_nr").innerText = data.auftrags_nr;
    document.getElementById("produktionstermin").innerText = data.produktionstermin;
    document.getElementById("artikel_nr").innerText = data.artikel_nr;
    document.getElementById("typ").innerText = data.typ;
    document.getElementById("bezeichnung").innerText = data.bezeichnung;
    document.getElementById("abdichtung").innerText = data.abdichtung;
    document.getElementById("anschlussart").innerText = data.anschlussart;
    document.getElementById("ausfuehrung").innerText = data.ausfuehrung;
    document.getElementById("nennweite").innerText = data.nennweite;
    document.getElementById("nenndruck").innerText = data.nenndruck;
    document.getElementById("baulaenge_mm").innerText = data.baulaenge_mm;
    document.getElementById("anschluss_norm").innerText = data.anschluss_norm;
    document.getElementById("gehaeuse").innerText = data.gehaeuse;
    document.getElementById("deckel").innerText = data.deckel;
    document.getElementById("kueken").innerText = data.kueken;
    document.getElementById("dichtbuchse").innerText = data.dichtbuchse;
    document.getElementById("flanschdurchmesser_mm").innerText = data.flanschdurchmesser_mm;
    document.getElementById("flanschstaerke_mm").innerText = data.flanschstaerke_mm;
    document.getElementById("kueken_wellenende").innerText = data.kueken_wellenende;
    document.getElementById("schrauben").innerText = data.schrauben;
    document.getElementById("kupplung_schluesselform").innerText = data.kupplung_schluesselform;
    document.getElementById("konsole_aufnahme").innerText = data.konsole_aufnahme;
    document.getElementById("gewicht_kg").innerText = data.gewicht_kg;

    // PDF
    const pdfs = [
        { id: "az-zertifikat-btn", url: data.az_zertifikat_url, label: "AZ Zertifikat" },
        { id: "betriebsanleitung-btn", url: data.betriebsanleitung_url, label: "Betriebsanleitung" },
        { id: "datenblatt-btn", url: data.datenblatt_url, label: "Datenblatt" },
    ];

    pdfs.forEach(pdf => {
        const btn = document.getElementById(pdf.id);
        if (!btn) return; // Button existiert nicht

        if (pdf.url) {
            btn.addEventListener("click", () => window.open(pdf.url, "_blank"));
            btn.disabled = false;
            btn.innerText = `PDF anzeigen: ${pdf.label}`;
        } else {
            btn.disabled = true;
            btn.innerText = `Keine ${pdf.label} verfügbar`;
        }
    });
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("accordion-header")) {
        const accordion = e.target.closest(".accordion");
        accordion.classList.toggle("open");
    }
});