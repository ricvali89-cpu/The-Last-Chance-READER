const KEY="tlc-bookmark-v2";
const roman=n=>({1:"I",2:"II",3:"III",4:"IV"}[n]||n);
fetch("chapters/index.json").then(r=>r.json()).then(data=>{
  const list=document.querySelector("#chapter-list");
  for(const c of data.chapters){
    const published=c.status==="published";
    const el=document.createElement(published?"a":"div");
    el.className="chapter"+(published?"":" locked");
    if(published) el.href=c.href;
    const state=published?"LEGGI":(c.status==="in_production"?"IN PRODUZIONE":"PROSSIMAMENTE");
    el.innerHTML=`<span>CAPITOLO ${roman(c.number)}</span><span>${c.title||"Titolo non ancora pubblicato"}</span><span class="chapter-state">${state}</span>`;
    list.appendChild(el);
  }
}).catch(()=>{});
const bookmark=localStorage.getItem(KEY);
const resume=document.querySelector("#resume");
if(bookmark&&resume){resume.hidden=false;}
