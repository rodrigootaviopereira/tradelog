var DB={
  gT:function(){try{return JSON.parse(localStorage.getItem('tl_t')||'[]');}catch(e){return[];}},
  sT:function(d){localStorage.setItem('tl_t',JSON.stringify(d));},
  gC:function(){try{return JSON.parse(localStorage.getItem('tl_c')||'[]');}catch(e){return[];}},
  sC:function(d){localStorage.setItem('tl_c',JSON.stringify(d));}
};

function go(id,el){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');});
  document.querySelectorAll('.ni').forEach(function(n){n.classList.remove('on');});
  document.getElementById('pg-'+id).classList.add('on');
  if(el)el.classList.add('on');
  if(id==='dash')rDash();
  if(id==='hi')rHist();
  if(id==='ev')rEvol();
  if(id==='nv')rNivel();
}

function showT(msg,type){
  var t=document.getElementById('toast');
  document.getElementById('tms').textContent=msg;
  document.getElementById('tic').textContent=type==='er'?'❌':'✅';
  t.className='toast on '+(type||'ok');
  setTimeout(function(){t.className='toast';},3000);
}

function tc(lid,iid){
  var i=document.getElementById(iid);
  document.getElementById(lid).classList.toggle('ck',i.checked);
}

function se(g,btn){
  document.querySelectorAll('#'+g+'-row .eb').forEach(function(b){b.classList.remove('sel');});
  btn.classList.add('sel');
}

function ge(g){
  var s=document.querySelector('#'+g+'-row .eb.sel');
  return s?s.dataset.v:'';
}

function tds(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function fd(s){if(!s)return'';var p=s.split('-');return p[2]+'/'+p[1]+'/'+p[0];}

function fc(v){
  var n=parseFloat(v)||0;
  return(n>=0?'+':'-')+' R$ '+Math.abs(n).toFixed(2).replace('.',',');
}

function aScore(t){
  if(!t.adh)return 0;
  var k=['a1','a2','a3','a4','a5','a6'],c=0;
  k.forEach(function(x){if(t.adh[x])c++;});
  return Math.round(c/k.length*100);
}

function wkK(ds){
  if(!ds)return'';
  var d=new Date(ds+'T12:00:00'),j=new Date(d.getFullYear(),0,1);
  var w=Math.ceil(((d-j)/86400000+j.getDay()+1)/7);
  return d.getFullYear()+'-S'+String(w).padStart(2,'0');
}

function mkK(ds){return ds?ds.slice(0,7):'';}

function mlb(k){
  if(!k)return'';
  var p=k.split('-'),ms=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return ms[parseInt(p[1])-1]+'/'+p[0].slice(2);
}

function filt(arr,per){
  var now=new Date();
  return arr.filter(function(t){
    if(!t.date)return false;
    var d=new Date(t.date+'T12:00:00');
    if(per==='week'){var s=new Date(now);s.setDate(now.getDate()-now.getDay());s.setHours(0,0,0,0);return d>=s;}
    if(per==='month')return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    if(per==='last20'){var days=uDays(arr).slice(0,20);return days.indexOf(t.date)>=0;}
    return true;
  });
}

function uDays(arr){
  var s={},r=[];
  arr.forEach(function(t){if(t.date&&!s[t.date]){s[t.date]=1;r.push(t.date);}});
  return r.sort().reverse();
}

function avg(a){
  if(!a||!a.length)return 0;
  var s=0;a.forEach(function(v){s+=v;});
  return Math.round(s/a.length);
}

var CI={};
function dC(id){if(CI[id]){CI[id].destroy();delete CI[id];}}

var bO={
  responsive:true,maintainAspectRatio:false,
  plugins:{legend:{labels:{color:'#8a91a8',font:{size:10}}}},
  scales:{
    x:{ticks:{color:'#8a91a8',font:{size:9}},grid:{color:'rgba(42,47,66,.5)'}},
    y:{ticks:{color:'#8a91a8',font:{size:9}},grid:{color:'rgba(42,47,66,.5)'}}
  }
};

function lC(id,lb,ds){dC(id);var c=document.getElementById(id);if(!c)return;CI[id]=new Chart(c,{type:'line',data:{labels:lb,datasets:ds},options:bO});}
function bC(id,lb,ds){dC(id);var c=document.getElementById(id);if(!c)return;CI[id]=new Chart(c,{type:'bar',data:{labels:lb,datasets:ds},options:bO});}
function dC2(id,lb,d,cl){
  dC(id);var c=document.getElementById(id);if(!c)return;
  CI[id]=new Chart(c,{type:'doughnut',data:{labels:lb,datasets:[{data:d,backgroundColor:cl,borderWidth:0}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#8a91a8',font:{size:10},padding:10}}}}});
}

function rDash(){
  var per=document.getElementById('dff')?document.getElementById('dff').value:'month';
  var all=DB.gT(),tr=filt(all,per);
  var ga=tr.filter(function(t){return t.resultado==='gain';});
  var lo=tr.filter(function(t){return t.resultado==='loss';});
  var ze=tr.filter(function(t){return t.resultado==='zero';});
  var pnl=0;tr.forEach(function(t){pnl+=parseFloat(t.valor)||0;});
  var wr=tr.length?Math.round(ga.length/tr.length*100):0;
  var av=tr.length?avg(tr.map(function(t){return aScore(t);})):0;
  var dc=document.getElementById('dc');
  if(dc)dc.innerHTML=
    '<div class="card '+(pnl>=0?'g':'r')+'"><div class="lbl">Resultado</div><div class="val">'+fc(pnl)+'</div><div class="sub">'+tr.length+' ops</div></div>'+
    '<div class="card b"><div class="lbl">Win Rate</div><div class="val">'+wr+'%</div><div class="sub">'+ga.length+'G / '+lo.length+'L</div></div>'+
    '<div class="card '+(av>=75?'g':av>=50?'y':'r')+'"><div class="lbl">Aderência</div><div class="val">'+av+'%</div><div class="sub">ao plano</div></div>'+
    '<div class="card y"><div class="lbl">Trades</div><div class="val">'+tr.length+'</div><div class="sub">no período</div></div>';
  var bd={};tr.forEach(function(t){if(!bd[t.date])bd[t.date]=0;bd[t.date]+=parseFloat(t.valor)||0;});
  var sd=Object.keys(bd).sort(),acc=0;
  lC('cP',sd.map(fd),[{label:'R$ Acum.',data:sd.map(function(d){acc+=bd[d];return+acc.toFixed(2);}),borderColor:'#4f8ef7',backgroundColor:'rgba(79,142,247,.1)',fill:true,tension:.3,pointRadius:3}]);
  var ad2={};tr.forEach(function(t){if(!ad2[t.date])ad2[t.date]=[];ad2[t.date].push(aScore(t));});
  var sad=Object.keys(ad2).sort();
  lC('cA',sad.map(fd),[{label:'Adh%',data:sad.map(function(d){return avg(ad2[d]);}),borderColor:'#2ecc71',backgroundColor:'rgba(46,204,113,.1)',fill:true,tension:.3,pointRadius:3}]);
  var bw={};tr.forEach(function(t){var w=wkK(t.date);if(!bw[w])bw[w]=0;bw[w]+=parseFloat(t.valor)||0;});
  var sw=Object.keys(bw).sort();
  bC('cW',sw,[{label:'R$',data:sw.map(function(w){return+bw[w].toFixed(2);}),backgroundColor:sw.map(function(w){return bw[w]>=0?'rgba(46,204,113,.7)':'rgba(231,76,60,.7)';})}]);
  if(ga.length||lo.length||ze.length)dC2('cR',['Gains','Losses','BE'],[ga.length,lo.length,ze.length],['rgba(46,204,113,.8)','rgba(231,76,60,.8)','rgba(241,196,15,.8)']);
  var tb=document.getElementById('dtb');if(!tb)return;
  var last=tr.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,20);
  if(!last.length){tb.innerHTML='<tr><td colspan="10" class="es">Nenhum trade registrado ainda.</td></tr>';return;}
  tb.innerHTML=last.map(function(t){
    var p=aScore(t),vc=parseFloat(t.valor)>=0?'var(--g)':'var(--r)';
    return'<tr><td>'+fd(t.date)+'</td><td>'+(t.conta==='mesa'?'Mesa':'Própria')+'</td>'+
    '<td>'+(t.dir==='compra'?'🟢C':'🔴V')+'</td><td>'+(t.setup||'—')+'</td>'+
    '<td><span class="bdg '+(t.resultado==='gain'?'g':t.resultado==='loss'?'r':'y')+'">'+t.resultado.toUpperCase()+'</span></td>'+
    '<td style="color:'+vc+';font-weight:600">'+fc(t.valor)+'</td>'+
    '<td>'+(t.rr||'—')+'x</td>'+
    '<td><span class="bdg '+(p>=75?'g':p>=50?'y':'r')+'">'+p+'%</span></td>'+
    '<td>'+(t.emocao||'—')+'</td>'+
    '<td><button class="btn bx" style="padding:4px 9px;font-size:11px" onclick="opMd('+t.id+')">👁</button></td></tr>';
  }).join('');
}

function saveCk(){
  var date=document.getElementById('ckd').value;
  if(!date){showT('Selecione a data','er');return;}
  var data={date:date,
    rit:{ck1:document.getElementById('ck1').checked,ck2:document.getElementById('ck2').checked,ck3:document.getElementById('ck3').checked,ck4:document.getElementById('ck4').checked},
    sono:{h:document.getElementById('cksh').value,q:document.getElementById('cksq').value},
    em:{humor:ge('humor'),an:document.getElementById('ckan').value,fo:document.getElementById('ckfo').value,obs:document.getElementById('ckob').value},
    mac:{usd:document.getElementById('ckusd').value,gld:document.getElementById('ckgld').value,jur:document.getElementById('ckjur').value,pet:document.getElementById('ckpet').value,vie:document.getElementById('ckvie').value,cnv:document.getElementById('ckcnv').value,obs:document.getElementById('ckmo').value}
  };
  var list=DB.gC().filter(function(c){return c.date!==date;});
  list.push(data);DB.sC(list);showT('Checklist salvo!');
}

function loadCkToday(){
  var date=tds();document.getElementById('ckd').value=date;
  var ck=DB.gC().filter(function(c){return c.date===date;})[0];
  if(!ck){showT('Sem checklist para hoje','er');return;}
  ['ck1','ck2','ck3','ck4'].forEach(function(k){
    document.getElementById(k).checked=ck.rit[k]||false;
    document.getElementById('l'+k).classList.toggle('ck',ck.rit[k]||false);
  });
  document.getElementById('cksh').value=ck.sono.h||'';
  document.getElementById('cksq').value=ck.sono.q||5;
  document.getElementById('sqv').textContent=ck.sono.q||5;
  if(ck.em.humor)document.querySelectorAll('#humor-row .eb').forEach(function(b){b.classList.toggle('sel',b.dataset.v===ck.em.humor);});
  document.getElementById('ckan').value=ck.em.an||3;document.getElementById('anv').textContent=ck.em.an||3;
  document.getElementById('ckfo').value=ck.em.fo||7;document.getElementById('fov').textContent=ck.em.fo||7;
  document.getElementById('ckob').value=ck.em.obs||'';
  document.getElementById('ckusd').value=ck.mac.usd||'';document.getElementById('ckgld').value=ck.mac.gld||'';
  document.getElementById('ckjur').value=ck.mac.jur||'';document.getElementById('ckpet').value=ck.mac.pet||'';
  document.getElementById('ckvie').value=ck.mac.vie||'';document.getElementById('ckcnv').value=ck.mac.cnv||5;
  document.getElementById('cnv').textContent=ck.mac.cnv||5;document.getElementById('ckmo').value=ck.mac.obs||'';
  showT('Checklist carregado!');
}

var trImgs=[];
function prevImg(inp){
  trImgs=[];document.getElementById('tprev').innerHTML='';
  Array.from(inp.files).forEach(function(f){
    var r=new FileReader();
    r.onload=function(e){
      trImgs.push(e.target.result);
      var im=document.createElement('img');im.src=e.target.result;im.className='th';
      document.getElementById('tprev').appendChild(im);
    };r.readAsDataURL(f);
  });
}

function saveTr(){
  var date=document.getElementById('trd').value;
  if(!date){showT('Selecione a data','er');return;}
  var val=document.getElementById('trva').value;
  if(val===''||isNaN(parseFloat(val))){showT('Informe o valor R$','er');return;}
  var t={
    id:Date.now(),date:date,
    conta:document.getElementById('trc').value,
    num:document.getElementById('trn').value,
    dir:document.getElementById('trdi').value,
    resultado:document.getElementById('trre').value,
    valor:parseFloat(val),
    rr:parseFloat(document.getElementById('trrr').value)||0,
    tf:document.getElementById('trtf').value,
    setup:document.getElementById('trse').value,
    adh:{a1:document.getElementById('a1').checked,a2:document.getElementById('a2').checked,a3:document.getElementById('a3').checked,a4:document.getElementById('a4').checked,a5:document.getElementById('a5').checked,a6:document.getElementById('a6').checked},
    emocao:ge('temo'),
    fomo:document.getElementById('trfm').value,
    desc:document.getElementById('trds').value,
    ap:document.getElementById('trap').value,
    imgs:trImgs
  };
  var all=DB.gT();all.push(t);DB.sT(all);
  showT('Trade salvo com sucesso!');clrTr();
}

function clrTr(){
  document.getElementById('trd').value=tds();
  document.getElementById('trc').selectedIndex=0;
  document.getElementById('trn').selectedIndex=0;
  document.getElementById('trdi').selectedIndex=0;
  document.getElementById('trre').selectedIndex=0;
  document.getElementById('trva').value='';
  document.getElementById('trrr').value='';
  document.getElementById('trtf').selectedIndex=0;
  document.getElementById('trse').selectedIndex=0;
  ['a1','a2','a3','a4','a5','a6'].forEach(function(k){
    document.getElementById(k).checked=false;
    document.getElementById('l'+k).classList.remove('ck');
  });
  document.querySelectorAll('#temo-row .eb').forEach(function(b){b.classList.remove('sel');});
  document.getElementById('trfm').selectedIndex=0;
  document.getElementById('trds').value='';
  document.getElementById('trap').value='';
  document.getElementById('tprev').innerHTML='';
  trImgs=[];
}

function delTr(id){
  if(!confirm('Excluir este trade?'))return;
  DB.sT(DB.gT().filter(function(t){return t.id!==id;}));
  rHist();showT('Trade excluído.');
}

function rHist(){
  var all=DB.gT();
  var tr=filt(all,document.getElementById('hfp').value);
  var hfc=document.getElementById('hfc').value;
  var hfr=document.getElementById('hfr').value;
  var de=document.getElementById('hfde').value;
  var at=document.getElementById('hfat').value;
  if(hfc!=='all')tr=tr.filter(function(t){return t.conta===hfc;});
  if(hfr!=='all')tr=tr.filter(function(t){return t.resultado===hfr;});
  if(de)tr=tr.filter(function(t){return t.date>=de;});
  if(at)tr=tr.filter(function(t){return t.date<=at;});
  tr.sort(function(a,b){return b.date.localeCompare(a.date);});
  var tb=document.getElementById('htb');if(!tb)return;
  if(!tr.length){tb.innerHTML='<tr><td colspan="10" class="es">Nenhum trade encontrado.</td></tr>';return;}
  tb.innerHTML=tr.map(function(t){
    var p=aScore(t),vc=parseFloat(t.valor)>=0?'var(--g)':'var(--r)';
    return'<tr><td>'+fd(t.date)+'</td><td>'+(t.conta==='mesa'?'Mesa':'Própria')+'</td>'+
    '<td>'+(t.dir==='compra'?'🟢C':'🔴V')+'</td><td>'+(t.setup||'—')+'</td>'+
    '<td><span class="bdg '+(t.resultado==='gain'?'g':t.resultado==='loss'?'r':'y')+'">'+t.resultado.toUpperCase()+'</span></td>'+
    '<td style="color:'+vc+';font-weight:600">'+fc(t.valor)+'</td>'+
    '<td>'+(t.rr||'—')+'x</td>'+
    '<td><span class="bdg '+(p>=75?'g':p>=50?'y':'r')+'">'+p+'%</span></td>'+
    '<td>'+(t.emocao||'—')+'</td>'+
    '<td style="display:flex;gap:4px">'+
    '<button class="btn bx" style="padding:4px 8px;font-size:11px" onclick="opMd('+t.id+')">👁</button>'+
    '<button class="btn bd" style="padding:4px 8px;font-size:11px" onclick="delTr('+t.id+')">🗑</button>'+
    '</td></tr>';
  }).join('');
}

function clrHF(){
  document.getElementById('hfp').selectedIndex=0;
  document.getElementById('hfc').selectedIndex=0;
  document.getElementById('hfr').selectedIndex=0;
  document.getElementById('hfde').value='';
  document.getElementById('hfat').value='';
  rHist();
}

function rEvol(){
  var all=DB.gT(),byM={};
  all.forEach(function(t){
    var k=mkK(t.date);if(!k)return;
    if(!byM[k])byM[k]={pnl:0,t:0,g:0,l:0,ag:[],al:[]};
    byM[k].pnl+=parseFloat(t.valor)||0;byM[k].t++;
    if(t.resultado==='gain'){byM[k].g++;byM[k].ag.push(aScore(t));}
    if(t.resultado==='loss'){byM[k].l++;byM[k].al.push(aScore(t));}
  });
  var ks=Object.keys(byM).sort();
  bC('cMen',ks.map(mlb),[{label:'R$',data:ks.map(function(k){return+byM[k].pnl.toFixed(2);}),backgroundColor:ks.map(function(k){return byM[k].pnl>=0?'rgba(46,204,113,.7)':'rgba(231,76,60,.7)';})}]);
  bC('cAG',ks.map(mlb),[{label:'Adh Gains %',data:ks.map(function(k){return avg(byM[k].ag);}),backgroundColor:'rgba(46,204,113,.6)'}]);
    bC('cAL',ks.map(mlb),[{label:'Adh Losses %',data:ks.map(function(k){return avg(byM[k].al);}),backgroundColor:'rgba(231,76,60,.6)'}]);
  var tb=document.getElementById('etb');if(!tb)return;
  if(!ks.length){tb.innerHTML='<tr><td colspan="8" class="es">Sem dados ainda.</td></tr>';return;}
  tb.innerHTML=ks.map(function(k){
    var m=byM[k],wr=m.t?Math.round(m.g/m.t*100):0;
    return'<tr><td>'+mlb(k)+'</td><td>'+m.t+'</td><td>'+m.g+'</td><td>'+m.l+'</td><td>'+wr+'%</td>'+
    '<td style="color:'+(m.pnl>=0?'var(--g)':'var(--r)')+'">'+fc(m.pnl)+'</td>'+
    '<td>'+avg(m.ag)+'%</td><td>'+avg(m.al)+'%</td></tr>';
  }).join('');
}

function rNivel(){
  var all=DB.gT();
  var days=uDays(all).slice(0,20);
  var tr20=all.filter(function(t){return days.indexOf(t.date)>=0;});
  var pnl=0;all.forEach(function(t){pnl+=parseFloat(t.valor)||0;});
  var nivel=Math.floor(Math.max(0,pnl)/1000);
  var cts=nivel+1;
  var nvc=document.getElementById('nvc');
  if(nvc)nvc.innerHTML=
    '<div class="card '+(pnl>=0?'g':'r')+'"><div class="lbl">Lucro Acumulado</div><div class="val">'+fc(pnl)+'</div><div class="sub">conta própria</div></div>'+
    '<div class="card b"><div class="lbl">Contratos Atuais</div><div class="val">'+cts+'</div><div class="sub">nível '+nivel+'</div></div>'+
    '<div class="card y"><div class="lbl">Próximo Nível em</div><div class="val">'+fc(((nivel+1)*1000)-pnl)+'</div><div class="sub">de lucro</div></div>'+
    '<div class="card b"><div class="lbl">Pregões Analisados</div><div class="val">'+days.length+'</div><div class="sub">dos últimos 20</div></div>';
  var gains20=tr20.filter(function(t){return t.resultado==='gain';});
  var gainsNP=gains20.filter(function(t){return aScore(t)===100;});
  var pctG=gains20.length?Math.round(gainsNP.length/gains20.length*100):0;
  var stopsR=tr20.filter(function(t){return t.adh&&t.adh.a3;});
  var pctS=tr20.length?Math.round(stopsR.length/tr20.length*100):0;
  var dOver=0,dL30=0;
  days.forEach(function(d){
    var dt=tr20.filter(function(t){return t.date===d;});
    if(dt.some(function(t){return t.fomo==='over';}))dOver++;
    var pd=0;dt.forEach(function(t){pd+=parseFloat(t.valor)||0;});
    if(pd<-78)dL30++;
  });
  var nvcr=document.getElementById('nvcr');
  if(nvcr)nvcr.innerHTML=
    '<div class="cr '+(pctG>=75?'pass':'fail')+'"><div class="crl">Gains no Plano</div><div class="crv">'+pctG+'%</div><div class="crt">Meta: ≥ 75%</div></div>'+
    '<div class="cr '+(pctS>=90?'pass':'fail')+'"><div class="crl">Stops Respeitados</div><div class="crv">'+pctS+'%</div><div class="crt">Meta: ≥ 90%</div></div>'+
    '<div class="cr '+(dOver===0?'pass':'fail')+'"><div class="crl">Dias c/ Overtrading</div><div class="crv">'+dOver+'</div><div class="crt">Meta: 0</div></div>'+
    '<div class="cr '+(dL30===0?'pass':'fail')+'"><div class="crl">Dias Loss >30%</div><div class="crv">'+dL30+'</div><div class="crt">Meta: 0</div></div>';
  var esc=document.getElementById('esc');
  if(esc){
    var html='';
    for(var i=0;i<=5;i++){
      var isCur=nivel===i,isDone=pnl>=(i)*1000;
      html+='<div class="ns '+(isCur?'cur':isDone?'done':'')+'">'+
        '<span style="font-size:20px">'+(isCur?'📍':isDone?'✅':'🔒')+'</span>'+
        '<div><div style="font-size:12px;font-weight:600">Nível '+i+' — '+(i+1)+' contrato'+(i>0?'s':'')+'</div>'+
        '<div style="font-size:10px;color:var(--t2)">A partir de R$ '+(i===0?'0':(i*1000).toLocaleString('pt-BR'))+'</div></div>'+
        (isCur?'<span class="bdg b" style="margin-left:auto">ATUAL</span>':'')+'</div>';
    }
    esc.innerHTML=html;
  }
  var nvtb=document.getElementById('nvtb');
  if(!nvtb)return;
  if(!days.length){nvtb.innerHTML='<tr><td colspan="7" class="es">Sem dados.</td></tr>';return;}
  nvtb.innerHTML=days.map(function(d){
    var dt=tr20.filter(function(t){return t.date===d;});
    var pd=0;dt.forEach(function(t){pd+=parseFloat(t.valor)||0;});
    var adhD=dt.length?avg(dt.map(function(t){return aScore(t);})):0;
    var hOver=dt.some(function(t){return t.fomo==='over';});
    var hL30=pd<-78;
    var ok=!hOver&&!hL30;
    return'<tr><td>'+fd(d)+'</td><td>'+dt.length+'</td>'+
    '<td style="color:'+(pd>=0?'var(--g)':'var(--r)')+'">'+fc(pd)+'</td>'+
    '<td><span class="bdg '+(adhD>=75?'g':adhD>=50?'y':'r')+'">'+adhD+'%</span></td>'+
    '<td>'+(hOver?'<span class="bdg r">Sim</span>':'<span class="bdg g">Não</span>')+'</td>'+
    '<td>'+(hL30?'<span class="bdg r">Sim</span>':'<span class="bdg g">Não</span>')+'</td>'+
    '<td>'+(ok?'<span class="bdg g">✅ OK</span>':'<span class="bdg r">⚠️ Atenção</span>')+'</td></tr>';
  }).join('');
}

function opMd(id){
  var t=DB.gT().filter(function(x){return x.id===id;})[0];
  if(!t)return;
  var p=aScore(t);
  var labs=['Estrutura macro','POI válido','Stop respeitado','Alvo atingido','Parcial/Trailing','Risco respeitado'];
  var keys=['a1','a2','a3','a4','a5','a6'];
  var rows=keys.map(function(k,i){
    return'<tr><td style="padding:8px 10px">'+labs[i]+'</td><td style="padding:8px 10px">'+(t.adh&&t.adh[k]?'<span class="bdg g">✅ Sim</span>':'<span class="bdg r">❌ Não</span>')+'</td></tr>';
  }).join('');
  var imgs=t.imgs&&t.imgs.length?t.imgs.map(function(s){return'<img src="'+s+'" style="max-width:100%;border-radius:8px;margin-top:8px">';}).join(''):'';
  document.getElementById('mtit').textContent='Trade '+fd(t.date)+' — '+(t.conta==='mesa'?'Mesa':'Própria');
  document.getElementById('mbod').innerHTML=
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;font-size:12px">'+
    '<div><span style="color:var(--t2)">Direção</span><div>'+(t.dir==='compra'?'🟢 Compra':'🔴 Venda')+'</div></div>'+
    '<div><span style="color:var(--t2)">Resultado</span><div><span class="bdg '+(t.resultado==='gain'?'g':t.resultado==='loss'?'r':'y')+'">'+t.resultado.toUpperCase()+'</span></div></div>'+
    '<div><span style="color:var(--t2)">Valor</span><div style="color:'+(parseFloat(t.valor)>=0?'var(--g)':'var(--r)')+'">'+fc(t.valor)+'</div></div>'+
    '<div><span style="color:var(--t2)">RR</span><div>'+t.rr+'x</div></div>'+
    '<div><span style="color:var(--t2)">Setup</span><div>'+(t.setup||'—')+'</div></div>'+
    '<div><span style="color:var(--t2)">Emoção</span><div>'+(t.emocao||'—')+'</div></div>'+
    '</div>'+
    '<div style="font-size:12px;font-weight:700;margin-bottom:8px">Aderência: <span style="color:'+(p>=75?'var(--g)':p>=50?'var(--y)':'var(--r)')+'">'+p+'%</span></div>'+
    '<table style="margin-bottom:14px"><tbody>'+rows+'</tbody></table>'+
    (t.desc?'<div style="margin-bottom:10px"><div style="font-size:10px;color:var(--t2);margin-bottom:3px">DESCRIÇÃO</div><div style="font-size:12px">'+t.desc+'</div></div>':'')+
    (t.ap?'<div style="margin-bottom:10px"><div style="font-size:10px;color:var(--t2);margin-bottom:3px">APRENDIZADO</div><div style="font-size:12px">'+t.ap+'</div></div>':'')+
    imgs;
  document.getElementById('modal').classList.add('on');
}

function clModal(){
  document.getElementById('modal').classList.remove('on');
}

document.getElementById('trd').value=tds();
document.getElementById('ckd').value=tds();
rDash();