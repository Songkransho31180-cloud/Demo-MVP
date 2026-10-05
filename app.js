const demoTrades = [
  {date:'2026-10-03',symbol:'XAUUSD',side:'Sell',entry:2671.4,exit:2663.2,risk:.5,r:2.1,pnl:92.4,setup:'FVG + Liquidity Sweep',result:'Win'},
  {date:'2026-10-02',symbol:'XAUUSD',side:'Buy',entry:2642.8,exit:2648.1,risk:.5,r:1.3,pnl:58.2,setup:'OB Retest',result:'Win'},
  {date:'2026-09-30',symbol:'XAUUSD',side:'Sell',entry:2660.2,exit:2666.7,risk:.5,r:-1,pnl:-43.8,setup:'CHOCH Confirmation',result:'Loss'},
  {date:'2026-09-29',symbol:'XAUUSD',side:'Buy',entry:2638.5,exit:2649.9,risk:.5,r:2.4,pnl:106.7,setup:'FVG + Liquidity Sweep',result:'Win'},
  {date:'2026-09-26',symbol:'EURUSD',side:'Sell',entry:1.1724,exit:1.1691,risk:.4,r:1.6,pnl:48.6,setup:'OB Retest',result:'Win'},
  {date:'2026-09-24',symbol:'XAUUSD',side:'Buy',entry:2614.1,exit:2608.8,risk:.5,r:-1,pnl:-46.2,setup:'CHOCH Confirmation',result:'Loss'},
  {date:'2026-09-22',symbol:'GBPUSD',side:'Buy',entry:1.3481,exit:1.3512,risk:.4,r:1.2,pnl:34.1,setup:'Breaker',result:'Win'},
  {date:'2026-09-18',symbol:'XAUUSD',side:'Sell',entry:2599.6,exit:2592.4,risk:.5,r:1.8,pnl:71.3,setup:'FVG + Liquidity Sweep',result:'Win'},
  {date:'2026-09-16',symbol:'XAUUSD',side:'Buy',entry:2588.4,exit:2583.7,risk:.5,r:-1,pnl:-44.4,setup:'OB Retest',result:'Loss'},
  {date:'2026-09-12',symbol:'XAUUSD',side:'Sell',entry:2576.2,exit:2576.0,risk:.4,r:0,pnl:1.5,setup:'CHOCH Confirmation',result:'BE'},
  {date:'2026-09-10',symbol:'XAUUSD',side:'Sell',entry:2583.3,exit:2573.8,risk:.5,r:2,pnl:83.6,setup:'OB Retest',result:'Win'},
  {date:'2026-09-07',symbol:'XAUUSD',side:'Buy',entry:2558.1,exit:2552.7,risk:.5,r:-1,pnl:-41.0,setup:'FVG + Liquidity Sweep',result:'Loss'},
  {date:'2026-09-04',symbol:'XAUUSD',side:'Buy',entry:2547.2,exit:2555.9,risk:.5,r:1.9,pnl:61.4,setup:'OB Retest',result:'Win'}
];

let trades = JSON.parse(localStorage.getItem('edgelogTrades') || 'null') || demoTrades;
let calendarCursor = new Date(2026,9,1);
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];

function fmtMoney(n){return `${n>=0?'+':''}$${Math.abs(n).toFixed(2)}`.replace('+$','$');}
function fmtDate(s){const d=new Date(s+'T00:00:00');return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});}

function navTo(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===id));$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}
$$('.nav-item').forEach(b=>b.onclick=()=>navTo(b.dataset.section));$$('[data-jump]').forEach(b=>b.onclick=()=>navTo(b.dataset.jump));
$('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');

