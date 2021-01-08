const preText = [
  ["안녕하세요"],
  ["저", [["b"]]],
  ["는", [["i"]]],
  ["황준희"],
  ["입니다.", [["b"]]]
];

const res = "[<][a-z|A-Z|/](.|\n)*?[>]";


const innerhtml = "안녕하세요 <span class='bold italic'>저는</span> 황준희 <span class='blod'>입니다.</span>";

const parsingText = "안녕하세요 "
// const regex = new RegExp("[<][a-z|A-Z|/](.|\n)*?[>]", "");

let htmlText = "<span class='bklog-bold bklog-italic'> 안녕하세요 </span>";

var regex2 = /(<span[^>]+)(class=\s*['"]+)([a-z]+\s*[^'"]+)([<][/]span+)(\s*[^>]*>)/;
var regex = /(<img[^>]+)(src)(\s*=\s*['"][^'"]+['"][^>]*>)/;
var text = 'Lorem ipsum. <img alt="foo" src="aaaa" title="bar" /> Maecenas metus.';
var result = htmlText.replace(regex2, function(full, start, src, end, w) {
  // console.log(`full: ${full}`, `start: ${start}`, `class: ${src}`, `name: ${end}`, `end: ${w}`);
  return end;
}); 

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

console.log(switchingText(preText, 3, 9));

function switchingText2(rawText, startPoint, lastPoint, style = ["b"]) {
  let count = 0;
  // let startPoint = startPoint;
  // let lastPoint = lastPoint;
  let removeCount = 0;

  let insertPoint = 0;
  let insertCount = 0;
  let insertText = [[]];


  let newContents = [];

  rawText.forEach((text, idx)=> {
    console.log(idx);

    if(!newContents[idx]) {
      newContents[idx] = [];
    }

    for(let i = 0; i < text[0].length; i++) {
      if(count >= startPoint && count < lastPoint) {
        insertText[insertCount][0] =  insertText[insertCount][0]? insertText[insertCount][0] + text[0][i] : text[0][i];
        if(count === lastPoint - 1) {
          if(style) {
            insertText.push(style);
          }
        }
      } else {
        newContents[idx][0] = newContents[idx][0]? newContents[idx][0] + text[0][i] : text[0][i];
      } 
      count++;
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