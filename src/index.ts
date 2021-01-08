import DynamicDom, {Component} from "./core/index.js";

const app: DynamicDom = new DynamicDom();

class Test2 extends Component {

  data = 1;

  setState() {
    this.data++;
  }

  render() {
    return DynamicDom.createElement("h1", 
      {
        onClick: ()=> {
          this.setState()
        }
      }
    , `이건 클래스다 <br /> ${this.data}`)
  }
}

function Title(props:any, ...children:any[]) {
  return DynamicDom.createElement("div", {
    ...props,
    dataset: 1,
    onClick: () => {
      app.render(aaa(), document.getElementById("root"));
    }
  }, test(),...children, DynamicDom.createElement(test, null), DynamicDom.createElement(Test2, null));
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
};


console.log("실행");

app.render(aaa(), document.getElementById("root"));
app.render(aaa(), document.getElementById("root"));

let domparser = new DOMParser();
let htmlText = "<span> 안녕하세요 </span>";

let doc = domparser.parseFromString(htmlText, 'text/html');
console.log(doc)