"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[631],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=o.createContext({}),c=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return o.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},f=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),f=c(n),m=r,d=f["".concat(p,".").concat(m)]||f[m]||s[m]||i;return n?o.createElement(d,a(a({ref:t},u),{},{components:n})):o.createElement(d,a({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=f;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var c=2;c<i;c++)a[c]=n[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}f.displayName="MDXCreateElement"},9733:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return f}});var o=n(7462),r=n(3366),i=(n(7294),n(3905)),a=["components"],l={},p="For Loop",c={unversionedId:"documentation/loops/for-loop",id:"documentation/loops/for-loop",isDocsHomePage:!1,title:"For Loop",description:"A for loop is a refactored while loop with a different syntax:",source:"@site/docs/documentation/loops/for-loop.md",sourceDirName:"documentation/loops",slug:"/documentation/loops/for-loop",permalink:"/LemonScript/docs/documentation/loops/for-loop",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/documentation/loops/for-loop.md",version:"current",frontMatter:{},sidebar:"documentation",previous:{title:"While Loop",permalink:"/LemonScript/docs/documentation/loops/while-loop"},next:{title:"Print Function",permalink:"/LemonScript/docs/documentation/inbuilt-functions/print"}},u=[],s={toc:u};function f(e){var t=e.components,n=(0,r.Z)(e,a);return(0,i.kt)("wrapper",(0,o.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"for-loop"},"For Loop"),(0,i.kt)("p",null,"A for loop is a refactored while loop with a different syntax:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"for ([variable]; [condition]; [increment]) {\n    [code]\n}\n")),(0,i.kt)("p",null,"Essentially, it is just a while loop worded differently for readibility. The while loop below does the same as the for loop:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"[variable]\nwhile ([condition]) {\n    [code]\n    [increment]\n}\n")),(0,i.kt)("p",null,"The variable can be a variable declaration, or an existing variable. The loop will execute while the condition is true. The increment is executed at the end of each loop. An example of a for loop is:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"for (var i = 0; i < 5; i = i + 1) print(i)\n")),(0,i.kt)("p",null,"This loop will output ",(0,i.kt)("inlineCode",{parentName:"p"},"0"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"1"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"2"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"3"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"4"),". You can also remove the variable clause if you have a pre existing variable, for example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"var a = 0\nfor (; a < 5; a = a + 1) print(a)\n")))}f.isMDXComponent=!0}}]);