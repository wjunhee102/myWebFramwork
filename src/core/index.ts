type Dom = HTMLElement | Text;

type Child = Element | string;

interface Element {
  type: string;
  props: any;
  children: Element[];
}

interface Fiber {
  dom: Dom;
  element: {
    type: Element["type"],
    props: Element["props"]
  };
  key: number;
  children: Fiber[];
}

// type ObjectKeys<T> = 
//   T extends object ? (keyof T)[] :
//   T extends number ? [] :
//   T extends Array<any> | string ? string[] : any;

// interface ObjectConstructor {
//   keys<T>(o: T): ObjectKeys<T>
// }

const isEvent = (key:string) => 
  key.startsWith("on");
const isKey = (key:string) => 
  key === "key";
const isDataset = (key:string) =>
  key === "dataset";
const isProperty = (key:string) => 
  key !== "children" && !isEvent(key) && !isKey(key) && !isDataset(key); 
const isNew = (prev:any, next:any) => 
  (key:string) => prev[key] !== next[key];
const isGone = (prev:any, next:any) => 
  (key:string) => !(key in next);

export class Component {};

let classObj:any = null;

class DynamicDom {
  // fiber
  currentFiberList: Fiber[] = [];
  nextFiberList: Fiber[] = [];

  // temp
  

  constructor() {}
  
  static createElement( 
    type: any, 
    props: object | null, 
    ...children: Child[]
    ): Element {
    
    if (typeof type === "function") {
      if(type.prototype instanceof Component) {
        if(!classObj) {
          classObj = new type();
        }
        return classObj.render();
      } else {
        return type.apply(null,[props, ...children]);
      }
    } 

    return {
      type: type,
      props: {
        ...props
      },
      children: children? children.map(child =>
        typeof child === "object" 
          ? child 
          : this.createTextElement(child))
        : []
    }
  }

  static createTextElement(text: string): Element {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text
      },
      children: []
    }
  }

  isEvent:object = (key: string) =>
    key.startsWith("on");


  createFiber(element: Element, key: number = 1): Fiber {
    const dom:any = element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
    
    Object.keys(element.props)
      .filter(isProperty)
      .forEach(name => {
        dom[name] = element.props[name]
      });
    
    Object.keys(element.props)
      .filter(isEvent)
      .forEach(name => {
        const eventType:string = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, element.props[name]);
      });

    const fiber: Fiber = {
      dom,
      element: {
        type: element.type,
        props: element.props
      },
      key: key,
      children: []
    }

    if(element.props.dataset) {
      Object.keys(element.props.dataset)
        .forEach(name => {
          dom.dataset[name] = element.props.dataset[name]
        });
    }

    return fiber;
  }

  updateDomProps(
    prevProps: Element["props"], 
    nextProps: Element["props"], 
    dom: any):void {
    
    // Remove old Events
    Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = "";
      });

    // Set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name];
      });

    // Add event listeners
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });

  }

  removeDomList(
    keyList: number[], 
    fiberList: Fiber[], 
    dom: Dom):void {

    const removeList: Fiber[] = fiberList.filter((fiber) => {
      !keyList.includes(fiber.key)
    });

    removeList.forEach(child => {
      dom.removeChild(child.dom);
    });
  }

  setFiber(
    element: Element, 
    key:number = 1, 
    fiberList: Fiber[] | Fiber): Fiber {

    const preFiber: Fiber = Array.isArray(fiberList)
      ? fiberList.filter(fiber => fiber.key === key)[0]
      : fiberList.children.filter(fiber => fiber.key === key)[0]

    if(preFiber) {
      
      this.updateDomProps(preFiber.element.props, element.props, preFiber.dom);

      const keyList:number[] = element.children.map((ele, idx) => idx);

      this.removeDomList(keyList, preFiber.children, preFiber.dom);
      
      const children: Fiber[] = element.children.map((child, idx) =>
        this.setFiber(child, idx, preFiber)
      )

      return {
        dom: preFiber.dom,
        element: {
          type: element.type,
          props: element.props
        },
        key: preFiber.key,
        children
      } 
    } else {

      const fiber: Fiber = this.createFiber(element, key);

      fiber.children = element.children.map((child: Element, key:number) => 
          this.setFiber(child, key, fiber)
        )
      
      if(!Array.isArray(fiberList)) {
        fiberList.dom.appendChild(fiber.dom);
      }

      return fiber;
    }
  }

  addFiberList(element: Element, key:number):void {
    const fiber: Fiber = this.setFiber(element, key, this.currentFiberList);
    this.nextFiberList.push(fiber);
  }

  render(element: Element | Element[], container: any):void {

    if(Array.isArray(element)) {
      element.forEach((ele: Element, idx) => {
        this.addFiberList(ele, idx);
      })
    } else {
      this.addFiberList(element, 1);
    }

    const keyList:number[] = this.nextFiberList.map(fiber => fiber.key);

    this.removeDomList(keyList, this.currentFiberList, container);

    //쓸데없이 많은 로직을 수행하는 것 같음.
    this.nextFiberList.forEach(nextFiber => {
      // 매번 filter를 수행하는 게 맞을까?
      const preFiber: Fiber = this.currentFiberList.filter(fiber => 
          fiber.key === nextFiber.key
        )[0];
      if(!preFiber) {
        container.appendChild(nextFiber.dom)
      }
    });

    this.currentFiberList = [...this.nextFiberList];

    this.nextFiberList = [];
  }

  modifyFiber(element: Element, key: number) {
    const nextFiber: Fiber = this.setFiber(element, key, this.currentFiberList);
    this.currentFiberList = this.currentFiberList.map(fiber => 
        fiber.key === key? nextFiber : fiber
      );
  }
  
}

export default DynamicDom;

function test<T>(abs:T):T {
  return abs
}
test<string>("state");