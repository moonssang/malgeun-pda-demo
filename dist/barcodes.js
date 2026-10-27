// Demo identifiers are not operational ERP labels.
export function sampleCode(stockId,index){return `PK-${stockId}-${String(index).padStart(4,'0')}`;}
export function skuFor(item){const i=['RM-001','RM-002','SM-001','SM-002','FP-001','FP-002'].indexOf(item);if(i<0)return null;const base='880000000'+String(i+1).padStart(3,'0');const sum=[...base].reduce((n,c,j)=>n+Number(c)*(j%2?3:1),0);return base+((10-sum%10)%10);}
export function resolveLabel(state,task,raw){const code=String(raw||'').trim().toUpperCase(),selected=state.stocks.find(x=>x.id===task.stockId);let m=/^PK-([MSP]\d+)-(\d{4})$/.exec(code)||/^([MSP]\d+)-(\d{3})$/.exec(code);if(m){const stock=state.stocks.find(x=>x.id===m[1]);if(!stock||Number(m[2])<1||Number(m[2])>(stock.id==='P4'?30:3))return null;return {code,stock,qty:stock.pack,mode:'package',serial:m[2],unique:true};}
 const match=state.stocks.find(x=>skuFor(x.item)===code||'BOX-'+x.item===code);if(!match)return null;const sameItem=selected&&selected.item===match.item&&selected.kind===match.kind;const stock=sameItem?selected:match;if(code.startsWith('BOX-'))return {code,stock,qty:stock.pack,mode:'box',unique:false};
 // A raw ingredient SKU alone does not encode weight: require measured quantity.
 if(stock.unit==='kg'&&!Number.isFinite(task.measuredQty))return {code,stock,needsWeight:true,mode:'sku',unique:false};
 return {code,stock,qty:stock.unit==='kg'?task.measuredQty:1,mode:'sku',unique:false};}
export function barcodeRules(stock){return {sku:skuFor(stock.item),box:'BOX-'+stock.item,package:sampleCode(stock.id,1),unit:stock.unit,pack:stock.pack};}
