const date = document.querySelector(".date span");

const today = new Date();
date.textContent = `${today.getFullYear()}.${
  today.getMonth() + 1
}.${today.getDate()}`;
