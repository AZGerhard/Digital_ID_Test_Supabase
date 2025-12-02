const SUPABASE_URL = 'https://xvcripzxljsaidaekjza.supabase.co';
const SUPABASE_ANON_KEY = 'DEIN_ANON_KEY_HIER';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getKeyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("key");
}

async function loadProduct() {
  const key = getKeyFromUrl();
  if(!key) return;

  const { data, error } = await supabaseClient
    .from('products_test')
    .select('*')
    .eq('key', key)
    .single();

  if(error || !data){
    document.body.innerHTML = "<h2>Produkt nicht gefunden</h2>";
    return;
  }

  document.getElementById("produktbild").src = data.bild_url;
  document.getElementById("typ").innerText = data.typ;
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

  document.getElementById("pdf-link").href = data.pdf_url;
}

function togglePdf(){
  const container = document.getElementById("pdf-container");
  container.style.display = container.style.display === 'block' ? 'none' : 'block';
}

// sicherstellen, dass DOM geladen ist
document.addEventListener('DOMContentLoaded', loadProduct);