function rows(data, full=false){
  return data.map(t=>`<tr>
    <td>${fmtDate(t.date)}</td><td class="symbol-cell"><strong>${t.symbol}</strong></td><td><span class="side-pill ${t.side}">${t.side}</span></td>
    ${full?`<td>${Number(t.entry).toFixed(t.symbol==='XAUUSD'?2:4)}</td><td>${Number(t.exit).toFixed(t.symbol==='XAUUSD'?2:4)}</td>`:''}
    <td><span class="risk-pill">${t.risk}%</span></td><td class="${t.r>0?'positive-text':t.r<0?'negative-text':''}">${t.r>0?'+':''}${t.r}R</td>
    <td class="${t.pnl>0?'positive-text':t.pnl<0?'negative-text':''}">${fmtMoney(t.pnl)}</td><td>${t.setup}</td><td><span class="result-pill ${t.result}">${t.result}</span></td>
  </tr>`).join('');
}
function renderTables(){
  $('#recentTradesBody').innerHTML = trades.slice(0,6).map(t=>`<tr><td>${fmtDate(t.date)}</td><td class="symbol-cell"><strong>${t.symbol}</strong></td><td><span class="side-pill ${t.side}">${t.side}</span></td><td>${t.setup}</td><td><span class="risk-pill">${t.risk}%</span></td><td class="${t.r>0?'positive-text':t.r<0?'negative-text':''}">${t.r>0?'+':''}${t.r}R</td><td class="${t.pnl>0?'positive-text':t.pnl<0?'negative-text':''}">${fmtMoney(t.pnl)}</td><td><span class="result-pill ${t.result}">${t.result}</span></td></tr>`).join('');
  filterTrades();
}
function filterTrades(){
  const q=$('#tradeSearch').value.toLowerCase(),res=$('#resultFilter').value,side=$('#sideFilter').value;
  const f=trades.filter(t=>(t.symbol+t.setup).toLowerCase().includes(q)&&(res==='all'||t.result===res)&&(side==='all'||t.side===side));
  $('#allTradesBody').innerHTML=rows(f,true) || `<tr><td colspan="10" style="text-align:center;color:#7d8798;padding:28px">No trades match these filters.</td></tr>`;
}
['tradeSearch','resultFilter','sideFilter'].forEach(id=>$('#'+id).addEventListener('input',filterTrades));
$('#resetFilters').onclick=()=>{$('#tradeSearch').value='';$('#resultFilter').value='all';$('#sideFilter').value='all';filterTrades()};

