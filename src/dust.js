"use strict";

import PopUp from "./popup.js";

const DUST_API_KEY = config.dust_apikey;
const regions = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
};

const popUp = new PopUp();

export default class Dust {
  constructor() {
    this.stations = document.querySelector(".stations");
    this.main = document.querySelector(".main");
    this.main.addEventListener("click", (event) => {
      const target = event.target.closest(".box");
      if (target) {
        const targetStation = target.querySelector(".station").textContent;
        const targetRegion = target.querySelector(".district").textContent;
        const targetDust = target.querySelector(".value").textContent;

        popUp.showWithInfo(targetStation, targetRegion, targetDust);
      }
    });
  }

  async getSidoDustData(sido) {
    const sidoName = regions[sido];
    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${DUST_API_KEY}&sidoName=${sidoName}&numOfRows=100&returnType=json`;
    const response = await fetch(url);
    const data = await response.json();

    const stationsData = this.getStationsData(data.response.body.items);
    this.createDatas(stationsData, sidoName);
    this.getStations(stationsData);
  }

  getStationsData(sidoData) {
    const stationsData = [];
    for (const item of sidoData) {
      if (!item.pm10Grade) continue;
      const stationData = {};
      stationData["station"] = item.stationName;
      stationData["grade"] = item.pm10Grade;
      let state;
      let color;
      switch (item.pm10Grade) {
        case "1":
          state = "좋음";
          color = "#00a1ff";
          break;
        case "2":
          state = "보통";
          color = "#60d937";
          break;
        case "3":
          state = "나쁨";
          color = "#feae00";
          break;
        case "4":
          state = "매우나쁨";
          color = "#ed220d";
          break;
      }
      stationData["state"] = state;
      stationData["color"] = color;
      stationsData.push(stationData);
    }
    return stationsData;
  }

  getStations(stationsData) {
    for (const stationData of stationsData) {
      const station = document.createElement("li");
      station.setAttribute("class", "region");
      station.innerHTML = `
        <span class="region__text">${stationData.station}</span>
      `;
      this.stations.appendChild(station);
    }
  }

  createDatas(stationsData, sidoName) {
    for (const item of stationsData) {
      const box = document.createElement("div");
      box.setAttribute("class", `box`);
      box.style.backgroundColor = `${item.color}`;
      box.innerHTML = `
        <div class="regionAndBtn">
          <div class="region">
            <span class="station">${item.station}</span>
            <span class="district">${sidoName}</span>
          </div>
          <button class="favorite-btn">
            <span class="material-icons"> star_border </span>
          </button>
        </div>
        <div class="state" style="color: ${item.color}"}>
          <span>${item.state}</span>
        </div>
        <div class="dust-value">
          <span class="title">미세먼지 수치 : </span>
          <span class="value">${item.grade}</span>
        </div>
    `;
      this.main.appendChild(box);
    }
  }

  clear() {
    this.main.innerHTML = "";
    this.stations.innerHTML = "";
  }
}