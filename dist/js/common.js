"use strict";document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector(".hamburger");var c=document.querySelector(".mobile__menu");function a(){b.classList.toggle("is-active");c.classList.toggle("mobile__menu--active");document.body.classList.toggle("no-scroll");}b.addEventListener("click",a);var d=new Swiper('.swiper-container',{pagination:{el:'.swiper-pagination',type:'fraction'},navigation:{nextEl:'.control__img-right',prevEl:'.control__img-left'}});});