var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// type ObjectKeys<T> = 
//   T extends object ? (keyof T)[] :
//   T extends number ? [] :
//   T extends Array<any> | string ? string[] : any;
// interface ObjectConstructor {
//   keys<T>(o: T): ObjectKeys<T>
// }
var isEvent = function (key) {
    return key.startsWith("on");
};
var isKey = function (key) {
    return key === "key";
};
var isDataset = function (key) {
    return key === "dataset";
};
var isProperty = function (key) {
    return key !== "children" && !isEvent(key) && !isKey(key) && !isDataset(key);
};
var isNew = function (prev, next) {
    return function (key) { return prev[key] !== next[key]; };
};
var isGone = function (prev, next) {
    return function (key) { return !(key in next); };
};
var Component = /** @class */ (function () {
    function Component() {
    }
    return Component;
}());
export { Component };
;
var classObj = null;
var DynamicDom = /** @class */ (function () {
    // temp
    function DynamicDom() {
        // fiber
        this.currentFiberList = [];
        this.nextFiberList = [];
        this.isEvent = function (key) {
            return key.startsWith("on");
        };
    }
    DynamicDom.createElement = function (type, props) {
        var _this = this;
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        if (typeof type === "function") {
            if (type.prototype instanceof Component) {
                if (!classObj) {
                    classObj = new type();
                }
                return classObj.render();
            }
            else {
                return type.apply(null, __spreadArrays([props], children));
            }
        }
        return {
            type: type,
            props: __assign({}, props),
            children: children ? children.map(function (child) {
                return typeof child === "object"
                    ? child
                    : _this.createTextElement(child);
            })
                : []
        };
    };
    DynamicDom.createTextElement = function (text) {
        return {
            type: "TEXT_ELEMENT",
            props: {
                nodeValue: text
            },
            children: []
        };
    };
    DynamicDom.prototype.createFiber = function (element, key) {
        if (key === void 0) { key = 1; }
        var dom = element.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(element.type);
        Object.keys(element.props)
            .filter(isProperty)
            .forEach(function (name) {
            dom[name] = element.props[name];
        });
        Object.keys(element.props)
            .filter(isEvent)
            .forEach(function (name) {
            var eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, element.props[name]);
        });
        var fiber = {
            dom: dom,
            element: {
                type: element.type,
                props: element.props
            },
            key: key,
            children: []
        };
        if (element.props.dataset) {
            Object.keys(element.props.dataset)
                .forEach(function (name) {
                dom.dataset[name] = element.props.dataset[name];
            });
        }
        return fiber;
    };
    DynamicDom.prototype.updateDomProps = function (prevProps, nextProps, dom) {
        // Remove old Events
        Object.keys(prevProps)
            .filter(isEvent)
            .filter(function (key) { return !(key in nextProps) || isNew(prevProps, nextProps)(key); })
            .forEach(function (name) {
            var eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });
        // Remove old properties
        Object.keys(prevProps)
            .filter(isProperty)
            .filter(isGone(prevProps, nextProps))
            .forEach(function (name) {
            dom[name] = "";
        });
        // Set new or changed properties
        Object.keys(nextProps)
            .filter(isProperty)
            .filter(isNew(prevProps, nextProps))
            .forEach(function (name) {
            dom[name] = nextProps[name];
        });
        // Add event listeners
        Object.keys(nextProps)
            .filter(isEvent)
            .filter(isNew(prevProps, nextProps))
            .forEach(function (name) {
            var eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
    };
    DynamicDom.prototype.removeDomList = function (keyList, fiberList, dom) {
        var removeList = fiberList.filter(function (fiber) {
            !keyList.includes(fiber.key);
        });
        removeList.forEach(function (child) {
            dom.removeChild(child.dom);
        });
    };
    DynamicDom.prototype.setFiber = function (element, key, fiberList) {
        var _this = this;
        if (key === void 0) { key = 1; }
        var preFiber = Array.isArray(fiberList)
            ? fiberList.filter(function (fiber) { return fiber.key === key; })[0]
            : fiberList.children.filter(function (fiber) { return fiber.key === key; })[0];
        if (preFiber) {
            this.updateDomProps(preFiber.element.props, element.props, preFiber.dom);
            var keyList = element.children.map(function (ele, idx) { return idx; });
            this.removeDomList(keyList, preFiber.children, preFiber.dom);
            var children = element.children.map(function (child, idx) {
                return _this.setFiber(child, idx, preFiber);
            });
            return {
                dom: preFiber.dom,
                element: {
                    type: element.type,
                    props: element.props
                },
                key: preFiber.key,
                children: children
            };
        }
        else {
            var fiber_1 = this.createFiber(element, key);
            fiber_1.children = element.children.map(function (child, key) {
                return _this.setFiber(child, key, fiber_1);
            });
            if (!Array.isArray(fiberList)) {
                fiberList.dom.appendChild(fiber_1.dom);
            }
            return fiber_1;
        }
    };
    DynamicDom.prototype.addFiberList = function (element, key) {
        var fiber = this.setFiber(element, key, this.currentFiberList);
        this.nextFiberList.push(fiber);
    };
    DynamicDom.prototype.render = function (element, container) {
        var _this = this;
        if (Array.isArray(element)) {
            element.forEach(function (ele, idx) {
                _this.addFiberList(ele, idx);
            });
        }
        else {
            this.addFiberList(element, 1);
        }
        var keyList = this.nextFiberList.map(function (fiber) { return fiber.key; });
        this.removeDomList(keyList, this.currentFiberList, container);
        //쓸데없이 많은 로직을 수행하는 것 같음.
        this.nextFiberList.forEach(function (nextFiber) {
            // 매번 filter를 수행하는 게 맞을까?
            var preFiber = _this.currentFiberList.filter(function (fiber) {
                return fiber.key === nextFiber.key;
            })[0];
            if (!preFiber) {
                container.appendChild(nextFiber.dom);
            }
        });
        this.currentFiberList = __spreadArrays(this.nextFiberList);
        this.nextFiberList = [];
    };
    DynamicDom.prototype.modifyFiber = function (element, key) {
        var nextFiber = this.setFiber(element, key, this.currentFiberList);
        this.currentFiberList = this.currentFiberList.map(function (fiber) {
            return fiber.key === key ? nextFiber : fiber;
        });
    };
    return DynamicDom;
}());
export default DynamicDom;
function test(abs) {
    return abs;
}
test("state");
