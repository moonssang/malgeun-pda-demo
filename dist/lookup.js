import {resolveLabel} from './barcodes.js';

// Lookup is independent of the selected work category and never registers scans.
export function lookupBarcode(state,raw){
 const code=String(raw||'').trim().toUpperCase();
 const label=resolveLabel(state,{stockId:null},code);
 if(!label)return {code,label:null,tasks:[]};
 const tasks=state.tasks.filter(t=>{
  const stock=state.stocks.find(s=>s.id===t.stockId);
  return stock&&stock.kind===label.stock.kind&&stock.item===label.stock.item&&(!label.unique||stock.id===label.stock.id);
 }).map(t=>({...t,stock:state.stocks.find(s=>s.id===t.stockId),lookupStatus:t.state==='done'?'처리 완료':t.allocated?(t.direction==='in'?'입고 확정 대기':'출고 확정 대기'):(t.direction==='in'?'입고 대기':'출고 대기')}));
 return {code,label,tasks};
}
