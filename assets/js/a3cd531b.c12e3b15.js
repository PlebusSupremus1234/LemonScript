"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[344],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),m=s(n),f=o,y=m["".concat(u,".").concat(f)]||m[f]||l[f]||i;return n?r.createElement(y,c(c({ref:t},p),{},{components:n})):r.createElement(y,c({ref:t},p))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,c=new Array(i);c[0]=m;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a.mdxType="string"==typeof e?e:o,c[1]=a;for(var s=2;s<i;s++)c[s]=n[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7074:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return u},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),c=["components"],a={},u="Function Types",s={unversionedId:"documentation/static-types/function-types",id:"documentation/static-types/function-types",isDocsHomePage:!1,title:"Function Types",description:"In LemonScript, functions can have types too. Firstly, lets talk about the function return types. The compiler will throw an error if it recieves a return type that doesn't match the function's return type. You can set the return types to a function like this:",source:"@site/docs/documentation/static-types/function-types.md",sourceDirName:"documentation/static-types",slug:"/documentation/static-types/function-types",permalink:"/LemonScript/docs/documentation/static-types/function-types",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/documentation/static-types/function-types.md",version:"current",frontMatter:{},sidebar:"documentation",previous:{title:"Variable Types",permalink:"/LemonScript/docs/documentation/static-types/variable-types"},next:{title:"Classes",permalink:"/LemonScript/docs/documentation/classes"}},p=[],l={toc:p};function m(e){var t=e.components,n=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"function-types"},"Function Types"),(0,i.kt)("p",null,"In LemonScript, functions can have types too. Firstly, lets talk about the function return types. The compiler will throw an error if it recieves a return type that doesn't match the function's return type. You can set the return types to a function like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"func [function name]([args]): [type1] | [type2] ... {\n    [code]\n}\n")),(0,i.kt)("p",null,"If no return type is specified, then the return type is automatically set to ",(0,i.kt)("inlineCode",{parentName:"p"},"Any"),", allowing any return type. "),(0,i.kt)("p",null,"You can also set types for the arguments of a function. For example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'func addNums(num1: Number, num2: Number): Number {\n    return num1 + num2\n}\n\nprint(addNums(1, "two"))\n')),(0,i.kt)("p",null,"This script will error because the second argument passed into the ",(0,i.kt)("inlineCode",{parentName:"p"},"addNums")," function is not a number type, as required in the function args."))}m.isMDXComponent=!0}}]);