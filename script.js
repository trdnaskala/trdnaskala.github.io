const vsebina = window.VSEBINA || {};
document.title = vsebina.naslovStrani || document.title;
document.getElementById('poslanstvo-besedilo').textContent = vsebina.poslanstvo || '';
for (const item of vsebina.glasba || []) {
  const row = document.createElement('article'); row.className = 'track';
  const number = document.createElement('span'); number.className = 'track-number';
  number.textContent = String(document.getElementById('glasba-seznam').children.length + 1).padStart(2, '0');
  const description = document.createElement('div');
  const title = document.createElement('h3'); title.textContent = item.naslov;
  const detail = document.createElement('p'); detail.textContent = [item.opis, item.avtor].filter(Boolean).join(' · ');
  description.append(title, detail); row.append(number, description);
  document.getElementById('glasba-seznam').append(row);
}
if (vsebina.email) {
  const email = document.getElementById('kontakt-email');
  email.href = 'mailto:' + vsebina.email; email.querySelector('strong').textContent = vsebina.email;
}
if (vsebina.telefon && vsebina.telefonPovezava) {
  const phone = document.getElementById('kontakt-telefon');
  phone.href = 'tel:' + vsebina.telefonPovezava; phone.querySelector('strong').textContent = vsebina.telefon;
}
for (const key of ['termin', 'opomba']) {
  if (vsebina[key]) document.getElementById(key).textContent = vsebina[key];
}
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
}));
const lightbox = document.getElementById('lightbox');
function showImage(src, caption) {
  lightbox.querySelector('img').src = src;
  lightbox.querySelector('img').alt = caption;
  lightbox.querySelector('p').textContent = caption;
  lightbox.showModal();
}
for (const item of vsebina.galerija || []) {
  const button = document.createElement('button');
  button.className = 'gallery-item';
  const img = document.createElement('img');
  img.src = item.slika; img.alt = item.opis; img.loading = 'lazy'; img.style.objectPosition=item.pozicija||'center center'; if(item.razmerje)img.style.aspectRatio=item.razmerje;
  const caption = document.createElement('span'); caption.textContent = item.opis + ' ↗'; if(item.barvaBesedila)caption.style.color=item.barvaBesedila;if(item.barvaOzadja)caption.style.backgroundColor=item.barvaOzadja;if(item.velikostPisave)caption.style.fontSize=item.velikostPisave+'px';
  button.append(img, caption); button.addEventListener('click', () => showImage(item.slika, item.opis));
  document.getElementById('galerija').append(button);
}
const video = document.getElementById('uvodni-video');
const videoButton = document.getElementById('video-preklop');
const videoSource=video.querySelector('source');if(videoSource&&/\.webm(\?|$)/i.test(videoSource.getAttribute('src')||'')){videoSource.type='video/webm';video.load();}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateVideoButton() {
  videoButton.textContent = video.paused ? (vsebina.oznake?.predvajaj || 'Predvajaj video ▷') : (vsebina.oznake?.zaustavi || 'Zaustavi video Ⅱ');
  videoButton.setAttribute('aria-pressed', String(video.paused));
}
video.muted = true;
if (reducedMotion.matches) { video.autoplay = false; video.pause(); }
video.addEventListener('play', updateVideoButton);
video.addEventListener('pause', updateVideoButton);
video.addEventListener('error', () => { videoButton.hidden = true; });
videoButton.addEventListener('click', () => {
  if (video.paused) video.play().catch(updateVideoButton); else video.pause();
});
reducedMotion.addEventListener('change', e => { if (e.matches) video.pause(); });
updateVideoButton();
lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

