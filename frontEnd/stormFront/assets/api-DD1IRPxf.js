const o={weixingyuntu:"卫星云图",卫星云图:"weixingyuntu",FY4Azhencaise:"FY4A真彩色",FY4A真彩色:"FY4Azhencaise",FY4Ahongwai:"FY4A红外",FY4A红外:"FY4Ahongwai",FY4Akejianguang:"FY4A可见光",FY4A可见光:"FY4Akejianguang",FY4Ashuiqi:"FY4A水汽",FY4A水汽:"FY4Ashuiqi",FY2Gkejianguang:"FY2G可见光",FY2G可见光:"FY2Gkejianguang",FY2Gzengqiangtu:"FY2G增强图",FY2G增强图:"FY2Gzengqiangtu",shuiqi:"水汽",水汽:"shuiqi",hongwaiyi:"红外一",红外一:"hongwaiyi",hongwaier:"红外二",红外二:"hongwaier",FY2Gheibaitu:"FY2G黑白图",FY2G黑白图:"FY2Gheibaitu",kejianguang:"可见光",可见光:"kejianguang",zhonghongwai:"中红外",中红外:"zhonghongwai",FY2Gyuanpantu:"FY2G圆盘图",FY2G圆盘图:"FY2Gyuanpantu",caiseyuanpantu:"彩色圆盘图",彩色圆盘图:"caiseyuanpantu",hongwaiyiyuanpantu:"红外一圆盘图",红外一圆盘图:"hongwaiyiyuanpantu",hongwaieryuanpantu:"红外二圆盘图",红外二圆盘图:"hongwaieryuanpantu",zhonghongwaiyuanpantu:"中红外圆盘图",中红外圆盘图:"zhonghongwaiyuanpantu",shuiqiyuanpantu:"水汽圆盘图",水汽圆盘图:"shuiqiyuanpantu",kejianguangyuanpantu:"可见光圆盘图",可见光圆盘图:"kejianguangyuanpantu",jiangshuiliangyubao:"降水量预报",降水量预报:"jiangshuiliangyubao","24xiaoshijiangshuiliang":"24小时降水量","24小时降水量":"24xiaoshijiangshuiliang","24xiaoshi":"24小时","24小时":"24xiaoshi","48xiaoshi":"48小时","48小时":"48xiaoshi","72xiaoshi":"72小时","72小时":"72xiaoshi","96xiaoshi":"96小时","96小时":"96xiaoshi","120xiaoshi":"120小时","120小时":"120xiaoshi","144xiaoshi":"144小时","144小时":"144xiaoshi","168xiaoshi":"168小时","168小时":"168xiaoshi","6xiaoshijiangshuiliang":"6小时降水量","6小时降水量":"6xiaoshijiangshuiliang","6xiaoshi":"6小时","6小时":"6xiaoshi","12xiaoshi":"12小时","12小时":"12xiaoshi","18xiaoshi":"18小时","18小时":"18xiaoshi",leidapintu:"雷达拼图",雷达拼图:"leidapintu",quanguo:"全国",全国:"quanguo",huabei:"华北",华北:"huabei",dongbei:"东北",东北:"dongbei",huadong:"华东",华东:"huadong",huazhong:"华中",华中:"huazhong",huanan:"华南",华南:"huanan",xinan:"西南",西南:"xinan",xibei:"西北",西北:"xibei",jiangshuiliangshikuang:"降水量实况",降水量实况:"jiangshuiliangshikuang","1xiaoshijiangshuiliang":"1小时降水量","1小时降水量":"1xiaoshijiangshuiliang",jin30tianjiangshuiliang:"近30天降水量",近30天降水量:"jin30tianjiangshuiliang",jin10tianjiangshuiliang:"近10天降水量",近10天降水量:"jin10tianjiangshuiliang",jin20tianjiangshuiliang:"近20天降水量",近20天降水量:"jin20tianjiangshuiliang",jin30tianjiangshuiliangjuping:"近30天降水量距平",近30天降水量距平:"jin30tianjiangshuiliangjuping",jin10tianjiangshuiliangjupingbaifenlv:"近10天降水量距平百分率",近10天降水量距平百分率:"jin10tianjiangshuiliangjupingbaifenlv",jin20tianjiangshuiliangjupingbaifenlv:"近20天降水量距平百分率",近20天降水量距平百分率:"jin20tianjiangshuiliangjupingbaifenlv",jin30tianjiangshuiliangjupingbaifenlv:"近30天降水量距平百分率",近30天降水量距平百分率:"jin30tianjiangshuiliangjupingbaifenlv"},p=async e=>{const t=await fetch(`/api/v1/data/meteorology/${e}`).then(i=>i.json()).then(i=>i.data),s=o[t[0].type1],g=new Set,a=new Map;return t.forEach(i=>{const n=i.type3.length===0?o[i.type2]:o[i.type2]+" - "+o[i.type3];g.add(n);const h=a.get(n);h?h.add(i.time):(a.set(n,new Set),a.get(n).add(i.time))}),{imageType:s,type:g,time:a}},j=async(e,t,s)=>{console.log(e,t);let g=t,a="";t.includes("-")&&(g=t.split(" - ")[0],a=t.split(" - ")[1]);const i=`/api/v1/data/meteorology/time&type?time=${s}&type1=${o[e]}&type2=${o[g]}&type3=${o[a]}`,n=await fetch(i).then(u=>u.blob()).then(u=>u);return URL.createObjectURL(n)},l=async()=>{const e={},t=new Date(Date.now()+288e5).getMonth().toString().padStart(2,"0"),g=`http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/${new Date(Date.now()+8*3600*1e3).getFullYear().toString()}${t}`,a=await fetch(g).then(i=>i.json()).then(i=>i).catch(()=>null);if(a!=null&&a.name){const i=a.points.map((n,h)=>({id:h.toString(),name:a.name,time:n.time,lng:Number(n.lng),lat:Number(n.lat),strong:n.strong,power:n.power,speed:n.speed,pressure:n.pressure,moveSpeed:n.movespeed,moveDirection:n.movedirection}));return e[a.name]=i,e}return{}};export{j as a,l as b,p as g};
