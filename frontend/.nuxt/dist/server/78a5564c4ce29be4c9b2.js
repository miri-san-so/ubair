exports.ids=[4],exports.modules={32:function(e,t,n){var content=n(58);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);var o=n(4).default;e.exports.__inject__=function(e){o("1aa30d58",content,!0,e)}},33:function(e,t,n){var content=n(60);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);var o=n(4).default;e.exports.__inject__=function(e){o("20233889",content,!0,e)}},57:function(e,t,n){"use strict";n.r(t);var o=n(32),r=n.n(o);for(var f in o)"default"!==f&&function(e){n.d(t,e,(function(){return o[e]}))}(f);t.default=r.a},58:function(e,t,n){(t=n(3)(!1)).push([e.i,"@import url(https://fonts.googleapis.com/css?family=Inter|Open+Sans&display=swap);"]),t.push([e.i,"body[data-v-abe7ff54]{background-color:#000}.notification[data-v-abe7ff54]{margin:1em 0;background:#cd5c5c;padding:1em;text-align:center;position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);width:90%;-webkit-animation:sad-data-v-abe7ff54 2s ease-in-out forwards;animation:sad-data-v-abe7ff54 2s ease-in-out forwards}@-webkit-keyframes sad-data-v-abe7ff54{0%{opacity:0;bottom:0}30%{opacity:1;bottom:1rem}80%{opacity:1;bottom:1rem}to{opacity:0;bottom:0}}@keyframes sad-data-v-abe7ff54{0%{opacity:0;bottom:0}30%{opacity:1;bottom:1rem}80%{opacity:1;bottom:1rem}to{opacity:0;bottom:0}}.checkcontainer[data-v-abe7ff54]{line-height:20px;display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;font-size:17px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.checkcontainer input[data-v-abe7ff54]{position:absolute;opacity:0;cursor:pointer}.radiobtn[data-v-abe7ff54]{position:absolute;top:0;left:0;height:15px;width:15px;background-color:#eee;margin:2px}.checkcontainer:hover input~.radiobtn[data-v-abe7ff54]{background-color:#ccc}.checkcontainer input:checked~.radiobtn[data-v-abe7ff54]{background-color:#00a355}.checkcontainer input:checked~.radiobtn[data-v-abe7ff54]:after{display:block}.checkcontainer .radiobtn[data-v-abe7ff54]:after{top:9px;left:9px;width:8px;height:8px;border-radius:50%;background:#fff}form[data-v-abe7ff54]{width:80vw;flex-direction:column;font-family:Open Sans,sans-serif;justify-content:center;margin-bottom:2rem}form[data-v-abe7ff54],label[data-v-abe7ff54]{display:flex}label[data-v-abe7ff54]{align-items:center;margin-bottom:1rem;color:#fff}label>svg[data-v-abe7ff54]{margin-left:1.5rem;-webkit-filter:grayscale(100%);filter:grayscale(100%)}input[data-v-abe7ff54]{background-color:transparent;border:none;border-bottom:1px solid #fff;padding:.3rem .3rem .3rem 0;color:#fff;font-family:Inter;letter-spacing:.15rem;margin-bottom:3rem}input[data-v-abe7ff54]:focus{outline:none}input[type=number][data-v-abe7ff54]::-webkit-inner-spin-button,input[type=number][data-v-abe7ff54]::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0}.type[data-v-abe7ff54]{width:100%;display:flex;justify-content:space-evenly;align-items:center;margin-bottom:2rem}.submit-btn[data-v-abe7ff54]{background-color:transparent;color:#00ff85;border:1px solid #00ff85;width:50%;padding:1rem;border-radius:.5rem;align-self:center;font-weight:700;transition:all .3s ease;cursor:pointer}.submit-btn[data-v-abe7ff54]:focus{outline:none}.submit-btn[data-v-abe7ff54]:hover{background-color:#00ff85;color:#000}input[type=number][data-v-abe7ff54]{-moz-appearance:textfield}input[data-v-abe7ff54]::-webkit-inner-spin-button,input[data-v-abe7ff54]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}@media (min-width:700px){form[data-v-abe7ff54]{width:33vw}.submit-btn[data-v-abe7ff54]{width:33%}}",""]),e.exports=t},59:function(e,t,n){"use strict";n.r(t);var o=n(33),r=n.n(o);for(var f in o)"default"!==f&&function(e){n.d(t,e,(function(){return o[e]}))}(f);t.default=r.a},60:function(e,t,n){(t=n(3)(!1)).push([e.i,".form{width:100%;margin-top:10%;display:flex;justify-content:center;align-items:center}",""]),e.exports=t},82:function(e,t,n){"use strict";n.r(t);var o={name:"LoginForm",data:()=>({notif:!1,notif_msg:""}),methods:{getFormValues(e){let t=e.target.elements,n={};n.phone_number=t[0].value,n.password=t[1].value,n.type=t.radio.value;var o=new Headers;o.append("Content-Type","application/json");var r=JSON.stringify(n);fetch("http://localhost:4000/u/login",{method:"POST",headers:o,body:r,redirect:"follow"}).then(e=>e.text()).then(e=>{null==JSON.parse(e).message?(localStorage.setItem("data",e),"passenger"==n.type?window.location="http://localhost:3000/ride":"driver"==n.type?window.location="http://localhost:3000/drive":(this.notif=!0,setTimeout(()=>this.notif=!1,2e3))):(this.notif=!0,setTimeout(()=>this.notif=!1,2e3),this.notif_msg=JSON.parse(e).message)}).catch(e=>console.log("error",e))}},mounted(){if(null!=localStorage.data){var e=JSON.parse(localStorage.data).token.split(".")[1].replace("-","+").replace("_","/");let t=JSON.parse(window.atob(e));t.exp<Date.now()/1e3?localStorage.clear():"driver"==t.type?window.location="http://localhost:3000/drive":window.location="http://localhost:3000/ride"}let t=document.querySelectorAll("input");t[0].addEventListener("keyup",e=>{t[0].value.length>9&&t[0].value.length<13?t[0].previousElementSibling.children[1].setAttribute("style","filter: none"):t[0].previousElementSibling.children[1].setAttribute("style","filter: greyscale(100%)")}),t[1].addEventListener("keyup",e=>{t[1].value.length>7?t[1].previousElementSibling.children[1].setAttribute("style","filter: none"):t[1].previousElementSibling.children[1].setAttribute("style","filter: greyscale(100%)")})}},r=n(1);var f={components:{LoginForm:Object(r.a)(o,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("form",{on:{submit:function(t){return t.preventDefault(),e.getFormValues(t)}}},[e._ssrNode((1==e.notif?'<span class="notification" data-v-abe7ff54>'+e._ssrEscape(e._s(e.notif_msg))+"</span>":"\x3c!----\x3e")+' <label for="phone_number" data-v-abe7ff54><span class="form-label" data-v-abe7ff54>\n      Phone Number\n    </span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-abe7ff54><circle cx="8" cy="8" r="7.5" stroke="#00FF85" data-v-abe7ff54></circle> <path d="M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921" stroke="#00FF85" data-v-abe7ff54></path></svg></label> <input required="required" type="number" name="phone_number" data-v-abe7ff54> <label for="password" data-v-abe7ff54><span class="form-label" data-v-abe7ff54>\n      Password\n    </span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-abe7ff54><circle cx="8" cy="8" r="7.5" stroke="#00FF85" data-v-abe7ff54></circle> <path d="M4.47046 8.49803L6.47046 10.498C7.99987 8.6549 8.70575 7.88237 11.5293 5.43921" stroke="#00FF85" data-v-abe7ff54></path></svg></label> <input required="required" type="password" name="password" data-v-abe7ff54> <div class="type" data-v-abe7ff54><label class="checkcontainer" data-v-abe7ff54>Passenger\n      <input type="radio" checked="checked" name="radio" value="passenger" data-v-abe7ff54> <span class="radiobtn" data-v-abe7ff54></span></label> <label class="checkcontainer" data-v-abe7ff54>Driver\n      <input type="radio" checked="checked" name="radio" value="driver" data-v-abe7ff54> <span class="radiobtn" data-v-abe7ff54></span></label></div> <button type="submit" class="submit-btn" data-v-abe7ff54>\n    Login\n  </button>')])}),[],!1,(function(e){var t=n(57);t.__inject__&&t.__inject__(e)}),"abe7ff54","bf43416a").exports}};var l=Object(r.a)(f,(function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"form"},[t("LoginForm")],1)}),[],!1,(function(e){var t=n(59);t.__inject__&&t.__inject__(e)}),null,"16a6395a");t.default=l.exports}};