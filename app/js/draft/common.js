document.addEventListener('DOMContentLoaded', function(){
    // mobile menu
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile__menu");

    function toggleMobileMenu (){
        hamburger.classList.toggle("is-active");
        mobileMenu.classList.toggle("mobile__menu--active");
        document.body.classList.toggle("no-scroll");
    }

    hamburger.addEventListener("click", toggleMobileMenu);

    // slider
    const swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.control__img-right',
            prevEl: '.control__img-left',
        },
    });

});