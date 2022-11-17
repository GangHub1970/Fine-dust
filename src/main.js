"use strict";

import Dust from "./dust.js";

const today = new Date();
const date = document.querySelector(".date span");
date.textContent = `${today.getFullYear()}.${
  today.getMonth() + 1
}.${today.getDate()}`;

const optionTitle = document.querySelector(".option__title");
const regions = document.querySelector(".sido");
const stations = document.querySelector(".stations");
const stationTitle = document.querySelector(".station__title");
const options = document.querySelectorAll(".option");

function onRegionClick(event) {
  const targetText = event.target.textContent;
  optionTitle.textContent = targetText;
  // 클릭했을 때 드롭다운 메뉴 없어지기
  dust.clear();
  dust.getSidoDustData(targetText);
  stationTitle.textContent = "시/군/구";
  window.scrollTo(0, 0);
}

function onStationClick(event) {
  const targetText = event.target.textContent;
  const boxs = document.querySelectorAll(".box");

  boxs.forEach((box) => {
    const boxStation = box.querySelector(".station");
    if (boxStation.textContent !== targetText) {
      box.style.display = "none";
    } else {
      box.style.display = "flex";
    }
  });
  stationTitle.textContent = targetText;
}

const dust = new Dust();
dust.getSidoDustData("서울특별시");

regions.addEventListener("click", onRegionClick);
stations.addEventListener("click", onStationClick);
options.forEach((option) => {
  option.addEventListener("mouseover", option.scrollTo(0, 0));
});
