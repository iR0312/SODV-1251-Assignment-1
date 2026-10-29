const slides = [
    { image: "images/salad-image.jpg", title: "Fresh garden salad" },
    { image: "images/soup-image.jpg", title: "Soup of the day" },
    { image: "images/pasta-image.jpg", title: "Pasta with herbs" },
    { image: "images/sandwich-image.jpg", title: "Freshly made sandwich" },
    { image: "images/veg-pizza-image.jpg", title: "Vegetable pizza" },
    { image: "images/roasted-veg-image.jpg", title: "Roasted vegetable bowl" },
    { image: "images/skillet-image.jpg", title: "Seasonal skillet" },
    { image: "images/falafel-wrap-image.jpg", title: "Falafel wrap" },
    { image: "images/dessert-image.jpg", title: "House dessert" },
    { image: "images/fruits-image.jpg", title: "Fresh fruit plate" }
];

let slideIndex = 0;
let paused = false;
let timer;

function showSlide() {
    const dish = document.getElementById("dish");

    dish.src = slides[slideIndex].image;
    dish.alt = slides[slideIndex].title;

    document.getElementById("slideTitle").textContent =
        slides[slideIndex].title;

    document.getElementById("slideCount").textContent =
        `Picture ${slideIndex + 1} of ${slides.length}`;
}

function startCarousel() {
    clearInterval(timer);

    timer = setInterval(function () {
        if (!paused) {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide();
        }
    }, 4000);
}

document.getElementById("previousSlide").addEventListener("click", function () {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide();
    startCarousel();
});

document.getElementById("nextSlide").addEventListener("click", function () {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide();
    startCarousel();
});

document.getElementById("pauseSlide").addEventListener("click", function () {
    paused = !paused;
    this.textContent = paused ? "Resume" : "Pause";
});

showSlide();
startCarousel();