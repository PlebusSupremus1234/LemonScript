"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[7318],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return p}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var m=r.createContext({}),c=function(e){var n=r.useContext(m),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},d=function(e){var n=c(e.components);return r.createElement(m.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},s=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,m=e.parentName,d=u(e,["components","mdxType","originalType","parentName"]),s=c(t),p=o,f=s["".concat(m,".").concat(p)]||s[p]||l[p]||a;return t?r.createElement(f,i(i({ref:n},d),{},{components:t})):r.createElement(f,i({ref:n},d))}));function p(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=s;var u={};for(var m in n)hasOwnProperty.call(n,m)&&(u[m]=n[m]);u.originalType=e,u.mdxType="string"==typeof e?e:o,i[1]=u;for(var c=2;c<a;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}s.displayName="MDXCreateElement"},6529:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return m},metadata:function(){return c},toc:function(){return d},default:function(){return s}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),i=["components"],u={},m="Random Module",c={unversionedId:"documentation/modules/random",id:"documentation/modules/random",isDocsHomePage:!1,title:"Random Module",description:"The random module can be imported with the name random and has the following methods:",source:"@site/docs/documentation/modules/random.md",sourceDirName:"documentation/modules",slug:"/documentation/modules/random",permalink:"/LemonScript/docs/documentation/modules/random",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/documentation/modules/random.md",version:"current",frontMatter:{},sidebar:"documentation",previous:{title:"Modules",permalink:"/LemonScript/docs/documentation/modules/modules"},next:{title:"Math Module",permalink:"/LemonScript/docs/documentation/modules/math"}},d=[],l={toc:d};function s(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"random-module"},"Random Module"),(0,a.kt)("p",null,"The random module can be imported with the name ",(0,a.kt)("inlineCode",{parentName:"p"},"random")," and has the following methods:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"randint(min, max)")," - Returns a random integer between the two values (inclusive). "),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"randGauss(<mean>, <standarddev>)")," - Returns a random number fitting a Gaussian, or normal, distribution. If a mean argument isn't passed, it sets the mean to 0. If a standard deviation argument isn't passed, it sets the standard deviation to 1."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"random(<min, max>)")," - Returns a random decimal between the two values (inclusive). If no arguments are passed, then its between 0 and 1.")))}s.isMDXComponent=!0}}]);