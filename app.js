//import { createClient } from '@supabase/supabase-js'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.35.0/dist/module/supabase.js'


const SUPABASE_URL = 'https://xvcripzxljsaidaekjza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2Y3JpcHp4bGpzYWlkYWVranphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg2NDAsImV4cCI6MjA4MDIzNDY0MH0.3g9SfTLdG1tgLrEYrTv9YLO3cgS0zs8IFuO0nDb8gI8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Prüfen, auf welcher Seite wir sind
const path = window.location.pathname.split('/').pop()
if(path === '' || path === 'index.html') {
    loadProductList()
} else if(path === 'artikel.html' || path === 'produkt.html') {
    loadProductDetail()
}

// --- Funktionen ---
async function loadProductList(){
    const { data, error } = await supabase.from('products').select('key, typ')
    if(error){ console.error(error); return }
    const listEl = document.getElementById('product-list')
    data.forEach(p => {
        const li = document.createElement('li')
        li.innerHTML = `<a href="artikel.html?key=${p.key}">${p.typ}</a>`
        listEl.appendChild(li)
    })
}

function getKeyFromUrl(){
    return new URLSearchParams(window.location.search).get('key')
}

async function loadProductDetail(){
    const key = getKeyFromUrl()
    if(!key) return

    const { data, error } = await supabase.from('products').select('*').eq('key', key).single()
    if(error || !data){ 
        document.body.innerHTML = "<h2>Produkt nicht gefunden</h2>"; 
        return 
    }

    document.getElementById("produktbild").src = data.bild_url
    document.getElementById("typ").innerText = data.typ
    document.getElementById("abdichtung").innerText = data.abdichtung
    document.getElementById("anschluss").innerText = data.anschluss
    document.getElementById("dichtleiste").innerText = data.dichtleiste
    document.getElementById("nennweite").innerText = data.nennweite
    document.getElementById("nenndruck").innerText = data.nenndruck
    document.getElementById("baulaenge").innerText = data.baulaenge
    document.getElementById("gehaeuse").innerText = data.gehaeuse
    document.getElementById("kueken").innerText = data.kueken
    document.getElementById("deckel").innerText = data.dekel
    document.getElementById("dichtbuchse").innerText = data.dichtbuchse
    document.getElementById("schrauben").innerText = data.schrauben
    document.getElementById("pdf-link").href = data.pdf_url

    // PDF Toggle
    const toggleBtn = document.getElementById("toggle-pdf")
    const container = document.getElementById("pdf-container")
    const iframe = document.getElementById("pdf-frame")
    toggleBtn.addEventListener('click', ()=>{
        if(container.style.display === 'block'){
            container.style.display = 'none'
            iframe.src = ""
        } else {
            container.style.display = 'block'
            iframe.src = data.pdf_url
        }
    })
}
