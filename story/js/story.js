"use strict";

var canvas = new fabric.CanvasEx('canvas');

var tiDiv = document.getElementById("textInput");
var tiForm = document.getElementById("nodeForm");

var counter = 1;

function collectNodeData(){
  console.log(canvas.getActiveObject());
  // var title = document.getElementById("nodeTitle").value;
  // var text = document.getElementById("nodeText").value;
  // var id = Math.floor(Math.random()*100000);
  tiDiv.style.visibility = "hidden";
}

function generateNewNode() {
  var textBox = new fabric.Rect({
    fill: 'blue',
    opacity: 0.4,
    width: 80,
    height: 80,
    hasControls: false,
    lockRotation: true,
    hoverCursor: "default",
    moveCursor: "default",
    storyNode: true,
    id: counter,
  });
  counter++;
  canvas.add(textBox);
}

function closeNode() {
  tiDiv.style.visibility = "hidden";
  tiForm.reset();
}

function openNode() {
    tiDiv.style.visibility = "visible";
}

canvas.on('mouse:dblclick', function (options) {
  if (options.target && options.target !== null && options.target !== undefined && options.target.storyNode) {
    openNode();
  }
});
