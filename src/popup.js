"use strict";

const WEATHER_API_KEY = config.weather_apikey;
const regionsId = {
  서울: 1835847,
  부산: 1838524,
  대구: 1835329,
  인천: 1843564,
  광주: 1841811,
  대전: 1835235,
  울산: 1833747,
  세종: 1835235,
  경기: 1841610,
  강원: 1843125,
  충북: 1845106,
  충남: 1845105,
  전북: 1845789,
  전남: 1845788,
  경북: 1841597,
  경남: 1902028,
  제주: 1846266,
};

export default class PopUp {
  constructor() {
    this.popUpCover = document.querySelector(".pop-up-cover");
    this.popUpCard = this.popUpCover.querySelector(".pop-up__card");
    this.popUpStation = this.popUpCover.querySelector(".station");
    this.popUpCurTemp = this.popUpCover.querySelector(".temp-cur");
    this.popUpDust = this.popUpCover.querySelector(".dust");
    this.popUpMinMaxTemp = this.popUpCover.querySelector(".temp-max-min");
    this.popUpBackBtn = this.popUpCover.querySelector(".back");
    this.popUpBackBtn.addEventListener("click", () => {
      this.toggle();
    });
  }

  async getWeather(sido) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${regionsId[sido]}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async showWithInfo(station, region, dust) {
    const weatherData = await this.getWeather(region);
    const temp = weatherData.main;
    const weatherIcon = document.querySelector(".print");
    const { icon } = weatherData.weather[0];
    const color = this.getGrade(dust);

    this.popUpCard.style.backgroundColor = color;
    weatherIcon.innerHTML = `<img src="icons/${icon}.png">`;
    this.popUpStation.textContent = station;
    this.popUpStation.style.color = color;
    this.popUpDust.textContent = `미세먼지 수치 : ${dust}`;
    this.popUpCurTemp.textContent = `현재온도 : ${temp.temp}`;
    this.popUpMinMaxTemp.textContent = `체감온도 : ${temp.feels_like}`;
    this.toggle();
  }

  getGrade(dust) {
    let color;
    switch (dust) {
      case "1":
        color = "#00a1ff";
        break;
      case "2":
        color = "#60d937";
        break;
      case "3":
        color = "#feae00";
        break;
      case "4":
        color = "#ed220d";
        break;
    }
    return color;
  }

  toggle() {
    this.popUpCover.classList.toggle("hidden");
  }
}
