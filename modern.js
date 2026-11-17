'use strict';
const data=window.VSEBINA||{};
const today=new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Ljubljana'});
const format=(iso,options)=>new Intl.DateTimeFormat('sl-SI',options).format(new Date(iso+'T12:00:00'));
const next=(data.srecanja||[]).find(date=>date>=today);
document.querySelectorAll('[data-meeting-time]').forEach(el=>el.textContent=data.ura);
document.querySelectorAll('[data-location]').forEach(el=>el.textContent=data.lokacija);
document.querySelectorAll('[data-city]').forEach(el=>el.textContent=data.kraj);
document.querySelectorAll('[data-map]').forEach(el=>el.href=data.zemljevid);
document.querySelectorAll('[data-email]').forEach(el=>{el.href='mailto:'+data.email;el.textContent=data.email+' ↗';});
document.querySelectorAll('[data-phone]').forEach(el=>{el.href='tel:'+data.telefonPovezava;el.textContent=data.telefon+' ↗';});
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
if(document.getElementById('next-day')){
 if(next){document.getElementById('next-day').textContent=format(next,{day:'numeric'}).replace('.','');document.getElementById('next-month').textContent=format(next,{month:'long',year:'numeric'});}
 else document.querySelector('.meeting-date').textContent='Naslednji datum objavimo kmalu.';
 const list=document.getElementById('datumi');
 for(const iso of data.srecanja||[]){const item=document.createElement('article');item.className='date-tile'+(iso===next?' is-next':'')+(iso<today?' is-past':'');const day=document.createElement('strong');day.textContent=format(iso,{day:'numeric'}).replace('.','');const month=document.createElement('span');month.textContent=format(iso,{month:'long',year:'numeric'});const time=document.createElement('small');time.textContent='petek · '+data.ura;item.append(day,month,time);if(iso===next)item.setAttribute('aria-label','Naslednje srečanje: '+format(iso,{dateStyle:'long'})+' ob '+data.ura);list.append(item);}
 const men=data.moskaSkupina;
 if(men&&men.datum>=today)document.getElementById('mens-date').textContent=format(men.datum,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · '+men.ura;else document.getElementById('moska-skupina').hidden=true;
}
const archive=document.getElementById('napovedniki');
if(archive)for(const event of data.napovedniki||[]){const card=document.createElement('article');card.className='archive-card';const year=document.createElement('span');year.className='archive-year';year.textContent=event.leto;const play=document.createElement('span');play.className='play-icon';play.textContent='▷';play.setAttribute('aria-hidden','true');const title=document.createElement('h3');title.textContent=event.naslov+(event.misel?' · '+event.misel:'');const date=document.createElement('p');date.className='archive-date';date.textContent=event.datum+' · '+event.kraj;const description=document.createElement('p');description.textContent=event.opis;const link=document.createElement('a');link.href=event.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Poglej napovednik '+event.leto+' ↗';card.append(year,play,title,date,description,link);archive.append(card);}
if(document.getElementById('crik-status')&&data.crikvenica?.konec<today)document.getElementById('crik-status').textContent='Dogodek je že potekal. Za informacije o naslednji izvedbi stopi v stik z nami.';
const mission=document.getElementById('poslanstvo-besedilo');if(mission)mission.textContent=data.poslanstvo||'';
const tracks=document.getElementById('glasba-seznam');
if(tracks)for(const [i,item] of (data.glasba||[]).entries()){const row=document.createElement('article');row.className='track';const no=document.createElement('span');no.className='track-number';no.textContent=String(i+1).padStart(2,'0');const desc=document.createElement('div');const title=document.createElement('h3');title.textContent=item.naslov;const detail=document.createElement('p');detail.textContent=[item.opis,item.avtor].filter(Boolean).join(' · ');desc.append(title,detail);row.append(no,desc);tracks.append(row);}
const video=document.getElementById('uvodni-video'),videoButton=document.getElementById('video-preklop');
if(video&&videoButton){const reduced=matchMedia('(prefers-reduced-motion: reduce)');function update(){videoButton.textContent=video.paused?'Predvajaj video ▷':'Zaustavi video Ⅱ';}video.muted=true;if(reduced.matches){video.autoplay=false;video.pause();}video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('error',()=>videoButton.hidden=true);videoButton.addEventListener('click',()=>{if(video.paused)video.play().catch(update);else video.pause();});reduced.addEventListener('change',e=>{if(e.matches)video.pause();});update();}
