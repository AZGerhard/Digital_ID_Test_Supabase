import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.35.0/+esm";

// Supabase
const SUPABASE_URL = "https://xvcripzxljsaidaekjza.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

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
    const { data, error } = await supabase.from("products").select("key, typ");

    if (error) return console.error(error);

    const list = document.getElementById("product-list");
    data.forEach(p => {
        list.innerHTML += `<li><a href="artikel.html?key=${p.key}">${p.typ}</a></li>`;
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
        .from("products")
        .select("*")
        .eq("key", key)
        .single();

    if (error || !data) {
        document.body.innerHTML = "<h2>Produkt nicht gefunden</h2>";
        return;
    }

    // Bild
    document.getElementById("produktbild").src = data.bild_url;

    // Titel
    document.getElementById("typ").innerText = data.typ;

    // Tabelle
    document.getElementById("typ2").innerText = data.typ;
    document.getElementById("abdichtung").innerText = data.abdichtung;
    document.getElementById("anschluss").innerText = data.anschluss;
    document.getElementById("dichtleiste").innerText = data.dichtleiste;
    document.getElementById("nennweite").innerText = data.nennweite;
    document.getElementById("nenndruck").innerText = data.nenndruck;
    document.getElementById("baulaenge").innerText = data.baulaenge;
    document.getElementById("gehaeuse").innerText = data.gehaeuse;
    document.getElementById("kueken").innerText = data.kueken;
    document.getElementById("deckel").innerText = data.deckel;
    document.getElementById("dichtbuchse").innerText = data.dichtbuchse;
    document.getElementById("schrauben").innerText = data.schrauben;

    // PDF
    document.getElementById("pdf-frame").src = data.pdf_url;
    document.getElementById("pdf-link").href = data.pdf_url;

    document.getElementById("toggle-pdf").onclick = () => {
        const c = document.getElementById("pdf-container");
        c.style.display = c.style.display === "block" ? "none" : "block";
    };
}
