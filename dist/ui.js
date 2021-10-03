window.onload=()=>{const e='\n            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="4"></line>\n            </svg>\n        ',t='\n            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M22 12L14 18L14 6L22 12Z" fill="currentColor"></path>\n            <line x1="14" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="4"></line>\n            </svg>\n        ',n=document.getElementById("strokecap0-switch"),o=document.getElementById("strokecap1-switch");n.setAttribute("capType","NONE"),n.innerHTML=e,o.setAttribute("capType","ARROW_EQUILATERAL"),o.innerHTML=t,n.onclick=()=>{const t=[{id:"NONE",icon:e},{id:"ARROW_EQUILATERAL",icon:'\n            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M2 12L10 6V18L2 12Z" fill="currentColor"></path>\n            <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="4"></line>\n            </svg>\n        '}],n=document.getElementById("strokecap0-switch"),o=n.getAttribute("capType"),s=t.findIndex((e=>e.id===o)),c=s+1>=t.length?0:s+1;n.setAttribute("capType",t[c].id),n.innerHTML=t[c].icon;const l=[t[c].id,null];parent.postMessage({pluginMessage:{type:"set-stroke-cap",value:l}},"*")},o.onclick=()=>{const n=[{id:"NONE",icon:e},{id:"ARROW_EQUILATERAL",icon:t}],o=document.getElementById("strokecap1-switch"),s=o.getAttribute("capType"),c=n.findIndex((e=>e.id===s)),l=c+1>=n.length?0:c+1;o.setAttribute("capType",n[l].id),o.innerHTML=n[l].icon;const r=[null,n[l].id];parent.postMessage({pluginMessage:{type:"set-stroke-cap",value:r}},"*")},document.getElementById("bezier-switch").setAttribute("checked","true"),document.getElementById("bezier-switch").onclick=()=>{const e=document.getElementById("bezier-switch"),t=e.hasAttribute("checked");t?e.removeAttribute("checked"):e.setAttribute("checked","true"),parent.postMessage({pluginMessage:{type:"set-bezier",value:!t}},"*")},document.getElementById("enable-switch").setAttribute("checked","true"),document.getElementById("enable-switch").onclick=()=>{const e=document.getElementById("enable-switch"),t=e.hasAttribute("checked");t?e.removeAttribute("checked"):e.setAttribute("checked","true"),parent.postMessage({pluginMessage:{type:"set-enabled",value:!t}},"*")},document.getElementById("update-switch").setAttribute("checked","true"),document.getElementById("update-switch").onclick=()=>{const e=document.getElementById("update-switch"),t=e.hasAttribute("checked");t?e.removeAttribute("checked"):e.setAttribute("checked","true"),parent.postMessage({pluginMessage:{type:"set-update",value:!t}},"*")},document.getElementById("lock-switch").setAttribute("checked","true"),document.getElementById("lock-switch").onclick=()=>{const e=document.getElementById("lock-switch"),t=e.hasAttribute("checked");t?e.removeAttribute("checked"):e.setAttribute("checked","true"),parent.postMessage({pluginMessage:{type:"set-framelocked",value:!t}},"*")};for(let e=1;e<6;e++)document.getElementById(`stroke-color-${e}`).onclick=()=>{const t=document.getElementById(`stroke-color-${e}`),n=t.getAttribute("color");!function(){for(let o=1;o<6;o++){const o=document.getElementById(`stroke-color-${e}`).getAttribute("color");n!==o&&t.removeAttribute("checked")}}(),t.setAttribute("checked","true"),document.getElementById("stroke-color-hex").value=n,document.getElementById("stroke-color").value=n,parent.postMessage({pluginMessage:{type:"set-color",value:n}},"*")};document.getElementById("stroke-opacity").onchange=()=>{const e=document.getElementById("stroke-opacity"),t=e.value.replace("%","");let n=0;n=parseFloat(t),isNaN(n)?(n=100,e.value="100%"):(n>100&&(n=100),n<0&&(n=0),e.value=`${n.toFixed(0)}%`),parent.postMessage({pluginMessage:{type:"set-color-opacity",value:n/100}},"*")},document.getElementById("stroke-color").onchange=()=>{const{value:e}=document.getElementById("stroke-color");for(let t=1;t<6;t++){const n=document.getElementById(`stroke-color-${t}`);e===n.getAttribute("color")?n.setAttribute("checked","true"):n.removeAttribute("checked")}document.getElementById("stroke-color-hex").value=e,parent.postMessage({pluginMessage:{type:"set-color",value:e}},"*")},document.getElementById("stroke-color-hex").onchange=()=>{const e=document.getElementById("stroke-color-hex");e.value=function(e){const t=function(e,t,n=2){return parseInt(t.substr(e,n),16)};if(e.startsWith("#")||(e=`#${e}`),2===e.length){const t=parseInt(e.substr(1,1),16);if(!isNaN(t)){let e="#";const n=t.toString(16).toUpperCase();for(let t=0;t<6;t++)e+=n;return e}}if(3===e.length){const n=t(1,e);if(!isNaN(n)){let e=n.toString(16).toUpperCase();return 1===e.length&&(e+="0"),`#${e}${e}${e}`}}if(4===e.length){const n=t(1,e),o=t(3,e,1);if(!isNaN(n)&&!isNaN(o)){let e=n.toString(16).toUpperCase(),t=o.toString(16).toUpperCase();return 1===e.length&&(e+="0"),1===t.length&&(t+="0"),`#${e}${t}${t}`}}else if(5===e.length){const n=t(1,e),o=t(3,e);if(!isNaN(n)&&!isNaN(o)){let e=n.toString(16).toUpperCase();1===e.length&&(e+="0");let t=o.toString(16).toUpperCase();return 1===t.length&&(t+="0"),`#${e}${t}00`}}else if(e.length>=6){const n=t(1,e),o=t(3,e),s=t(5,e);if(!isNaN(n)&&!isNaN(o)&&!isNaN(s)){let e=n.toString(16).toUpperCase();1===e.length&&(e+="0");let t=o.toString(16).toUpperCase();1===t.length&&(t+="0");let c=s.toString(16).toUpperCase();return 1===c.length&&(c+="0"),`#${e}${t}${c}`}}return"#000000"}(e.value);const t=document.getElementById("stroke-color");t.value!==e.value&&(t.value=e.value),parent.postMessage({pluginMessage:{type:"set-color",value:e.value}},"*")},document.getElementById("stroke-weight").onchange=()=>{const e=document.getElementById("stroke-weight");0===e.value.length&&(e.value="1"),parent.postMessage({pluginMessage:{type:"set-stroke-weight",value:parseInt(e.value,10)}},"*")},document.getElementById("dash-pattern").onchange=()=>{const e=document.getElementById("dash-pattern");0===e.value.length&&(e.value="0"),parent.postMessage({pluginMessage:{type:"set-dash-pattern",value:parseInt(e.value,10)}},"*")},document.getElementById("dash-pattern-switch").onclick=()=>{const e=document.getElementById("dash-pattern-switch"),t=document.getElementById("dash-pattern");if(e.hasAttribute("value")){const n=e.getAttribute("value");"0"===t.value?t.value=n:(t.value===n||e.setAttribute("value",t.value),t.value="0")}else"0"!==t.value&&(e.setAttribute("value",t.value),t.value="0");parent.postMessage({pluginMessage:{type:"set-dash-pattern",value:parseInt(t.value,10)}},"*")},document.getElementById("github-link").onclick=()=>{window.open("https://github.com/AgitoReiKen/figma-itemflow")}};