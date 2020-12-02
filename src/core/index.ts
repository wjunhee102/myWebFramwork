interface element {
  type: string;
  props: object;
  children: any[];
}

interface fiber {
  dom: HTMLElement | Text;
  element: {
    type: element["type"],
    props: element["props"]
  };
  key: number;
  children: fiber[];
}

type ObjectKeys<T> = 
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  any;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>
}

class DynamicDom {
  //fiber
  currnetFiberList:fiber[] = [];
  nextFiberList:fiber[] = [];

  constructor() {}
  
  static createElement(
    type: string, 
    props: object, 
    ...children:any[]
    ):element {
    return {
      type: type,
      props: {
        ...props
      },
      children: children? children.map(child =>
        typeof child === "object" ?
        child 
        : this.createTextElement(child))
        : []
    }
  }

  static createTextElement(text:string):element {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text
      },
      children: []
    }
  }

  createFiber(element:element, key:number = 1) {
    const dom:HTMLElement | Text = element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
    
    const isEvent = key => 
      key.startsWith("on");
    const isKey = key => 
      key === "key";
    const isDataset = key =>
      key === "dataset";
    const isProperty = key => 
      key !== "children" && !isEvent(key) && !isKey(key) && !isDataset(key); 

    Object.keys(element.props)
      .filter(isProperty)
      .forEach(name => {
        dom[name] = element.props[name]
      });
    
    Object.keys(element.props)
      .filter(isEvent)
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, element.props[name]);
      });

  }
}

function test<T>(abs:T):T {
  return abs
}
test<string>("state");