const preText = [
  ["안녕하세요"],
  ["저", [["i"], ["fc", "#fc0"]]],
  ["는", [["i"], ["b"]]],
  ["황준희"],
  ["입니다.", [["b"], ["a", "http://www.naver.com"]]]
];

const res = "[<][a-z|A-Z|/](.|\n)*?[>]";


const innerhtml = "안녕하세요 <span class='bold italic'>저는</span> 황준희 <span class='blod'>입니다.</span>";

const parsingText = "안녕하세요 "
// const regex = new RegExp("[<][a-z|A-Z|/](.|\n)*?[>]", "");

let htmlText = "<span class='bklog-bold bklog-italic'> 안녕하세요 </span>";

var regex2 = /(<span[^>]+)(class=\s*['"]+)([a-z]+\s*[^'"]+)([<][/]span+)(\s*[^>]*>)/;
var regex = /(<img[^>]+)(src)(\s*=\s*['"][^'"]+['"][^>]*>)/;
var regex3 = /(<span([^>]+)>)/ig;
var text = 'Lorem <span></span> ipsum. <img alt="foo" src="aaaa" title="bar" /> Maecenas metus.';
var result = htmlText.replace(regex2, function(full, start, src, end, w) {
  // console.log(`full: ${full}`, `start: ${start}`, `class: ${src}`, `name: ${end}`, `end: ${w}`);
  return end;
});

console.log(text.replace(regex3, "/"));

// console.log(result);

// const data = htmlText.replace(res, "sadad")


const newText = ["김밥요졍"];

const focusOffet = 5;

function switchingText(rawText, startPoint, lastPoint, style) {
  let count = 0;
  // let startPoint = startPoint;
  // let lastPoint = lastPoint;
  let removeCount = 0;

  let insertPoint = 0;
  let insertText = [];

  let newContents = [];

  rawText.forEach((text, idx)=> {
    console.log(idx);
    if(!newContents[idx]) {
      newContents[idx] = [];
    }
    for(let i = 0; i < text[0].length; i++) {
      if(count >= startPoint && count < lastPoint) {
        insertText[0] =  insertText[0]? insertText[0]  + text[0][i] : text[0][i];
        if(count === startPoint + 1) {

          if(style) {
            if(insertText)
            insertText.push(style);
          }

        }
      } else {
        newContents[idx][0] = newContents[idx][0]? newContents[idx][0] + text[0][i] : text[0][i];
      } 
      count++
    }
    if(text[1] && newContents[idx][0]) {
      console.log(text[1], newContents[idx]);
      newContents[idx].push(text[1]);
    } else {
      if(!newContents[idx][0]) {
        removeCount++;
      }
    }
    if(!newContents[idx][0] && !insertPoint) {
      insertPoint = idx;
    }
  })

  newContents.splice(insertPoint, removeCount, insertText);

  if(newContents[insertPoint-1] && newContents[insertPoint][1] === newContents[insertPoint-1][1]) {
    newContents[insertPoint][0] = newContents[insertPoint-1][0] + newContents[insertPoint][0];
    newContents.splice(insertPoint-1, 1);
    insertPoint--
  }

  if(newContents[insertPoint+1] && newContents[insertPoint][1] === newContents[insertPoint + 1][1]) {
    newContents[insertPoint][0] = newContents[insertPoint][0] + newContents[insertPoint + 1][0];
    newContents.splice(insertPoint + 1, 1);
  }
  
  return newContents;
}

// console.log(switchingText(preText, 3, 9));

function equalsArray(aryA, aryB) {
  if(!aryA && !aryB || (aryA.length === 0 && aryB.length === 0)) return true;
  if(!Array.isArray(aryA) || !Array.isArray(aryB) || aryA.length !== aryB.length ) return false;

  const targetBList = [];

  for(let i = 0; i < aryA.length; i++) {
    const targetA = JSON.stringify(aryA[i]);
    if(!i) {
      for(let ii = 0; ii < aryB.length; ii++) {

        const targetB = JSON.stringify(aryB[ii]);
        if(targetA === targetB) {
          
        } else {
          targetBList.push(targetB)
        }

      }
      if(targetBList.length === aryB.length) return false;
    } else {
      const targetBListLength = targetBList.length;

      for(let ii = 0; ii < targetBList.length; ii++) {
        if(targetBList[ii] === targetA) {
          targetBList.splice(ii, 1);
          break;
        } 
      }

      if(targetBListLength === targetBList.length) {
        return false;
      }
      
    }
  } 

  return targetBList.length? false : true;
}

console.log(equalsArray([["b"]], [["b"], ["i"]]))

function switchingText2(rawText, startPoint, lastPoint, style) {
  let count = 0;
  let removeCount = 0;

  let insertPoint = 0;
  let insertCount = 0;
  let insertText = [[]];

  let firstInserPoint = 0;
  let lastInserPoint = 0;


  let newContents = [];

  rawText.forEach((text, idx)=> {
    console.log(idx);

    if(!newContents[idx]) {
      newContents[idx] = [];
    }
    const textLength = text[0].length;

    if(!insertText[insertCount]) {
      insertText[insertCount] = [[]];
    }

    for(let i = 0; i < textLength; i++) {

      if(count >= startPoint && count < lastPoint) {
        if(count === startPoint || !i) {

          if(!i) {
            console.log(text[1], "실행0")
            if(equalsArray(text[1], [style])) {

              if(equalsArray(text[1], insertText[insertCount][1])) {

              } else {
                ++insertCount;
                insertText[insertCount] = [[]]; 

                if(text[1] && style) {

                  insertText[insertCount].push([]);
                  
                  let isEquals = false;
      
                  if(equalsArray(text[1], insertText[insertCount][1])) {
                    // insertText[insertCount][1].push(style); 
                  } else {
                    text[1].forEach((type) => {
                      if(equalsArray([type], [style])) {
                        isEquals = true;
                      }
                      insertText[insertCount][1].push(type);        
                    })
        
                    if(!isEquals) {
                      insertText[insertCount][1].push(style); 
                    }
                  }
                  
                }
              }
            } else {
              console.log([text[1], style], insertText[insertCount][1], "실행3")
              if(text[1] && equalsArray([...text[1], style], insertText[insertCount][1])) {
                console.log([...text[1], style], "실행2")
              } else {
                console.log([text[1]], insertText[insertCount][1], "실행5")
                if(equalsArray([style], insertText[insertCount][1]) && !text[1]) {
                } else if(equalsArray(text[1], insertText[insertCount][1])) {
                  console.log([text[1], style], insertText[insertCount][1], "실행4")
                } else {
                  ++insertCount;
                  insertText[insertCount] = [[]]; 

                  if(text[1] && style) {

                    insertText[insertCount].push([]);
                    
                    let isEquals = false;
        
                    if(equalsArray(text[1], insertText[insertCount][1])) {
                      // insertText[insertCount][1].push(style); 
                    } else {
                      text[1].forEach((type) => {
                        if(equalsArray([type], [style])) {
                          isEquals = true;
                        }
                        insertText[insertCount][1].push(type);        
                      })
          
                      if(!isEquals) {
                        insertText[insertCount][1].push(style); 
                      }
                    }
                    
                  }
                }
              }
            }
            // if(!equalsArray(text[0], insertText[insertCount][1])) {
            //   ++insertCount;
            //   insertText[insertCount] = [[]]; 

            //   if(text[1] && style) {

            //     insertText[insertCount].push([]);
                
            //     let isEquals = false;
    
            //     if(equalsArray(text[1], insertText[insertCount][1])) {
            //       // insertText[insertCount][1].push(style); 
            //     } else {
            //       text[1].forEach((type) => {
            //         if(equalsArray([type], [style])) {
            //           isEquals = true;
            //         }
            //         insertText[insertCount][1].push(type);        
            //       })
      
            //       if(!isEquals) {
            //         insertText[insertCount][1].push(style); 
            //       }
            //     }
                
            //   }
            // } else {}
          } else {
          
            if(text[1] && style) {
              insertText[insertCount].push([]);
              let isEquals = false;
  
              text[1].forEach((type) => {
                if(equalsArray([type], [style])) {
                  isEquals = true;
                }
                insertText[insertCount][1].push(type);        
              })
  
              if(!isEquals) {
                insertText[insertCount][1].push(style); 
              }

            } else {
              if(style) {
                insertText[insertCount] = [[],[]]; 
                insertText[insertCount][1].push(style);
              }
            }
          }

          
        }
      
        // if(!i) {
        //   if(!equalsArray(text[0], insertText[insertCount][1])) {
        //     ++insertCount;
        //     insertText[insertCount] = [[]];
        //   }
        // }

        insertText[insertCount][0] =  insertText[insertCount][0]? insertText[insertCount][0] + text[0][i] : text[0][i];

        if(count === lastPoint - 1) {

          if(style) {

            if(!insertText[insertCount][1]) {
               insertText[insertCount][1] = [];
            } 
            
            let isEquals = false;
            insertText[insertCount][1].forEach((type)=> {
              if(equalsArray([type], [style])) {
                isEquals = true;
              }
            })

            if(!isEquals) {
              insertText[insertCount][1].push(style);
            }
            
          }

        }

        // if(i === textLength -1) {

        //   if(text[1] && style && !insertText[insertCount][1]) {

        //     insertText[insertCount].push([]);
            
        //     let isEquals = false;

        //     if(equalsArray(text[1], insertText[insertCount][1])) {
        //       // insertText[insertCount][1].push(style); 
        //     } else {
        //       text[1].forEach((type) => {
        //         if(equalsArray([type], [style])) {
        //           isEquals = true;
        //         }
        //         insertText[insertCount][1].push(type);        
        //       })
  
        //       if(!isEquals) {
        //         insertText[insertCount][1].push(style); 
        //       }
        //     }
            
        //   }

        // }

      } else {
        newContents[idx][0] = newContents[idx][0]? newContents[idx][0] + text[0][i] : text[0][i];
      } 
      count++;
    }

    if(text[1] && newContents[idx][0]) {
      newContents[idx].push(text[1]);
    } else {
      if(!newContents[idx][0]) {
        removeCount++;
      }
    }

    if(!newContents[idx][0] && !insertPoint) {
      insertPoint = idx;
      firstInserPoint = insertPoint;
    }

  })

  insertText.forEach((text) => {
    newContents.splice(insertPoint, 0, text);
    insertPoint++
  });
  
  lastInserPoint = insertPoint - 1;

  newContents.splice(insertPoint , removeCount);
  
  if(newContents[firstInserPoint-1] && equalsArray(newContents[firstInserPoint][1], newContents[firstInserPoint-1][1])) {
    newContents[firstInserPoint][0] = newContents[firstInserPoint-1][0] + newContents[firstInserPoint][0];
    newContents.splice(firstInserPoint-1, 1);
    firstInserPoint--;
    lastInserPoint--;
  }

  if(newContents[lastInserPoint+1] && equalsArray(newContents[lastInserPoint][1], newContents[lastInserPoint + 1][1])) {
    newContents[lastInserPoint][0] = newContents[lastInserPoint][0] + newContents[lastInserPoint + 1][0];
    newContents.splice(lastInserPoint + 1, 1);
  }
  
  return newContents;
}

function addContentsStyle(preTexts, startPoint, endPoint, style) {
  let count = 0;
  let insertText = ["",[]];
  let newContents = [];

  for(text of preTexts) {

    for(let i = 0; i < text[0].length; i++) {
      if(count >= startPoint && count < endPoint) {
        if(arrayFindIndex(insertText[1], style) === -1) { 
          newContents.push(insertText);
          insertText = text[1]? ["", [...text[1], style]] : ["", [style]];
        } else if(!equalsArray(insertText[1], text[1]? text[1] : []) && i === 0) {
          newContents.push(insertText);
          insertText = text[1]?["", [...text[1]]] : ["", []]
        }
      } else {
        if(!equalsArray(insertText[1], text[1]? text[1] : [])) { 
          newContents.push(insertText);
          insertText = text[1]?["", [...text[1]]] : ["", []]
        };
      }
      insertText[0] += text[0][i];
      
      count++;
    }
    
  }
  if(insertText[0]) {
    newContents.push(insertText);
  }

  return newContents.map(content => content[1][0]? content : [content[0]]);
}

function deleteContentsStyle(preTexts, startPoint, endPoint, style) {
  let count = 0;
  let insertText = ["",[]];
  let newContents = [];

  preTexts.forEach((text) => {
    for(let i = 0; i < text[0].length; i++) {

      if(count >= startPoint && count < endPoint) {
        let stylePosition = arrayFindIndex(insertText[1], style);

        if(stylePosition > -1) {
          newContents.push(insertText);
          const newStyle = [...insertText[1]];
          newStyle.splice(stylePosition, 1);
          insertText = ["", [...newStyle]];

        } else if(!equalsArray(insertText[1], text[1]? text[1] : [])) {
          stylePosition = arrayFindIndex(text[1]? text[1] : [], style);
          const newStyle = text[1]? [...text[1]] : [];
          if(stylePosition > -1) {
            newStyle.splice(stylePosition, 1);
          } 

          if(!equalsArray(insertText[1], newStyle)) {
            newContents.push(insertText);
            insertText = ["", [...newStyle]];
          }

        }
      } else {
        if(!equalsArray(insertText[1], text[1]? text[1] : [])) { 
          newContents.push(insertText);
          insertText = text[1]? ["", [...text[1]]] : ["", []]
        };
      }
      insertText[0] += text[0][i];
      
      count++;

    }
  });

  if(insertText[0]) {
    newContents.push(insertText);
  }

  return newContents.map(content => content[1][0]? content : [content[0]]);
}

const preText2 = [
  ["dasdsd"],
  ["안녕하세요" ,[["i"], ["b"]]],
  ["저", [["i"], ["b"]]],
  ["는", [["i"], ["b"]]],
  ["황준희"],
  ["입니다.", [["b"], ["a", "http://www.naver.com"]]]
];


// const data2 = switchingText2(preText2, 4, 9, ["b"]);

// console.log(data2, data2[2]);

// for(let i = 0; i < data2.length; i++) {
//   console.log("data", data2[i]);
// }

const newTexts = addContentsStyle(preText2, 1, 7, ["b"]);
console.log(newTexts);
const newTexts2 = deleteContentsStyle(preText2, 1, 19, ["i"]);

for(let i = 0; i < newTexts.length; i++) {
  console.log(newTexts2[i]);
}

const testText = [["i"], ["b"]];

console.log("include", arrayFindIndex(testText,["b"]));


function arrayFindIndex(array, factor) {
  const JSONFactor = JSON.stringify(factor);

  for(let i = 0; i < array.length; i++) {
    const JSONArray = JSON.stringify(array[i]);
    if(JSONArray === JSONFactor) {
      return i;
    }
  }
  return -1;
}

function pushTest(preText, newText, focusOffet) {
  let count = 0;
  let contentCount = 0;
  let startPoint = focusOffet - newText[0].length;
  let lastPoint = focusOffet - 1;

  let newContents = [];

  let temp = [];
  // console.log(newText[0][0]);

  if(startPoint < 0) {
    return "error"
  } else {
    preText.forEach((content, idx)=> {
      
   
      for(let ii = 0; ii < content[0].length; ii++) {

        if(!newContents[idx]) {
          newContents[idx] = [[""]];
        }

        if(count >= startPoint && count < focusOffet) {

          newContents[idx][0] = newContents[idx][0] + newText[0][contentCount];
          contentCount++;

          if(count !== startPoint) {
            temp.push(content[0][ii]);
          }
          // console.log(temp, newText[0][contentCount]);

        } else {
          // console.log(temp, "asdasd", contentCount);
          if(count === lastPoint) {
            newContents[idx][0] = newContents[idx][0] + temp.join("");
          }
          newContents[idx][0] = newContents[idx][0] + content[0][ii];
        }
        count++;
      }
    if(content[1]) {
      newContents[idx][1] = content[1].concat();
    }
    })
  }
  return newContents;
}


// console.log(pushTest(preText, newText, focusOffet + 1));

function updateContents(text) {
  const newContents = [];
  const textLength = text.length;
  let content = [];
  let propertys = [];
  let property;
  let saveToggle = true;
  let propertyToggle = false;

  for(let i = 0; i < textLength; i++) {

    if(!propertyToggle) {

      switch(text[i]) {
        case "<": 
  
          if(i && text[i+1] === "/" && text[i+6] === ">") {
            if(!content[0]) {
              newContents.pop();
            } else {
              newContents.push(content);
              content = [];
            }

            i += 6;
            saveToggle = true;

          } else {

            saveToggle = false;
  
            if(content[0] !== undefined) {
              newContents.push(content);
              content = [];
            } 

          }
  
          break;
        case ">":
          saveToggle = true;

          break;
  
        case "s":
  
          if(!saveToggle) {
            i += 2;
            break;
          }
  
        case "c":
          if(!saveToggle) {
            if(text[i+1] === "l" && text[i+5] === "=") {
              i += 6;
              propertyToggle = true;
            }
  
            break;
          } 
          
        default:
          if(saveToggle) {
            content[0]? content[0] += text[i] : content[0] = text[i];
          }
         
      }

    } else {

      switch(text[i]) {

        case '"' || "'":
          if(property) {

            switch(property) {
              case "bk-bold":
                propertys.push(["b"]);
                break;
              
              case "bk-italic":
                propertys.push(["i"]);
                break;
              
              default:
            }

          }

          if(!content[1]) {
            content = [content[0], ];
            content[1] = [...propertys];
          } else {
            content[1] = [...propertys];
          }
          propertys = [];
          propertyToggle = false;
          property = null;

          break;
        
        case " ":

          if(property) {

            switch(property) {
              case "bk-bold":
                propertys.push(["b"]);
                break;
              
              case "bk-italic":
                propertys.push(["i"]);
                break;
              
              default:

            }

            property = null;
          }
          break;

        default: 
          property? property += text[i] : property = text[i];
      }

    }
    
  }

  if(content[0]) {
    newContents.push(content);
  }

  return newContents;
}

const testInnerHTML = '안녕하세요 <span class="bk-bold bk-italic">저</span>  <span class="bk-bold">는</span> 황준희입니다.';

const testData = updateContents(testInnerHTML);

function createContentsElement(accumulator, rawContents) {
  let text;
  let className;
  let styles;
  let aTag;

  if(rawContents.length === 2) {
    rawContents[1].forEach(content => {
      switch(content[0]) {

        case "b":
          className = className? className + " bk-bold" : "bk-bold";
          break;

        case "i":
          className = className? className + " bk-italic" : "bk-italic";
          break;

        case "_":
          className = className? className + " bk-underbar" : "bk-underbar";
          break;

        case "fc":
          if(content[1][0] === "#") {
            styles = styles? styles + ` color: ${content[1]};` : `color: ${content[1]};`;
          } else {
            className = className? className + ` bk-fc-${content[1]}` : `bk-fc-${content[1]}`
          }
          break;

        case "bc":
          if(content[1][0] === "#") {
            styles = styles? styles + ` backgroundColor: ${content[1]};` : `backgroundColor: ${content[1]};`;
          } else {
            className = className? className + ` bk-bc-${content[1]}` : `bk-bc-${content[1]}`
          }
          break;

        case "a":
          aTag = content[1];
      }
    })
    text = `<span${className? ' class="'+ className + '"' : ""}${styles? ' style="' + styles + '"' : ""}>${rawContents[0]}</span>`

    if(aTag) {
      let preText = text;
      text = `<a href="${aTag}">${preText}</a>`;
    }
  } else {
    text = rawContents[0];
  }

  return  accumulator + text;
}

// const testContents = preText.reduce(createContentsElement);

// console.log(testContents);


let testaData = [
  {
    id: "bbc",
    idx: 2
  },
  {
    id: "abc",
    idx: 1
  },
  {
    id: "ccb",
    idx: 3
  }
]
let index = [];
console.log(testaData.filter((t, idx)=> {
  index.push({
    id: t,
    idx
  })
  return t.id === "bbc" || t.id === "abc"
}))

console.log(index);

function isAfter(container, offset, node) {
  var c = node;
  while (c.parentNode != container) {
    c = c.parentNode;
  }
  var i = offset;
  while (c != null && i > 0) {
    c = c.previousSibling;
    i -= 1;
  }
  return i > 0;
}
function compareCaretPositons(node1, offset1, node2, offset2) {
  if (node1 === node2) {
    return offset1 - offset2;
  }
  var c = node1.compareDocumentPosition(node2);
  if ((c & Node.DOCUMENT_POSITION_CONTAINED_BY) !== 0) {
    return isAfter(node1, offset1, node2) ? +1 : -1;
  } else if ((c & Node.DOCUMENT_POSITION_CONTAINS) !== 0) {
    return isAfter(node2, offset2, node1) ? -1 : +1;
  } else if ((c & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
    return -1;
  } else if ((c & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
    return +1;
  }
}

function stringifyElementStart(node, isLineStart) {
  if (node.tagName.toLowerCase() === 'br') {
    if (true) {
      return '\n';
    }
  }
  if (node.tagName.toLowerCase() === 'div') { // Is a block-level element?
    if (!isLineStart) { //TODO: Is not at start of a line?
      return '\n';
    }
  }
  return '';
}
function* positions(node, isLineStart = true) {
  console.assert(node.nodeType === Node.ELEMENT_NODE);
  var child = node.firstChild;
  var offset = 0;
  yield {node: node, offset: offset, text: stringifyElementStart(node, isLineStart)};
  while (child != null) {
    if (child.nodeType === Node.TEXT_NODE) {
      yield {node: child, offset: 0/0, text: child.data};
      isLineStart = false;
    } else {
      isLineStart = yield* positions(child, isLineStart);
    }
    child = child.nextSibling;
    offset += 1;
    yield {node: node, offset: offset, text: ''};
  }
  return isLineStart;
}
function getCaretPosition(contenteditable, textPosition) {
  var textOffset = 0;
  var lastNode = null;
  var lastOffset = 0;
  for (var p of positions(contenteditable)) {
    if (p.text.length > textPosition - textOffset) {
      return {node: p.node, offset: p.node.nodeType === Node.TEXT_NODE ? textPosition - textOffset : p.offset};
    }
    textOffset += p.text.length;
    lastNode = p.node;
    lastOffset = p.node.nodeType === Node.TEXT_NODE ? p.text.length : p.offset;
  }
  return {node: lastNode, offset: lastOffset};
}
function getTextOffset(contenteditable, selectionNode, selectionOffset) {
  var textOffset = 0;
  for (var p of positions(contenteditable)) {
    if (selectionNode.nodeType !== Node.TEXT_NODE && selectionNode === p.node && selectionOffset === p.offset) {
      return textOffset;
    }
    if (selectionNode.nodeType === Node.TEXT_NODE && selectionNode === p.node) {
      return textOffset + selectionOffset;
    }
    textOffset += p.text.length;
  }
  return compareCaretPositons(selectionNode, selectionOffset, contenteditable, 0) < 0 ? 0 : textOffset;
}
function getValue(contenteditable) {
  var value = '';
  for (var p of positions(contenteditable)) {
    value += p.text;
  }
  return value;
}
function setSelectionRange(contenteditable, start, end) {
  var selection = window.getSelection();
  var s = getCaretPosition(contenteditable, start);
  var e = getCaretPosition(contenteditable, end);
  selection.setBaseAndExtent(s.node, s.offset, e.node, e.offset);
}
//TODO: Ctrl+A - rangeCount is 2
function getSelectionDirection(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? 'forward' : 'none';
}
function getSelectionStart(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? getTextOffset(contenteditable, selection.anchorNode, selection.anchorOffset) : getTextOffset(contenteditable, selection.focusNode, selection.focusOffset);
}
function getSelectionEnd(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? getTextOffset(contenteditable, selection.focusNode, selection.focusOffset) : getTextOffset(contenteditable, selection.anchorNode, selection.anchorOffset);
}