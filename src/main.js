"use strict";

import { Dust, storage, popUp } from "./dust.js";

const today = new Date();
const date = document.querySelector(".date span");
date.textContent = `${today.getFullYear()}.${
  today.getMonth() + 1
}.${today.getDate()}`;

const main = document.querySelector(".main");
const optionTitle = document.querySelector(".option__title");
const regions = document.querySelector(".sido");
const stations = document.querySelector(".stations");
const stationTitle = document.querySelector(".station__title");
const options = document.querySelectorAll(".option");
const myRegion = document.querySelector(".myRegion");
const favorites = document.querySelector(".favorites");

const myData = {};
const dust = new Dust();
dust.getSidoDustData("서울특별시");

function onRegionClick(event) {
  const targetText = event.target.textContent;
  optionTitle.textContent = targetText;
  clear();
  dust.getSidoDustData(targetText);
  stationTitle.textContent = "자세히";
  window.scrollTo(0, 0);
  favorites.classList.remove("favPage");
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
  favorites.classList.remove("favPage");
}

function clear() {
  main.innerHTML = "";
  stations.innerHTML = "";
}

function onFavBtnClick() {
  favorites.classList.add("favPage");
  clear();
  dust.createDatas(Object.values(storage));
}

function onMyBtnClick() {
  const loadingIcon = document.querySelector(".loading");
  loadingIcon.classList.toggle("hidden");

  function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const geocoder = new kakao.maps.services.Geocoder();

    async function callback(result, status) {
      if (Object.keys(myData).length === 0) {
        if (status === kakao.maps.services.Status.OK) {
          const region = result[0].address.region_1depth_name;
          const regionDatas = await dust.getMyDustData(region);

          let mean = 0;
          let count = 0;
          for (const regionData of regionDatas) {
            if (regionData.pm10Grade) {
              mean += Number(regionData.pm10Grade);
              count += 1;
            }
          }
          mean = Math.round(mean / count);

          myData["region"] = region;
          myData["dust"] = mean;
        }
      }
      popUp.showWithInfo(myData.region, myData.region, String(myData.dust));
    }
    geocoder.coord2Address(lng, lat, callback);
  }

  function onGeoError() {
    alert("Can't find you. No weather for you.");
  }

  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
}

regions.addEventListener("click", onRegionClick);
stations.addEventListener("click", onStationClick);
options.forEach((option) => {
  option.addEventListener("onmouseout", option.scrollTo(0, 0));
});
myRegion.addEventListener("click", onMyBtnClick);
favorites.addEventListener("click", onFavBtnClick);
