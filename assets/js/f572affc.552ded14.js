"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[7777],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=r.createContext({}),s=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=s(e.components);return r.createElement(u.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=s(t),m=o,g=f["".concat(u,".").concat(m)]||f[m]||l[m]||a;return t?r.createElement(g,i(i({ref:n},p),{},{components:t})):r.createElement(g,i({ref:n},p))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=f;var c={};for(var u in n)hasOwnProperty.call(n,u)&&(c[u]=n[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var s=2;s<a;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},4063:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return p},default:function(){return f}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),i=["components"],c={},u="Case Changer",s={unversionedId:"examples/functions/casechanger",id:"examples/functions/casechanger",isDocsHomePage:!1,title:"Case Changer",description:"`js",source:"@site/docs/examples/functions/casechanger.md",sourceDirName:"examples/functions",slug:"/examples/functions/casechanger",permalink:"/LemonScript/docs/examples/functions/casechanger",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/examples/functions/casechanger.md",version:"current",frontMatter:{},sidebar:"examples",previous:{title:"Subclass",permalink:"/LemonScript/docs/examples/classes/subclass"},next:{title:"Fibonacci",permalink:"/LemonScript/docs/examples/functions/fibonacci"}},p=[],l={toc:p};function f(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"case-changer"},"Case Changer"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'func alternateCase(input: String): String {\n    var output: String = ""\n\n    for (var i = 0; i < input.length; i += 1) {\n        if (input.get(i).lower() != input.get(i)) output += input.get(i).lower()\n        else output += input.get(i).upper()\n    }\n\n    return output\n}\n\nprint(alternateCase("Hello World!")) # hELLO wORLD!\nprint(alternateCase("TeeEEEsssTTTtT!")) # tEEeeeSSStttTt!\n')),(0,a.kt)("p",null,"This code loops over the input string and changes the case of each character to the opposite of what it is. "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import random\n\nfunc randomCase(input: String): String {\n    var output: String = ""\n    \n    for (var i = 0; i < input.length; i += 1) {\n        if (random.randint(1, 2) == 1) output += input.get(i).upper()\n        else output += input.get(i).lower()\n    }\n\n    return output\n}\n\nprint(randomCase("The quick brown fox jumps over the lazy dog!"))\n')),(0,a.kt)("p",null,"This code loops over the input string, and randomly uppercases or lowercases the characters."))}f.isMDXComponent=!0}}]);