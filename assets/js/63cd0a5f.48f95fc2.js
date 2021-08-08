"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[792],{3905:function(t,e,n){n.d(e,{Zo:function(){return c},kt:function(){return h}});var r=n(7294);function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function p(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},a=Object.keys(t);for(r=0;r<a.length;r++)n=a[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(r=0;r<a.length;r++)n=a[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}var m=r.createContext({}),s=function(t){var e=r.useContext(m),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},c=function(t){var e=s(t.components);return r.createElement(m.Provider,{value:e},t.children)},l={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},u=r.forwardRef((function(t,e){var n=t.components,o=t.mdxType,a=t.originalType,m=t.parentName,c=p(t,["components","mdxType","originalType","parentName"]),u=s(n),h=o,d=u["".concat(m,".").concat(h)]||u[h]||l[h]||a;return n?r.createElement(d,i(i({ref:e},c),{},{components:n})):r.createElement(d,i({ref:e},c))}));function h(t,e){var n=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var a=n.length,i=new Array(a);i[0]=u;var p={};for(var m in e)hasOwnProperty.call(e,m)&&(p[m]=e[m]);p.originalType=t,p.mdxType="string"==typeof t?t:o,i[1]=p;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1843:function(t,e,n){n.r(e),n.d(e,{frontMatter:function(){return p},contentTitle:function(){return m},metadata:function(){return s},toc:function(){return c},default:function(){return u}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],p={},m="Math Module",s={unversionedId:"examples/modules/math",id:"examples/modules/math",isDocsHomePage:!1,title:"Math Module",description:"`js",source:"@site/docs/examples/modules/math.md",sourceDirName:"examples/modules",slug:"/examples/modules/math",permalink:"/LemonScript/docs/examples/modules/math",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/examples/modules/math.md",version:"current",frontMatter:{},sidebar:"examples",previous:{title:"Random Module",permalink:"/LemonScript/docs/examples/modules/random"},next:{title:"Function Types",permalink:"/LemonScript/docs/examples/types/function"}},c=[],l={toc:c};function u(t){var e=t.components,n=(0,o.Z)(t,i);return(0,a.kt)("wrapper",(0,r.Z)({},l,n,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"math-module"},"Math Module"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'\nimport math\n\nprint("Constants/Properties")\nprint(math.PI)\nprint(math.E)\nprint(math.PHI)\nprint(math.SQRT2)\n\n# ---------------\nprint("Methods")\nprint(math.absolute(-5)) # 5\nprint(math.round(12.4)) # 12\nprint(math.floor(4.8)) # 4\nprint(math.ceil(0.3)) # 1\n\n# ---------------\nprint("Trigonometry Methods (Input values in radians)")\nprint(math.sin(math.PI / 2)) # 1\nprint(math.cos(math.PI / 3)) # 0.5\nprint(math.tan(math.PI / 4)) # 1\nprint(math.asin(1 / 2)) # pi / 6 or ~ 0.524\nprint(math.acos(math.sqrt(2) / 2)) # pi / 4 or ~ 0.785\nprint(math.atan(math.sqrt(3))) # pi / 3 or ~ 1.047\n\n# ---------------\nprint("Converting Between Radians & Degrees")\nprint(math.radtodeg(math.PI / 2)) # 90\nprint(math.degtorad(45)) # pi / 4 or ~ 0.785\n\n# ---------------\nprint("Logarithms")\nprint(math.log(32, 2)) # Base 2\nprint(math.log(8, 10)) # Base 10\nprint(math.log(15.5)) # Natural Base (E)\n\n# ---------------\nprint("Roots & Powers")\nprint(math.sqrt(64)) # 8\nprint(math.power(4, 2)) # 4 ^ 2 = 16\nprint(math.root(27, 3)) # 3\n\n# ---------------\nprint("Other")\nprint(math.factorial(4)) # 4 * 3 * 2 * 1 = 24\nprint(math.min(12, 5.5, 2.9, -5, 2)) # -5\nprint(math.max(18, 46, 2.3, 19, 30.3)) # 46\n')),(0,a.kt)("p",null,"A list of all the methods and constants that the math module has to offer."))}u.isMDXComponent=!0}}]);