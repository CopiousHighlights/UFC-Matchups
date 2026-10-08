'use strict';
const $=id=>document.getElementById(id), KEY='ufc-matchups:allen-duncan-2026:picks:v1', SETTINGS='ufc-matchups:recording:v1';
let event, index=0, metric=false, picks={}, settings={recording:false,corner:'bottom-right',size:'medium',guide:true,notes:true}, returnFocus;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const missing='Not available', validImage=url=>{try{return ['https:','http:'].includes(new URL(url).protocol)}catch{return false}};
const countryNames={US:'United States',GB:'United Kingdom',BR:'Brazil',MX:'Mexico',GE:'Georgia',AR:'Argentina',AM:'Armenia',RU:'Russia',LT:'Lithuania'};
const silhouette='<svg class="silhouette" viewBox="0 0 220 300" aria-hidden="true"><circle cx="110" cy="65" r="42" fill="#8a909b"/><path d="M20 300V210C20 135 55 117 110 117s90 18 90 93v90Z" fill="#8a909b"/></svg>';
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
picks=read(KEY,{});if(!picks||typeof picks!=='object'||Array.isArray(picks))picks={};settings={...settings,...read(SETTINGS,{})};
function save(){try{localStorage.setItem(KEY,JSON.stringify(picks));$('save-status').textContent='Picks saved on this browser'}catch{$('save-status').textContent='Storage unavailable — download your picks'}}
function applySettings(){
 if(!['small','medium','large'].includes(settings.size))settings.size='medium';
 if(!['bottom-right','bottom-left','top-right','top-left'].includes(settings.corner))settings.corner='bottom-right';
 const [w,h]={small:[320,240],medium:[380,300],large:[480,360]}[settings.size];
 document.documentElement.style.setProperty('--cam-w',w+'px');document.documentElement.style.setProperty('--cam-h',h+'px');
 document.body.classList.toggle('recording',!!settings.recording);document.body.classList.toggle('cam-top',settings.corner.startsWith('top'));document.body.classList.toggle('cam-left',settings.corner.endsWith('left'));document.body.classList.toggle('guide-hidden',!settings.guide);document.body.classList.toggle('notes-hidden',!settings.notes);
 $('facecam').hidden=!settings.recording;$('recording').setAttribute('aria-pressed',!!settings.recording);$('corner').value=settings.corner;$('cam-size').value=settings.size;$('guide').checked=settings.guide;$('show-notes').checked=settings.notes;$('cam-dimensions').textContent=`${w} × ${h} · OBS OVERLAY`;
 try{localStorage.setItem(SETTINGS,JSON.stringify(settings))}catch{}
}
function validate(data){
 if(!data||!Array.isArray(data.bouts)||!data.bouts.length||!data.fighters||typeof data.fighters!=='object'||!data.refreshedAt||isNaN(Date.parse(data.refreshedAt)))throw Error('Invalid event snapshot: bouts, fighter IDs, and refresh timestamp are required.');
 const seen=new Set();for(const b of data.bouts){if(typeof b.id!=='string'||seen.has(b.id)||!['Main Card','Prelims'].includes(b.group)||!Array.isArray(b.fighters)||b.fighters.length!==2||b.fighters[0]===b.fighters[1]||b.fighters.some(id=>!data.fighters[id]||data.fighters[id].id!==id))throw Error('Invalid bout pairing or source ID.');seen.add(b.id)}
 return data;
}
function value(v,suffix=''){return v==null||v===''?missing:escape(v)+suffix}
function length(v,reach=false){if(v==null)return missing;if(metric)return `${(v*2.54).toFixed(1)} cm`;return reach?`${v} in`:`${Math.floor(v/12)}′ ${+(v%12).toFixed(1)}″`}
function weight(v){return v==null?missing:metric?`${(v*.45359237).toFixed(1)} kg`:`${v} lb`}
function bout(){return event.bouts[index]}
function currentPick(){const p=picks[bout().id];return p&&typeof p==='object'?p:{}}
function renderCard(){
 $('card').innerHTML=['Main Card','Prelims'].map(group=>`<h3 class="group-heading">${group.toUpperCase()}</h3>${event.bouts.map((b,i)=>b.group===group?`<button class="fight-button ${index===i?'active':''}" data-index="${i}" ${index===i?'aria-current="true"':''}><strong>${escape(event.fighters[b.fighters[0]].name)}<br><span style="color:var(--muted);font-weight:400">vs</span> ${escape(event.fighters[b.fighters[1]].name)}</strong><small>${escape(b.weightClass)}${b.mainEvent?' · MAIN EVENT':''}</small>${picks[b.id]?.winner?'<span class="picked" aria-label="Pick saved">✓</span>':''}</button>`:'').join('')}`).join('');
 $('pick-count').textContent=`${event.bouts.filter(b=>picks[b.id]?.winner).length}/${event.bouts.length}`;
 document.querySelector('.card-heading span').textContent=event.bouts.length+' BOUTS';
}
function fighterHtml(f,i){return `<article class="fighter ${i?'blue':'red'}" data-fighter-id="${escape(f.id)}"><span class="corner-tag">${i?'BLUE':'RED'} CORNER</span>${silhouette}${validImage(f.image)?`<img class="portrait" src="${escape(f.image)}" alt="${escape(f.name)}" referrerpolicy="no-referrer">`:''}<div class="fighter-info"><p class="nickname">${f.nickname?'“'+escape(f.nickname)+'”':'Nickname: '+missing}</p><h3 class="fighter-name">${escape(f.name)}</h3><div class="record">${/^[A-Z]{2}$/.test(f.country)?`<img class="flag" src="https://flagcdn.com/w40/${f.country.toLowerCase()}.png" alt="${escape(countryNames[f.country]||f.country)}">`:''}<span>${value(f.record)}</span><small>PRO RECORD</small></div><small class="photo-note">Photo not available</small></div></article>`}
function render(){
 const b=bout(),[a,z]=b.fighters.map(id=>event.fighters[id]);
 $('bout-label').textContent=b.mainEvent?'MAIN EVENT · HEADLINER':b.group.toUpperCase();$('division').textContent=b.weightClass||missing;$('bout-position').textContent=`BOUT ${index+1} / ${event.bouts.length}`;$('previous').disabled=index===0;$('next').disabled=index===event.bouts.length-1;
 $('comparison').innerHTML=fighterHtml(a,0)+`<div class="vs-block"><div class="vs">VS</div><small>${b.mainEvent?'THE MAIN EVENT':escape(b.group.toUpperCase())}</small><a href="${escape(a.source)}" target="_blank" rel="noopener">Red profile ↗</a><a href="${escape(z.source)}" target="_blank" rel="noopener">Blue profile ↗</a></div>`+fighterHtml(z,1);
 document.querySelectorAll('.fighter').forEach(el=>{const img=el.querySelector('.portrait');if(!img)el.classList.add('missing-photo');else{const failed=()=>el.classList.add('missing-photo');img.addEventListener('error',failed);if(img.complete&&!img.naturalWidth)failed()}});
 const rows=[['Age',value(a.age,' years'),value(z.age,' years')],['Height',length(a.height),length(z.height),'height'],['Reach',length(a.reach,true),length(z.reach,true),'reach'],['Listed weight',weight(a.weight),weight(z.weight)],['Stance',value(a.stance),value(z.stance)]];
 $('tape-rows').innerHTML=rows.map(([label,av,zv,k])=>{let diff='';if(k&&a[k]!=null&&z[k]!=null){const delta=Math.abs(a[k]-z[k]);diff=delta?`${metric?(delta*2.54).toFixed(1)+' cm':+delta.toFixed(1)+' in'} difference`:'Equal dimensions'}return `<div class="tape-row"><span class="value red-value ${k&&a[k]>z[k]&&z[k]!=null?'dimension':''}">${av}</span><span class="label">${label}${diff?`<small class="difference">${diff}</small>`:''}</span><span class="value blue-value ${k&&z[k]>a[k]&&a[k]!=null?'dimension':''}">${zv}</span></div>`}).join('');
 $('winner').innerHTML='<option value="">Choose a fighter</option>'+[a,z].map(f=>`<option value="${escape(f.id)}">${escape(f.name)}</option>`).join('');
 const p=currentPick();['winner','method','round','confidence','notes'].forEach(k=>$(k).value=p[k]||'');updateRound();$('pick-status').textContent=p.winner?'Saved locally':'No prediction yet';
 $('performance').innerHTML=[a,z].map(f=>`<section class="stats-person"><h3>${escape(f.name)}</h3><div class="stat-grid">${[['Finish rate',f.finishRate],['Striking accuracy',f.strikeAccuracy],['Takedown accuracy',f.takedownAccuracy]].map(([label,v])=>`<div class="stat"><b>${value(v,v==null?'':'%')}</b><small>${label}</small></div>`).join('')}</div><h4>Recent completed fights</h4><ul class="recent">${f.recent?.length?f.recent.map(r=>`<li><b class="${r.result==='LOSS'?'loss':''}">${escape(r.result)}</b>${escape(r.matchup)}<small>${escape(r.date)} · ${escape(r.method)} · R${escape(r.round)} ${escape(r.time)}</small></li>`).join(''):`<li>${missing}</li>`}</ul><a href="${escape(f.source)}" target="_blank" rel="noopener" style="font-size:11px">View source profile ↗</a></section>`).join('');
 renderCard();
}
function updateRound(){const disabled=!$('method').value||$('method').value==='Decision';$('round').disabled=disabled;if(disabled)$('round').value=''}
function navigate(i){if(!event||i<0||i>=event.bouts.length)return;index=i;render();$('main').scrollIntoView({block:'start',behavior:'instant'});if(settings.recording)$('safe-stage').scrollTop=0}
function updatePick(){updateRound();const p={};['winner','method','round','confidence','notes'].forEach(k=>p[k]=$(k).value);if(p.winner&&!bout().fighters.includes(p.winner))p.winner='';picks[bout().id]=p;save();renderCard();$('pick-status').textContent=p.winner?'Saved locally':'No winner selected'}
function load(data){event=validate(data);index=0;for(const b of event.bouts){if(picks[b.id]?.winner&&!b.fighters.includes(picks[b.id].winner))delete picks[b.id]}
 $('event-meta').textContent=`${event.date||missing} · ${event.venue||missing} · ${event.bouts.length} bouts`;$('source-link').href=event.source;$('refresh').textContent='Last successful source refresh: '+new Date(event.refreshedAt).toLocaleString();$('load-error').hidden=true;document.body.classList.remove('load-failed');render();
}
function summary(){return event.bouts.map(b=>{const p=picks[b.id]||{};return {boutId:b.id,matchup:b.fighters.map(id=>event.fighters[id].name).join(' vs '),winner:p.winner?event.fighters[p.winner]?.name||'':'',method:p.method||'',round:p.round||'',confidence:p.confidence||'',notes:p.notes||''}})}
function openPicks(){if(!event)return;returnFocus=document.activeElement;$('picks-list').innerHTML=summary().map(p=>`<div class="summary-pick"><div>${escape(p.matchup)}</div><div><b>${escape(p.winner||'No pick yet')}</b><small>${escape([p.method,p.round?'Round '+p.round:'',p.confidence?p.confidence+' confidence':''].filter(Boolean).join(' · '))}</small></div>${p.notes?`<p class="notes-summary">${escape(p.notes)}</p>`:''}</div>`).join('');$('picks-panel').hidden=false;$('picks-close').focus()}
function closePicks(){$('picks-panel').hidden=true;returnFocus?.focus()}
function download(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('card').addEventListener('click',e=>{const btn=e.target.closest('[data-index]');if(btn)navigate(Number(btn.dataset.index))});$('previous').onclick=()=>navigate(index-1);$('next').onclick=()=>navigate(index+1);
$('prediction-form').onsubmit=e=>e.preventDefault();$('prediction-form').addEventListener('input',updatePick);$('prediction-form').addEventListener('change',updatePick);
$('clear-pick').onclick=()=>{delete picks[bout().id];save();render()};$('units').onclick=()=>{metric=!metric;$('units').innerHTML=metric?'Metric <span>⇄ Imperial</span>':'Imperial <span>⇄ Metric</span>';$('units').setAttribute('aria-pressed',metric);render()};
$('recording').onclick=()=>{settings.recording=!settings.recording;applySettings();$('safe-stage').scrollTop=0};$('corner').onchange=()=>{settings.corner=$('corner').value;applySettings()};$('cam-size').onchange=()=>{settings.size=$('cam-size').value;applySettings()};$('guide').onchange=()=>{settings.guide=$('guide').checked;applySettings()};$('show-notes').onchange=()=>{settings.notes=$('show-notes').checked;applySettings()};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('save-status').textContent='Fullscreen unavailable — use your browser fullscreen command'}};
document.addEventListener('fullscreenchange',()=>$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));
$('picks-open').onclick=openPicks;$('picks-close').onclick=closePicks;$('export-picks').onclick=()=>download({event:event.title,exportedAt:new Date().toISOString(),myPicks:summary()},'Allen-vs-Duncan-my-picks.json');
document.addEventListener('keydown',e=>{if(!$('picks-panel').hidden){if(e.key==='Escape'){closePicks();e.preventDefault()}if(e.key==='Tab'){const focusable=[...$('picks-panel').querySelectorAll('button,a,input,select,textarea')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}return}if(e.target.closest('input,textarea,select,[contenteditable="true"]')||e.ctrlKey||e.altKey||e.metaKey)return;if(e.key==='ArrowLeft'){navigate(index-1);e.preventDefault()}if(e.key==='ArrowRight'){navigate(index+1);e.preventDefault()}});
$('import-data').onchange=async()=>{try{const f=$('import-data').files[0];if(!f)return;load(JSON.parse(await f.text()));$('import-status').textContent='Source snapshot loaded'}catch(e){$('import-status').textContent=e.message}};
applySettings();fetch('event.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Source snapshot unavailable');return r.json()}).then(load).catch(e=>{document.body.classList.add('load-failed');$('load-error').hidden=false;$('event-meta').textContent=e.message});
