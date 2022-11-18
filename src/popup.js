"use strict";

export default class PopUp {
  constructor() {
    this.popUpCover = document.querySelector(".pop-up-cover");
    this.popUpBackBtn = this.popUpCover.querySelector(".back");
    this.popUpBackBtn.addEventListener("click", () => {
      this.toggle();
    });
  }

  showWithInfo(station, region, dust) {
    const popUpStation = this.popUpCover.querySelector(".station");
    const popUpRegion = this.popUpCover.querySelector(".region");
    const popUpCurTemp = this.popUpCover.querySelector(".temp-cur");
    const popUpDust = this.popUpCover.querySelector(".dust");

    popUpStation.textContent = station;
    popUpRegion.textContent = region;
    popUpDust.textContent = `미세먼지 수치 : ${dust}`;

    this.toggle();
  }

  toggle() {
    this.popUpCover.classList.toggle("hidden");
  }
}
