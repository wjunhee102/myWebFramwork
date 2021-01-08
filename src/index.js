var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import DynamicDom, { Component } from "./core/index.js";
var app = new DynamicDom();
var Test2 = /** @class */ (function (_super) {
    __extends(Test2, _super);
    function Test2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = 1;
        return _this;
    }
    Test2.prototype.setState = function () {
        this.data++;
    };
    Test2.prototype.render = function () {
        var _this = this;
        return DynamicDom.createElement("h1", {
            onClick: function () {
                _this.setState();
            }
        }, "\uC774\uAC74 \uD074\uB798\uC2A4\uB2E4 <br /> " + this.data);
    };
    return Test2;
}(Component));
function Title(props) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    return DynamicDom.createElement.apply(DynamicDom, __spreadArrays(["div", __assign(__assign({}, props), { dataset: 1, onClick: function () {
                app.render(aaa(), document.getElementById("root"));
            } }), test()], children, [DynamicDom.createElement(test, null), DynamicDom.createElement(Test2, null)]));
}
function test() {
    return DynamicDom.createElement("span", null, "스팬태그입니다. ");
}
function aaa() {
    return DynamicDom.createElement(Title, {
        className: "test",
        id: "test2",
        style: "color: #f00; background-color:#0f0;"
    }, "반가워요", DynamicDom.createElement(test, null), "안녕하세요 ");
}
;
console.log("실행");
app.render(aaa(), document.getElementById("root"));
app.render(aaa(), document.getElementById("root"));
var domparser = new DOMParser();
var htmlText = "<span> 안녕하세요 </span>";
var doc = domparser.parseFromString(htmlText, 'text/html');
console.log(doc);
