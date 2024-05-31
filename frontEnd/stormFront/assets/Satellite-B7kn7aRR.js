import{g as A,a as z}from"./api-DruAj8pT.js";import{g as F,r as l,c as P,o as q,h as y,b as u,d as B,e as a,f as w,i as m,j as E,k as h,l as i,m as R,F as G,n as H,p as j,q as J,s as K,_ as O}from"./index-BqiXETND.js";const k=r=>(J("data-v-944e6793"),r=r(),K(),r),Q={class:"flex h-full"},W={class:"flex flex-auto justify-center items-center bg-zinc-200"},X=["src"],Y={class:"flex flex-col w-[18rem] bg-white"},Z={class:"h-24 relative m-2 top-1 border border-zinc-300"},$=k(()=>a("div",{class:"h-8 leading-8 px-2 bg-[#1b6ec8] text-white"},"图片类型",-1)),ee={class:"flex-auto h-24 relative m-2 top-1 border border-zinc-300"},le=k(()=>a("div",{class:"h-8 leading-8 px-2 bg-[#1b6ec8] text-white"},"图片列表",-1)),ae={class:"flex flex-col h-24 relative m-2 top-1 border border-zinc-300"},te=k(()=>a("div",{class:"h-8 leading-8 px-2 bg-[#1b6ec8] text-white"},"图片动画",-1)),se={class:"flex flex-auto items-center"},oe={class:"m-3"},ne=F({__name:"Satellite",setup(r){const d=l([]),C=l(new Map),t=l([]),b=l(),n=l(),s=l(),I=l(!0),v=l(!1),g=l(300),f=l(0),_=l(),S=P(()=>t.value.map(o=>({time:o})));q(async()=>{const{type:o,time:e,imageType:x}=await A("cloud");b.value=x,d.value=[...o].map(p=>({value:p,label:p})),C.value=e,t.value=[...e.get(d.value[1].value)],n.value=d.value[1].value,s.value=t.value[0],_.value=await z(b.value,n.value,s.value),I.value=!1}),y([n],async()=>{t.value=[...C.value.get(n.value)],s.value=t.value[0]}),y([n,s],async()=>{_.value=_.value=await z(b.value,n.value,s.value)}),y(S,()=>{v.value=!1,clearInterval(f.value),s.value=t.value[0]});const D=o=>{o?s.value=o.time:s.value=t.value[0]},T=()=>{if(v.value)clearInterval(f.value),s.value=t.value[0];else{const o=t.value.length;let e=o-1;f.value=setInterval(()=>{s.value=t.value[e],e===0?e=o-1:e-=1},g.value)}v.value=!v.value};return(o,e)=>{const x=i("el-option"),p=i("el-select"),L=i("el-table-column"),M=i("el-table"),N=i("el-input-number"),V=i("el-button"),U=R("loading");return u(),B("div",Q,[a("div",W,[a("img",{class:"flex-auto m-4 max-h-[90vh] object-contain",src:_.value},null,8,X)]),a("div",Y,[a("div",Z,[$,w(p,{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=c=>n.value=c),class:"m-2 w-[90%]",placeholder:"Select",size:"large",change:"selectChange"},{default:m(()=>[(u(!0),B(G,null,H(d.value,c=>(u(),h(x,{key:c.value,label:c.label,value:c.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),a("div",ee,[le,E((u(),h(M,{data:S.value,stripe:"",class:"w-full h-[68vh]","highlight-current-row":!0,onCurrentChange:D},{default:m(()=>[w(L,{prop:"time",label:"时间"})]),_:1},8,["data"])),[[U,I.value]])]),a("div",ae,[te,a("div",se,[w(N,{modelValue:g.value,"onUpdate:modelValue":e[1]||(e[1]=c=>g.value=c),min:1,max:1e5,step:200,class:"m-3"},null,8,["modelValue"]),a("div",oe,[v.value?(u(),h(V,{key:1,type:"danger",class:"bg-[#1b6ec8]",onClick:T},{default:m(()=>[j("停止动画")]),_:1})):(u(),h(V,{key:0,type:"primary",class:"bg-[#1b6ec8]",onClick:T},{default:m(()=>[j("播放动画")]),_:1}))])])])])])}}}),ie=O(ne,[["__scopeId","data-v-944e6793"]]);export{ie as default};
