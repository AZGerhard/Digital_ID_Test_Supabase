import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.35.0/dist/module/supabase.js'

// Supabase Config
const SUPABASE_URL = 'https://xvcripzxljsaidaekjza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2Y3JpcHp4bGpzYWlkYWVranphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg2NDAsImV4cCI6MjA4MDIzNDY0MH0.3g9SfTLdG1tgLrEYrTv9YLO3cgS0zs8IFuO0nDb8gI8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Prüfen, auf welcher Seite wir sind
const path = window.location.pathname
if(path.includes('index.html') || path === '/'){
    loadProductList()
} else if(path.includes('produkt.html')){
    loadProductDetail()
}

// --- Funktionen ---
async function loadProductList(){
    const { data, error } = await supabase.from('products').select('key, typ')
    if(error){ console.error(error); return }
    const listEl = document.getElementById('product-list')
    data.forEach(p => {
        const li = document.createElement('li')
        li.innerHTML = `<a href="produkt.html?key=${p.key}">${p.typ}</a>`
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
    document.getElementById("pdf-link").href = data.pdf_url

    document.getElementById("toggle-pdf").addEventListener('click', ()=>{
        const c = document.getElementById('pdf-container')
        c.style.display = c.style.display === 'block' ? 'none' : 'block'
    })
}
