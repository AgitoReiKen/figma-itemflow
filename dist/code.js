(()=>{"use strict";var o={480:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n),Object.defineProperty(e,o,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,o){e[o=void 0===o?n:o]=t[n]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return a(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const i=n(154),l=r(n(154));figma.showUI(__html__),figma.ui.resize(300,330),figma.ui.onmessage=e=>{switch(e.type){case"init":l.Enable(),l.GetPluginNode().locked=!0,figma.on("close",()=>{l.Disable(),figma.closePlugin()});break;case"set-stroke-weight":l.flowSettings.weight=parseInt(e.value,10);break;case"set-stroke-cap":null!==e.value[0]&&(l.flowSettings.strokeCap[0]=e.value[0]),null!==e.value[1]&&(l.flowSettings.strokeCap[1]=e.value[1]);break;case"set-color":var t=function(e,t){return parseFloat((parseInt(t.substr(e,2),16)/255).toPrecision(3))};l.flowSettings.color.r=t(1,e.value),l.flowSettings.color.g=t(3,e.value),l.flowSettings.color.b=t(5,e.value);break;case"set-color-opacity":l.flowSettings.color.a=e.value;break;case"set-dash-pattern":t=parseInt(e.value,10);l.flowSettings.dashPattern=[t,t];break;case"set-bezier":l.flowSettings.bezier=e.value;break;case"set-enabled":e.value?l.EnableFlowEvents():l.DisableFlowEvents();break;case"set-update":e.value?l.EnableFlowUpdate():l.DisableFlowUpdate();break;case"set-framelocked":(0,i.GetPluginNode)().locked=e.value}}},154:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.DisableFlowUpdate=t.EnableFlowUpdate=t.DisableFlowEvents=t.EnableFlowEvents=t.CreateFlow=t.Disable=t.Enable=t.GetPluginNode=t.flowSettings=t.FlowSettings=void 0;const a=n(522),g=o(n(634)),v=o(n(464)),r="ItemFlow",l="IF",p="IFC",s="IFS",i=r;let c=null,u=null;function f(e){const t=figma.createFrame();t.visible=!1,t.name="group-holder",t.locked=!0,e.appendChild(t);const n=figma.group(e.children,figma.currentPage);return e.setPluginData(i,"0"),e.remove(),n.name=r,n.setPluginData(i,"1"),n}function d(){var e=figma.currentPage.id!==u;function t(e){return null!=e&&void 0!==e&&!e.removed}function n(){let e=null;return e=figma.currentPage.findOne(e=>"1"===e.getPluginData(i)),t(e)?"FRAME"===e.type&&(e=f(e)):(e=function(){const e=figma.createFrame();return e.locked=!0,f(e),figma.currentPage.findOne(e=>"1"===e.getPluginData(i))}(),h()),e}return!e&&t(c)&&!c.removed||(u=figma.currentPage.id,c=n()),c}function h(){const e=d();"FRAME"===e.type&&f(e),figma.currentPage.insertChild(figma.currentPage.children.length,e),e.name=r}t.GetPluginNode=d;class m{constructor(e,t,n,o){console.assert(e<=1&&t<=1&&n<=1&&o<=1),this.r=e,this.g=t,this.b=n,this.a=o}}class b{constructor(){this.strokeCap=["NONE","ARROW_EQUILATERAL"],this.dashPattern=[],this.weight=1,this.color=new m(0,0,0,1),this.bezier=!0}}const S=new(t.FlowSettings=b);t.flowSettings=S;class w{constructor(){this.nodesAbsoluteTransform=[]}}function y(e){e=e.getPluginData(s);return 0===e.length?null:JSON.parse(e)}function P(e){e=e.getPluginData(l);return 0===e.length?[]:JSON.parse(e)}function _(n){const e=d().findChildren(e=>{const t=P(e);return 2===t.length&&void 0!==t.find(e=>e===n.id)});e.forEach(e=>e.remove())}function O(){return d().findChildren(e=>2===P(e).length)}function M(e){var t=y(e);!function(e,t,n){const o=JSON.parse(JSON.stringify(e.vectorNetwork));"strokeCap"in o.vertices[o.vertices.length-1]&&(o.vertices[o.vertices.length-1].strokeCap=t,o.vertices[0].strokeCap=n),e.vectorNetwork=o}(e,t.strokeCap[0],t.strokeCap[1]),e.dashPattern=t.dashPattern,e.strokeWeight=t.weight;const n=JSON.parse(JSON.stringify(e.strokes));n[0].color.r=t.color.r,n[0].color.g=t.color.g,n[0].color.b=t.color.b,n[0].opacity=t.color.a,e.strokes=n}function x(e,t,n,o){var a=t.absoluteTransform,r=n.absoluteTransform,i=new v.default(a[0][2],a[1][2]),l=new v.default(r[0][2],r[1][2]),s=0===(u=(u=e).getPluginData(p)).length?null:JSON.parse(u);let c=!0;if(null!==s&&(c=s.nodesAbsoluteTransform[0].x!==i.x||s.nodesAbsoluteTransform[0].y!==i.y||s.nodesAbsoluteTransform[1].x!==l.x||s.nodesAbsoluteTransform[1].y!==l.y),o||c){var a=g.default.GetClosestSnapPoints(t,n),r=a[0].x-a[1].x,u=a[0].y-a[1].y,s=a[0].x-r,o=a[0].y-u;if(e.x=s,e.y=o,y(e).bezier){const d=[0,0],h=[0,0];s=.5*u,o=.5*r;"right"!==a[0]._type&&"left"!==a[0]._type||(d[1]=o,h[1]=u),"top"!==a[0]._type&&"bottom"!==a[0]._type||(d[1]=r,h[1]=s),"right"!==a[1]._type&&"left"!==a[1]._type||(d[0]=o,h[0]=0),"top"!==a[1]._type&&"bottom"!==a[1]._type||(d[0]=0,h[0]=s),e.vectorPaths=[{windingRule:"EVENODD",data:`M 0 0 C ${d[0]} ${h[0]} ${d[1]} ${h[1]} ${r} ${u}`}]}else e.vectorPaths=[{windingRule:"EVENODD",data:`M 0 0 L ${r} ${u}`}];M(e);const f=new w;f.nodesAbsoluteTransform=[i,l],l=f,e.setPluginData(p,JSON.stringify(l)),e.name=`${t.name} -> ${n.name}`}}function k(e,t=!1){var n,o=P(e),a=figma.getNodeById(o[0]),r=figma.getNodeById(o[1]);null===a||null===r?e.remove():(n=a.removed,o=r.removed,n&&_(a),o&&_(r),o||n||x(e,a,r,t))}function E(e,t,n){let o=null;var a,r,i;o=(a=e,r=t,figma.currentPage.findOne(e=>{e=P(e);return 2===e.length&&(e[0]===a.id&&e[1]===r.id)})),null===o&&(o=figma.createVector(),d().appendChild(o)),i=o,n=n,i.setPluginData(s,JSON.stringify(n)),n=o,t=[e.id,t.id],n.setPluginData(l,JSON.stringify(t)),k(o,!0)}t.CreateFlow=E;let I=-1,D=-1,F=-1,C=!1,N=!1;const A=100,T=1e3/30;function R(e=50,t=!1){e<2*T&&(e=2*T),(t||N)&&(-1!==I&&clearInterval(I),I=setInterval(()=>{if(N){const a=O();if(0<a.length)for(let o=0;o<=a.length/A;o++)setTimeout(()=>{let e=o*A,t=e+A;e>=a.length&&(e=a.length-1),t>a.length&&(t=a.length);const n=a.slice(e,t);n.forEach(e=>{null===e||e.removed||k(e)})},o*T)}},e))}function j(){C=!0,(0,a.SetOnSelectionChanged)(e=>{2===e.length&&E(e[0],e[1],S)}),(0,a.SetOnSelectionItemAdded)(e=>{}),(0,a.SetOnSelectionItemRemoved)(e=>{null!==e&&e.removed&&_(e)})}function G(){(C=!1,a.SetOnSelectionChanged)(e=>{}),(0,a.SetOnSelectionItemAdded)(e=>{}),(0,a.SetOnSelectionItemRemoved)(e=>{})}function J(){N=!0,function(){const e=()=>{var e=O()["length"];return e+e/A*T};R(e(),!0),F=setInterval(()=>{N&&R(e())},1e4)}()}function U(){N=!1,-1!==F&&(clearInterval(F),F=-1),-1!==I&&(clearInterval(I),I=-1)}t.EnableFlowEvents=j,t.DisableFlowEvents=G,t.EnableFlowUpdate=J,t.DisableFlowUpdate=U,t.Enable=function(){D=setInterval(()=>{C&&h()},1e3),j(),J()},t.Disable=function(){-1!==D&&(clearInterval(D),D=-1),G(),U()}},522:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UpdateSelection=t.GetSelection=t.SetOnSelectionItemRemoved=t.SetOnSelectionItemAdded=t.SetOnSelectionChanged=void 0;let a=[],n,r,i;function o(){const t=figma.currentPage["selection"];var e=a.length;const o=[];a.length>t.length?(a.forEach((n,e)=>{void 0!==t.find((e,t)=>n.id===e.id)&&o.push(n)}),o.forEach(e=>{r(e)}),a=o):a.length<t.length?t.forEach((n,e)=>{void 0!==a.find((e,t)=>n.id===e.id)||(a.push(n),i(n))}):t.length===a.length&&1===t.length&&t[0].id!==a[0].id&&(o.push(t[0]),i(t[0]),r(a[0]),a=o),1===e&&2===a.length&&n(a)}t.UpdateSelection=o,t.GetSelection=function(){return a},t.SetOnSelectionItemRemoved=function(e){r=e},t.SetOnSelectionItemAdded=function(e){i=e},t.SetOnSelectionChanged=function(e){n=e,figma.on("selectionchange",()=>{o()})}},634:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});class l extends o(n(464)).default{constructor(e,t,n){super(e,t),this._type=n}}function a(e,t){const n=new l(0,0,t);var o=e.rotation*(3.14/180),a=e.absoluteTransform[0][2],r=e.absoluteTransform[1][2];return"top"===t&&(n.x=a+.5*e.width*Math.cos(o),n.y=r-.5*e.width*Math.sin(o)),"right"===t&&(n.x=a+e.width*Math.cos(o)+.5*e.height*Math.sin(o),n.y=r+.5*e.height*Math.cos(o)-e.width*Math.sin(o)),"bottom"===t&&(n.x=a+.5*e.width*Math.cos(o)+e.height*Math.sin(o),n.y=r+e.height*Math.cos(o)-.5*e.width*Math.sin(o)),"left"===t&&(n.x=a+.5*e.height*Math.sin(o),n.y=r+.5*e.height*Math.cos(o)),n}function u(e){const t=[];var n=e.rotation*(3.14/180),o=e.absoluteTransform[0][2],a=e.absoluteTransform[1][2],r=Math.cos(n),i=Math.sin(n),{height:n,width:e}=e;return t.push(new l(o+.5*e*r,a-.5*e*i,"top")),t.push(new l(o+e*r+.5*n*i,a+.5*n*r-e*i,"right")),t.push(new l(o+.5*e*r+n*i,a+n*r-.5*e*i,"bottom")),t.push(new l(o+.5*n*i,a+.5*n*r,"left")),t}t.default={GetSnapPoint:a,GetSnapPointById:function(e,t){return a(e,0===t?"top":1===t?"right":2===t?"bottom":"left")},GetClosestSnapPoints:function(e,t){var n=u(e),o=[n[1],n[3]],a=[n[0],n[2]],r=u(t),i=[r[1],r[3]],e=[r[0],r[2]];const l=(n=function(t,n){const o=[null,null];let a=99999999;for(let e=0;e<2;e++){var r=(e+1)%2,i=t[e].dist(n[r]);i<a&&(o[0]=t[e],o[1]=n[r],a=i)}return[a,o]})(o,i);t=Math.abs(l[1][0].x-l[1][1].x),r=Math.abs(l[1][0].y-l[1][1].y),o=l[1][0].dist(l[1][1]);const s=n(a,e);i=Math.abs(s[1][0].x-s[1][1].x),n=Math.abs(s[1][0].y-s[1][1].y),a=s[1][0].dist(s[1][1]),Math.abs(s[1][0].x-l[1][1].x),Math.abs(s[1][0].y-l[1][1].y),e=s[1][0].dist(l[1][1]);let c=9999999;if(o<c&&(c=o),a<c&&(c=a),e<c&&(c=e),r<1.5*t){r=l[1][0],t=l[1][1];if("right"===r._type?r.x<t.x:r.x>t.x)return[l[1][0],l[1][1]]}return i<2*n?[s[1][0],s[1][1]]:[l[1][0],s[1][1]]}}},464:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e,t){this.x=e,this.y=t}dist(e){var t=this.x-e.x,e=this.y-e.y;return Math.sqrt(t*t+e*e)}}}},a={};(function e(t){var n=a[t];if(void 0!==n)return n.exports;n=a[t]={exports:{}};return o[t].call(n.exports,n,n.exports,e),n.exports})(480)})();