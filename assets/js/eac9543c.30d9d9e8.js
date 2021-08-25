"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[5083],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=r.createContext({}),s=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},p=function(e){var n=s(e.components);return r.createElement(u.Provider,{value:n},e.children)},f={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),l=s(t),m=o,b=l["".concat(u,".").concat(m)]||l[m]||f[m]||i;return t?r.createElement(b,c(c({ref:n},p),{},{components:t})):r.createElement(b,c({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,c=new Array(i);c[0]=l;var a={};for(var u in n)hasOwnProperty.call(n,u)&&(a[u]=n[u]);a.originalType=e,a.mdxType="string"==typeof e?e:o,c[1]=a;for(var s=2;s<i;s++)c[s]=t[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},6841:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return p},default:function(){return l}});var r=t(7462),o=t(3366),i=(t(7294),t(3905)),c=["components"],a={},u="Fibonacci",s={unversionedId:"examples/functions/fibonacci",id:"examples/functions/fibonacci",isDocsHomePage:!1,title:"Fibonacci",description:"`js",source:"@site/docs/examples/functions/fibonacci.md",sourceDirName:"examples/functions",slug:"/examples/functions/fibonacci",permalink:"/LemonScript/docs/examples/functions/fibonacci",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/examples/functions/fibonacci.md",version:"current",frontMatter:{},sidebar:"examples",previous:{title:"Case Changer",permalink:"/LemonScript/docs/examples/functions/casechanger"},next:{title:"FizzBuzz",permalink:"/LemonScript/docs/examples/functions/fizzbuzz"}},p=[],f={toc:p};function l(e){var n=e.components,t=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},f,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"fibonacci"},"Fibonacci"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"func fib(num: Number): Number {\n    if (num <= 1) return num\n    return fib(num - 1) + fib(num - 2)\n}\n\nfor (var i = 0; i < 10; i += 1) print(fib(i))\n")),(0,i.kt)("p",null,"A recursive function that calls itself to calculate the nth number in the fibonacci sequence. This is a simple approach, but not very efficient on high values of n."))}l.isMDXComponent=!0}}]);