function renderEquity(range=30){
  const svg=$('#equityChart'), W=900,H=280,pad=22; let points=[4000];
  const inRange=range==='all'?trades:trades.slice(0,Math.min(trades.length,Math.max(6,Math.round(range/5))));
  [...inRange].reverse().forEach(t=>points.push(points.at(-1)+t.pnl));
  const min=Math.min(...points)-60,max=Math.max(...points)+60;
  const coords=points.map((v,i)=>({x:pad+i*(W-pad*2)/(points.length-1||1),y:H-pad-(v-min)/(max-min)*(H-pad*2),v}));
  const line=coords.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area=`M${coords[0].x},${H-pad} `+coords.map((p,i)=>`${i?'L':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')+` L${coords.at(-1).x},${H-pad} Z`;
  let grid=''; for(let i=0;i<5;i++){const y=pad+i*(H-pad*2)/4;grid+=`<line x1="${pad}" y1="${y}" x2="${W-pad}" y2="${y}" stroke="#242b36" stroke-width="1" stroke-dasharray="4 8"/><text x="${pad}" y="${y-6}" fill="#5f6a7b" font-size="10">$${Math.round(max-i*(max-min)/4)}</text>`}
  svg.innerHTML=`<defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#57e6a4" stop-opacity=".25"/><stop offset="1" stop-color="#57e6a4" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${area}" fill="url(#areaG)"/><path d="${line}" fill="none" stroke="#57e6a4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`+coords.map((p,i)=>`<circle class="chart-point" data-i="${i}" cx="${p.x}" cy="${p.y}" r="5" fill="#0e1317" stroke="#57e6a4" stroke-width="2"/>`).join('');
  $$('.chart-point').forEach((el)=>{el.addEventListener('mouseenter',()=>{const i=+el.dataset.i,p=coords[i],tip=$('#chartTooltip');tip.style.display='block';tip.style.left=(p.x/900*100)+'%';tip.style.top=(p.y/280*100)+'%';tip.textContent=`Balance $${p.v.toFixed(2)}`});el.addEventListener('mouseleave',()=>$('#chartTooltip').style.display='none')});
}
$$('#rangePills button').forEach(b=>b.onclick=()=>{$$('#rangePills button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderEquity(b.dataset.range==='all'?'all':+b.dataset.range)});

const dailyMap={'2026-10-03':92.4,'2026-10-02':58.2,'2026-09-30':-43.8,'2026-09-29':106.7,'2026-09-26':48.6,'2026-09-24':-46.2,'2026-09-22':34.1,'2026-09-18':71.3,'2026-09-16':-44.4,'2026-09-10':83.6,'2026-09-07':-41.0,'2026-09-04':61.4};
function renderCalendar(){
  const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(); $('#monthLabel').textContent=calendarCursor.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const first=new Date(y,m,1),last=new Date(y,m+1,0); const mondayOffset=(first.getDay()+6)%7; let html='';
  const prevLast=new Date(y,m,0).getDate();
  for(let i=0;i<42;i++){let day=i-mondayOffset+1,cm=m,cy=y,muted=false;if(day<1){day=prevLast+day;cm=m-1;muted=true}else if(day>last.getDate()){day-=last.getDate();cm=m+1;muted=true}const d=new Date(cy,cm,day);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;const pnl=dailyMap[key]; const cls=pnl>0?'win':pnl<0?'loss':'';html+=`<div class="cal-day ${muted?'muted':''} ${cls}"><span class="cal-num">${day}</span><span class="cal-pnl ${pnl>0?'positive-text':pnl<0?'negative-text':''}">${pnl==null?'':fmtMoney(pnl)}</span></div>`}
  $('#calendarGrid').innerHTML=html;
}
$('#prevMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()};$('#nextMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()};

function renderSessionBars(){const sessions=[['Asia',58],['London',86],['NY AM',100],['NY PM',41]];$('#sessionBars').innerHTML=sessions.map(([n,h],i)=>`<div class="bar-item"><div class="bar-track"><div class="bar-fill" style="height:${h}%"></div></div><span>${n}</span><strong class="${i<3?'positive-text':''}">${['+$54','+$121','+$173','+$34'][i]}</strong></div>`).join('')}

function openModal(){const d=new Date();$('#fDate').value=d.toISOString().slice(0,10);$('#tradeModal').classList.add('open');$('#tradeModal').setAttribute('aria-hidden','false')}
function closeModal(){$('#tradeModal').classList.remove('open');$('#tradeModal').setAttribute('aria-hidden','true')}
$('#newTradeBtn').onclick=openModal;$('#newTradeBtn2').onclick=openModal;$$('[data-close="modal"]').forEach(x=>x.onclick=closeModal);
$('#tradeForm').onsubmit=e=>{e.preventDefault();const t={date:$('#fDate').value,symbol:$('#fSymbol').value.toUpperCase(),side:$('#fSide').value,setup:$('#fSetup').value,entry:+$('#fEntry').value,exit:+$('#fExit').value,risk:+$('#fRisk').value,r:+$('#fR').value,pnl:+$('#fPnl').value,result:$('#fResult').value,notes:$('#fNotes').value};trades.unshift(t);localStorage.setItem('edgelogTrades',JSON.stringify(trades));renderTables();renderEquity(30);closeModal();e.target.reset();$('#fSymbol').value='XAUUSD';$('#fRisk').value=.5;$('#fR').value=1;};

$('#themeToggle').onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('edgelogTheme',document.body.classList.contains('light')?'light':'dark')};if(localStorage.getItem('edgelogTheme')==='light')document.body.classList.add('light');
$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){navTo('trades');$('#tradeSearch').value=e.target.value;filterTrades();}});document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();$('#globalSearch').focus()}if(e.key==='n'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA')openModal();if(e.key==='Escape')closeModal()});

const journalIds=['biasInput','levelsInput','rulesInput','notesInput'];journalIds.forEach(id=>{const v=localStorage.getItem('journal_'+id);if(v)$('#'+id).value=v});$('#saveJournal').onclick=()=>{journalIds.forEach(id=>localStorage.setItem('journal_'+id,$('#'+id).value));$('#saveStatus').textContent='Saved locally ✓';setTimeout(()=>$('#saveStatus').textContent='Stored locally on this device.',1800)};

renderTables();renderEquity(30);renderCalendar();renderSessionBars();
