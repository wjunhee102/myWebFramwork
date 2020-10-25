const container = document.getElementById("app");
const Didact = {
  createElement,
  createTextElement,
  render
}


function createElement (type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === "object" ?
        child : Didact.createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return  {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

// function render(element, container) {
//   const dom = element.type == "TEXT_ELEMENT" 
//     ? document.createTextNode("")
//     : document.createElement(element.type);

//   const isProperty = key => key !== "children";
//   Object.keys(element.props)
//   .filter(isProperty)
//   .forEach(name => {
//     dom[name] = element.props[name]
//   })

//   element.props.children.forEach(child => 
//     render(child, dom)
//   );

//   container.appendChild(dom);
// }

function createDom(fiber) {
  const dom = 
    fiber.type == "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);

  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    });
  
  return dom
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}


const element = Didact.createElement(
  "div",
  {
    id: "foo"
  },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
)

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if(fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
}





// class Vrd {
//   nextUnitOfWork = null;

//   createElement (type, props, ...children) {
//     return {
//       type: type,
//       props: {
//         ...props,
//         children: children.map(child => 
//           typeof child === "object" ?
//           child : this.createTextElement(child)
//         )
//       }
//     }
//   }

//   createTextElement(text) {
//     return  {
//       type: "TEXT_ELEMENT",
//       props: {
//         nodeValue: text,
//         children: [],
//       }
//     }
//   }

//   render (element, container) {
//     const dom = element.type == "TEXT_ELEMENT" 
//       ? document.createTextNode("")
//       : document.createElement(element.type);

//     const isProperty = key => key !== "children";
//     Object.keys(element.props)
//     .filter(isProperty)
//     .forEach(name => {
//       dom[name] = element.props[name]
//     })

//     element.props.children.forEach(child => 
//       render(child, dom)
//     );

//     container.appendChild(dom);
//   }
// }

Didact.render(element, container);

/** @jsx Diact.createElement */
// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )