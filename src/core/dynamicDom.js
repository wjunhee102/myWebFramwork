"use strict";
// type Dom = HTMLElement | Text;
// type Child = Element | string;
// interface Element {
//   type: string;
//   props: any;
//   children: Element[];
// }
// interface Fiber {
//   dom: Dom;
//   element: {
//     type: Element["type"],
//     props: Element["props"]
//   };
//   key: number;
//   children: Fiber[];
// }
// let classObj:any = null;
// const isEvent = (key:string) => 
//   key.startsWith("on");
// const isKey = (key:string) => 
//   key === "key";
// const isDataset = (key:string) =>
//   key === "dataset";
// const isProperty = (key:string) => 
//   key !== "children" && !isEvent(key) && !isKey(key) && !isDataset(key); 
// const isNew = (prev:any, next:any) => 
//   (key:string) => prev[key] !== next[key];
// const isGone = (prev:any, next:any) => 
//   (key:string) => !(key in next);
// export class Component {};
// function createElement( 
//   type: any, 
//   props: object | null, 
//   ...children: Child[]
//   ): Element {
//   if (typeof type === "function") {
//     if(type.prototype instanceof Component) {
//       if(!classObj) {
//         classObj = new type();
//       }
//       classObj.setState();
//       return classObj.render();
//     } else {
//       return type.apply(null,[props, ...children]);
//     }
//   } 
//   return {
//     type: type,
//     props: {
//       ...props
//     },
//     children: children? children.map(child =>
//       typeof child === "object" 
//         ? child 
//         : this.createTextElement(child))
//       : []
//   }
// }
// function render(element: Element | Element[], container: any):void {
//   if(Array.isArray(element)) {
//     element.forEach((ele: Element, idx) => {
//       this.addFiberList(ele, idx);
//     })
//   } else {
//     this.addFiberList(element, 1);
//   }
//   const keyList:number[] = this.nextFiberList.map(fiber => fiber.key);
//   this.removeDomList(keyList, this.currentFiberList, container);
//   this.nextFiberList.forEach(nextFiber => {
//     const preFiber: Fiber = this.currentFiberList.filter(fiber => 
//         fiber.key === nextFiber.key
//       )[0];
//     if(!preFiber) {
//       container.appendChild(nextFiber.dom)
//     }
//   });
//   this.currentFiberList = [...this.nextFiberList];
//   this.nextFiberList = [];
// }
// const DynamicDom = (()=> {
//   this.currentFiberList = [];
//   this.nextFiberList = [];
//   return ():any=> {
//     return {
//       createElement,
//       render
//     }
//   }
// })
// export default DynamicDom;
