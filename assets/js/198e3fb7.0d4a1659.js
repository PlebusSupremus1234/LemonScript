"use strict";(self.webpackChunklemon_script_documentation=self.webpackChunklemon_script_documentation||[]).push([[441],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),m=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=m(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),c=m(n),d=a,k=c["".concat(l,".").concat(d)]||c[d]||s[d]||o;return n?r.createElement(k,i(i({ref:t},u),{},{components:n})):r.createElement(k,i({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=c;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var m=2;m<o;m++)i[m]=n[m];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},691:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return p},contentTitle:function(){return l},metadata:function(){return m},toc:function(){return u},default:function(){return c}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],p={},l="Operators",m={unversionedId:"documentation/operations/operators",id:"documentation/operations/operators",isDocsHomePage:!1,title:"Operators",description:"Arithmetic Operators",source:"@site/docs/documentation/operations/operators.md",sourceDirName:"documentation/operations",slug:"/documentation/operations/operators",permalink:"/LemonScript/docs/documentation/operations/operators",editUrl:"https://github.com/PlebusSupremus1234/LemonScript/website/docs/documentation/operations/operators.md",version:"current",frontMatter:{},sidebar:"documentation",previous:{title:"Types",permalink:"/LemonScript/docs/documentation/types"},next:{title:"Order of Operations",permalink:"/LemonScript/docs/documentation/operations/order-of-operations"}},u=[{value:"Arithmetic Operators",id:"arithmetic-operators",children:[]},{value:"Comparison Operators",id:"comparison-operators",children:[]}],s={toc:u};function c(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"operators"},"Operators"),(0,o.kt)("h3",{id:"arithmetic-operators"},"Arithmetic Operators"),(0,o.kt)("p",null,"In LemonScript, there are a variety of operations such as ",(0,o.kt)("inlineCode",{parentName:"p"},"+"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"-"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"*")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"/"),". Here is a list of all of them and what they do:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"+")," - The plus operator can add a number or string to another number or string. For example ",(0,o.kt)("inlineCode",{parentName:"p"},"5 + 6")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"11"),", and ",(0,o.kt)("inlineCode",{parentName:"p"},'"Hi I\'m " + "Bob"')," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"Hi I'm Bob"),". If either value is a string, it'll treat both values a string. ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"-")," - The minus operator can only subtract a number from another. For example ",(0,o.kt)("inlineCode",{parentName:"p"},"13.6 - 7.2")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"6.4"),". ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"*")," - The multiplication operator can either multiply two numbers, for example ",(0,o.kt)("inlineCode",{parentName:"p"},"4 * 7")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"28"),", or a string multiplied by a number, for example ",(0,o.kt)("inlineCode",{parentName:"p"},'"hi" * 3')," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"hihihi"),". ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"/")," - The divide operator can only divide a number from another number, for example ",(0,o.kt)("inlineCode",{parentName:"p"},"12 / 3")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"4"),". ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"%")," - The modulus operator returns the remainder when a number is divided by another number. For example, ",(0,o.kt)("inlineCode",{parentName:"p"},"14 % 4")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"2")," because the highest multiple of 4 is 12, and ",(0,o.kt)("inlineCode",{parentName:"p"},"14 - 12")," is 2. ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"^")," - The caret operator exponentializes a number to another number. For example ",(0,o.kt)("inlineCode",{parentName:"p"},"2 ^ 3")," will return ",(0,o.kt)("inlineCode",{parentName:"p"},"8"),". Other types will throw an error. "))),(0,o.kt)("h3",{id:"comparison-operators"},"Comparison Operators"),(0,o.kt)("p",null,"These operators return a boolean value (true or false) when comparing two expressions. "),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"<")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"<=")," - The less or less or equal than operators check two numbers to another, and if they're less or equal. For example, ",(0,o.kt)("inlineCode",{parentName:"p"},"4 < 5")," returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),", but ",(0,o.kt)("inlineCode",{parentName:"p"},"14 < 8")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),". The ",(0,o.kt)("inlineCode",{parentName:"p"},"<=")," operator does the same thing, but also checks for equality, i.e ",(0,o.kt)("inlineCode",{parentName:"p"},"6 <= 6")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),".")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},">")," or ",(0,o.kt)("inlineCode",{parentName:"p"},">=")," - The greater or greater or equal than operators check two numbers to another, and if they're greater or equal. For example, ",(0,o.kt)("inlineCode",{parentName:"p"},"12 > 6")," returns ",(0,o.kt)("inlineCode",{parentName:"p"},"true"),", but ",(0,o.kt)("inlineCode",{parentName:"p"},"14 > 12")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),". The ",(0,o.kt)("inlineCode",{parentName:"p"},">=")," operator does the same thing, but also checks for equality. ")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"==")," - The equals operator checks if two values have the same type, and the same value. For example, ",(0,o.kt)("inlineCode",{parentName:"p"},'"hello" == "hello"')," is true, but ",(0,o.kt)("inlineCode",{parentName:"p"},'"5" == 5')," or ",(0,o.kt)("inlineCode",{parentName:"p"},"23 == 41.2")," are not."))))}c.isMDXComponent=!0}}]);