(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{163:function(t,e,n){var content=n(189);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(42).default)("1aa30d58",content,!0,{sourceMap:!1})},164:function(t,e,n){var content=n(191);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(42).default)("20233889",content,!0,{sourceMap:!1})},188:function(t,e,n){"use strict";var o=n(163);n.n(o).a},189:function(t,e,n){(e=n(41)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Inter|Open+Sans&display=swap);"]),e.push([t.i,"body[data-v-abe7ff54]{background-color:#000}.notification[data-v-abe7ff54]{margin:1em 0;background:#cd5c5c;padding:1em;text-align:center;position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);width:90%;-webkit-animation:sad-data-v-abe7ff54 2s ease-in-out forwards;animation:sad-data-v-abe7ff54 2s ease-in-out forwards}@-webkit-keyframes sad-data-v-abe7ff54{0%{opacity:0;bottom:0}30%{opacity:1;bottom:1rem}80%{opacity:1;bottom:1rem}to{opacity:0;bottom:0}}@keyframes sad-data-v-abe7ff54{0%{opacity:0;bottom:0}30%{opacity:1;bottom:1rem}80%{opacity:1;bottom:1rem}to{opacity:0;bottom:0}}.checkcontainer[data-v-abe7ff54]{line-height:20px;display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;font-size:17px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.checkcontainer input[data-v-abe7ff54]{position:absolute;opacity:0;cursor:pointer}.radiobtn[data-v-abe7ff54]{position:absolute;top:0;left:0;height:15px;width:15px;background-color:#eee;margin:2px}.checkcontainer:hover input~.radiobtn[data-v-abe7ff54]{background-color:#ccc}.checkcontainer input:checked~.radiobtn[data-v-abe7ff54]{background-color:#00a355}.checkcontainer input:checked~.radiobtn[data-v-abe7ff54]:after{display:block}.checkcontainer .radiobtn[data-v-abe7ff54]:after{top:9px;left:9px;width:8px;height:8px;border-radius:50%;background:#fff}form[data-v-abe7ff54]{width:80vw;flex-direction:column;font-family:Open Sans,sans-serif;justify-content:center;margin-bottom:2rem}form[data-v-abe7ff54],label[data-v-abe7ff54]{display:flex}label[data-v-abe7ff54]{align-items:center;margin-bottom:1rem;color:#fff}label>svg[data-v-abe7ff54]{margin-left:1.5rem;-webkit-filter:grayscale(100%);filter:grayscale(100%)}input[data-v-abe7ff54]{background-color:transparent;border:none;border-bottom:1px solid #fff;padding:.3rem .3rem .3rem 0;color:#fff;font-family:Inter;letter-spacing:.15rem;margin-bottom:3rem}input[data-v-abe7ff54]:focus{outline:none}input[type=number][data-v-abe7ff54]::-webkit-inner-spin-button,input[type=number][data-v-abe7ff54]::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0}.type[data-v-abe7ff54]{width:100%;display:flex;justify-content:space-evenly;align-items:center;margin-bottom:2rem}.submit-btn[data-v-abe7ff54]{background-color:transparent;color:#00ff85;border:1px solid #00ff85;width:50%;padding:1rem;border-radius:.5rem;align-self:center;font-weight:700;transition:all .3s ease;cursor:pointer}.submit-btn[data-v-abe7ff54]:focus{outline:none}.submit-btn[data-v-abe7ff54]:hover{background-color:#00ff85;color:#000}input[type=number][data-v-abe7ff54]{-moz-appearance:textfield}input[data-v-abe7ff54]::-webkit-inner-spin-button,input[data-v-abe7ff54]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}@media (min-width:700px){form[data-v-abe7ff54]{width:33vw}.submit-btn[data-v-abe7ff54]{width:33%}}",""]),t.exports=e},190:function(t,e,n){"use strict";var o=n(164);n.n(o).a},191:function(t,e,n){(e=n(41)(!1)).push([t.i,".form{width:100%;margin-top:10%;display:flex;justify-content:center;align-items:center}",""]),t.exports=e},218:function(t,e,n){"use strict";n.r(e);n(76),n(105);var o={name:"LoginForm",data:function(){return{notif:!1,notif_msg:""}},methods:{getFormValues:function(t){var e=this,n=t.target.elements,o={};o.phone_number=n[0].value,o.password=n[1].value,o.type=n.radio.value;var r=new Headers;r.append("Content-Type","application/json");var l=JSON.stringify(o);fetch("http://localhost:4000/u/login",{method:"POST",headers:r,body:l,redirect:"follow"}).then((function(t){return t.text()})).then((function(t){null==JSON.parse(t).message?(localStorage.setItem("data",t),"passenger"==o.type?window.location="http://localhost:3000/ride":"driver"==o.type?window.location="http://localhost:3000/drive":(e.notif=!0,setTimeout((function(){return e.notif=!1}),2e3))):(e.notif=!0,setTimeout((function(){return e.notif=!1}),2e3),e.notif_msg=JSON.parse(t).message)})).catch((function(t){return console.log("error",t)}))}},mounted:function(){if(null!=localStorage.data){var t=JSON.parse(localStorage.data).token.split(".")[1].replace("-","+").replace("_","/"),e=JSON.parse(window.atob(t));e.exp<Date.now()/1e3?localStorage.clear():"driver"==e.type?window.location="http://localhost:3000/drive":window.location="http://localhost:3000/ride"}var n=document.querySelectorAll("input");n[0].addEventListener("keyup",(function(t){n[0].value.length>9&&n[0].value.length<13?n[0].previousElementSibling.children[1].setAttribute("style","filter: none"):n[0].previousElementSibling.children[1].setAttribute("style","filter: greyscale(100%)")})),n[1].addEventListener("keyup",(function(t){n[1].value.length>7?n[1].previousElementSibling.children[1].setAttribute("style","filter: none"):n[1].previousElementSibling.children[1].setAttribute("style","filter: greyscale(100%)")}))}},r=(n(188),n(13)),l={components:{LoginForm:Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{on:{submit:function(e){return e.preventDefault(),t.getFormValues(e)}}},[1==t.notif?n("span",{staticClass:"notification"},[t._v(t._s(t.notif_msg))]):t._e(),t._v(" "),n("label",{attrs:{for:"phone_number"}},[n("span",{staticClass:"form-label"},[t._v("\n      Phone Number\n    ")]),t._v(" "),n("svg",{attrs:{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"}},[n("circle",{attrs:{cx:"8",cy:"8",r:"7.5",stroke:"#00FF85"}}),t._v(" "),n("path",{attrs:{d:"M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921",stroke:"#00FF85"}})])]),t._v(" "),n("input",{attrs:{required:"",type:"number",name:"phone_number"}}),t._v(" "),n("label",{attrs:{for:"password"}},[n("span",{staticClass:"form-label"},[t._v("\n      Password\n    ")]),t._v(" "),n("svg",{attrs:{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"}},[n("circle",{attrs:{cx:"8",cy:"8",r:"7.5",stroke:"#00FF85"}}),t._v(" "),n("path",{attrs:{d:"M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921",stroke:"#00FF85"}})])]),t._v(" "),n("input",{attrs:{required:"",type:"password",name:"password"}}),t._v(" "),t._m(0),t._v(" "),n("button",{staticClass:"submit-btn",attrs:{type:"submit"}},[t._v("\n    Login\n  ")])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"type"},[e("label",{staticClass:"checkcontainer"},[this._v("Passenger\n      "),e("input",{attrs:{type:"radio",checked:"checked",name:"radio",value:"passenger"}}),this._v(" "),e("span",{staticClass:"radiobtn"})]),this._v(" "),e("label",{staticClass:"checkcontainer"},[this._v("Driver\n      "),e("input",{attrs:{type:"radio",checked:"checked",name:"radio",value:"driver"}}),this._v(" "),e("span",{staticClass:"radiobtn"})])])}],!1,null,"abe7ff54",null).exports}},c=(n(190),Object(r.a)(l,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"form"},[e("LoginForm")],1)}),[],!1,null,null,null));e.default=c.exports}}]);