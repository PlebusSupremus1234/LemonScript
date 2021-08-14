"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[7666],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),m=c(n),f=o,d=m["".concat(p,".").concat(f)]||m[f]||s[f]||l;return n?r.createElement(d,i(i({ref:t},u),{},{components:n})):r.createElement(d,i({ref:t},u))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,i=new Array(l);i[0]=m;var a={};for(var p in t)hasOwnProperty.call(t,p)&&(a[p]=t[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var c=2;c<l;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2349:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return m}});var r=n(7462),o=n(3366),l=(n(7294),n(3905)),i=["components"],a={},p="While Loop",c={unversionedId:"examples/loops/while-loop",id:"examples/loops/while-loop",isDocsHomePage:!1,title:"While Loop",description:"`js",source:"@site/docs/examples/loops/while-loop.md",sourceDirName:"examples/loops",slug:"/examples/loops/while-loop",permalink:"/LemonScript/docs/examples/loops/while-loop",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/examples/loops/while-loop.md",version:"current",frontMatter:{},sidebar:"examples",previous:{title:"For Loop",permalink:"/LemonScript/docs/examples/loops/for-loop"},next:{title:"Random Module",permalink:"/LemonScript/docs/examples/modules/random"}},u=[],s={toc:u};function m(e){var t=e.components,n=(0,o.Z)(e,i);return(0,l.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"while-loop"},"While Loop"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"var a = 0\n\nwhile (a < 10) {\n    print(a)\n    a += 1\n}\n")),(0,l.kt)("p",null,"Simple while loop that has a variable a starting at 0, and incrementing by one until its bigger than 10."))}m.isMDXComponent=!0}}]);