import{g as T,r as h,v as W,c as m,h as z,o as F,b,d as w,e,f as s,i,t as o,u as y,l as r,F as R,n as U,k as $,p as q,q as L,s as M,_ as O}from"./index-l0_1r5o4.js";import{g as j,a as D,c as A,i as G,e as I}from"./api-Miiz4aSa.js";import"./stationInfo-DixEZJLI.js";import"./getStation-DC6WyyE7.js";const u=_=>(L("data-v-5f4499d1"),_=_(),M(),_),H={class:"h-full w-full flex bg-slate-300"},J={class:"flex-auto"},K={class:"text-xl font-semibold text-[#406abf]"},P={class:"flex flex-col w-[20rem] bg-white"},Q={class:"h-52 m-2 border border-zinc-300"},X=u(()=>e("div",{class:"h-10 leading-10 px-2 bg-[#1b6ec8] text-white"},"站点详情",-1)),Y={class:"mx-3 my-2 flex flex-col"},Z={class:"my-1 text-lg"},ee=u(()=>e("span",{class:"inline-block pr-2"},"站点名称:",-1)),te={class:"inline-block pr-3"},ae={class:"my-1"},le=u(()=>e("span",{class:"inline-block pr-2 text-lg"},"站点类型:",-1)),se={class:"inline-block pr-3"},oe={class:"my-1"},ne=u(()=>e("span",{class:"inline-block pr-2 text-lg"},"站点位置:",-1)),ce={class:"inline-block pr-3"},ie={class:"my-1"},re=u(()=>e("span",{class:"inline-block pr-2 text-lg"},"当前时间:",-1)),ue={class:"inline-block pr-3"},de={class:"flex flex-col flex-auto m-2 top-1 border border-zinc-300"},_e=u(()=>e("div",{class:"h-10 leading-10 px-2 bg-[#1b6ec8] text-white"},"站点选择",-1)),pe=T({__name:"WaterSituationDetail",setup(_){let d=null;const x=h(),g=h("graph"),n=W(),S=h(),t=m(()=>j(n.currentStationID)),a=h(null),v=m(()=>a.value===null||a.value.hpre.length!==0),V=m(()=>{if(a.value){const f=[];return a.value.hpre.forEach((c,p)=>{f.push({hpre:c,time:a.value.time[p]})}),f}else return[]});return z(n,async()=>{a.value=await D(n.currentStationID),d&&(d.clear(),I(d,a.value,t.value,v.value))}),F(async()=>{a.value=await D(n.currentStationID),S.value=await A(),d=G(x),v.value&&I(d,a.value,t.value,v.value)}),(f,c)=>{const p=r("el-tab-pane"),k=r("el-table-column"),E=r("el-table"),B=r("el-tabs"),C=r("el-radio"),N=r("el-radio-group");return b(),w("div",H,[e("div",J,[s(B,{modelValue:g.value,"onUpdate:modelValue":c[0]||(c[0]=l=>g.value=l),type:"border-card",class:"bg-white h-full"},{default:i(()=>[s(p,{label:"折线图",name:"graph"},{default:i(()=>[e("div",{ref_key:"echartsRef",ref:x,class:"h-[86vh]"},null,512)]),_:1}),s(p,{label:"数据表",name:"table",class:"flex flex-col items-center"},{default:i(()=>[e("div",K,o(`${t.value.name}站点 ${t.value.time} 实时潮位表`),1),s(E,{data:V.value,class:"h-[84vh]","highlight-current-row":!0},{default:i(()=>[s(k,{prop:"time",label:"时间"}),s(k,{align:"center",prop:"hpre",label:"天文潮位 (hpre)"})]),_:1},8,["data"])]),_:1})]),_:1},8,["modelValue"])]),e("div",P,[e("div",Q,[X,e("div",Y,[e("div",Z,[ee,e("span",te,o(t.value.name),1)]),e("div",ae,[le,e("span",se,o(t.value.type==="sea"?"沿海":"沿江"),1)]),e("div",oe,[ne,e("span",ce,o(t.value.lon),1),e("span",null,o(t.value.lat),1)]),e("div",ie,[re,e("span",ue,o(t.value.time),1)])])]),e("div",de,[_e,s(N,{modelValue:y(n).currentStationID,"onUpdate:modelValue":c[1]||(c[1]=l=>y(n).currentStationID=l),class:"py-2 px-4 block overflow-auto h-[66vh]"},{default:i(()=>[(b(!0),w(R,null,U(S.value,l=>(b(),$(C,{key:l.id,label:l.id,class:"block"},{default:i(()=>[q(o(l.label),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])])])])}}}),be=O(pe,[["__scopeId","data-v-5f4499d1"]]);export{be as default};