// Dogodki se urejajo v Windows urejevalniku, brez poseganja v HTML.
const oznake=vsebina.oznake||{};
const danes=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Ljubljana'});
const formatDogodek=iso=>iso?new Intl.DateTimeFormat('sl-SI',{day:'numeric',month:'long',year:'numeric'}).format(new Date(iso+'T12:00:00')):'';
const eventList=document.getElementById('dogodki-seznam');
let prikaziPretekle=false;
function eventNode(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function externalEventLink(url,label){const a=eventNode('a',label,'text-link');a.href=url;if(/^https?:/i.test(url)){a.target='_blank';a.rel='noopener noreferrer';}return a;}
function renderEvents(){
 eventList.replaceChildren();
 const events=(vsebina.dogodki||[]).filter(e=>e.aktiven!==false&&Boolean((e.konec||e.zacetek)&&((e.konec||e.zacetek)<danes))===prikaziPretekle);
 if(!events.length)eventList.append(eventNode('p',oznake.brezDogodkov));
 for(const event of events){const card=eventNode('article',undefined,'event-card');if(event.barvaBesedila)card.style.color=event.barvaBesedila;if(event.barvaOzadja)card.style.backgroundColor=event.barvaOzadja;if(event.velikostPisave)card.style.fontSize=event.velikostPisave+'px';
 if(event.slika){const img=eventNode('img');img.src=event.slika;img.alt=event.naslov;img.loading='lazy';card.append(img);}
 card.append(eventNode('p',event.vrsta,'eyebrow'),eventNode('h3',event.naslov));
 let dates=event.zacetek?formatDogodek(event.zacetek):oznake.brezDatum;
 if(event.konec&&event.konec!==event.zacetek)dates+=' – '+formatDogodek(event.konec);
 card.append(eventNode('p',dates+(event.ura?' · '+event.ura:''),'event-date'));
 if(event.lokacija)card.append(eventNode('p',event.lokacija,'event-location'));
 if(event.opis)card.append(eventNode('p',event.opis,'event-description'));
 if(event.video){if(/\.(mp4|webm)(\?|$)/i.test(event.video)){const clip=eventNode('video');clip.src=event.video;clip.controls=true;clip.preload='none';clip.playsInline=true;if(event.slika)clip.poster=event.slika;card.append(clip);}else card.append(externalEventLink(event.video,oznake.napovednik));}
 if(event.povezava)card.append(externalEventLink(event.povezava,event.gumb||oznake.vec));applyItemStyle(card,event);eventList.append(card);}
 document.getElementById('prihajajoci').setAttribute('aria-pressed',String(!prikaziPretekle));document.getElementById('pretekli').setAttribute('aria-pressed',String(prikaziPretekle));
}
document.getElementById('prihajajoci').textContent=oznake.prihajajoci;
document.getElementById('pretekli').textContent=oznake.pretekli;
document.getElementById('prihajajoci').addEventListener('click',()=>{prikaziPretekle=false;renderEvents();});
document.getElementById('pretekli').addEventListener('click',()=>{prikaziPretekle=true;renderEvents();});renderEvents();
// Pri avdio posnetkih je mogoče dodati datoteko ali zunanjo povezavo.
document.querySelectorAll('#glasba-seznam .track').forEach((row,i)=>{const link=vsebina.glasba[i]?.povezava;if(!link)return;if(/\.(mp3|m4a|ogg|wav)(\?|$)/i.test(link)){const player=document.createElement('audio');player.controls=true;player.preload='none';player.src=link;row.append(player);}else row.append(externalEventLink(link,oznake.poslusaj));});

document.querySelectorAll("#glasba-seznam .track").forEach((row,i)=>{const item=vsebina.glasba[i];if(item.barvaBesedila)row.style.color=item.barvaBesedila;if(item.barvaOzadja)row.style.backgroundColor=item.barvaOzadja;if(item.velikostPisave)row.style.fontSize=item.velikostPisave+"px";});

function applyItemStyle(node,item){if(item.barvaBesedila)node.querySelectorAll("h3,p,span,a").forEach(el=>el.style.color=item.barvaBesedila);if(item.barvaOzadja)node.style.backgroundColor=item.barvaOzadja;if(item.velikostPisave)node.querySelectorAll("h3,p,span,a").forEach(el=>el.style.fontSize=item.velikostPisave+"px");}
document.querySelectorAll("#glasba-seznam .track").forEach((row,i)=>applyItemStyle(row,vsebina.glasba[i]));
