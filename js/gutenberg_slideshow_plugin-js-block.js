const apiUrl = "https://wptavern.com/wp-json/wp/v2/posts";

document.addEventListener("DOMContentLoaded", function () {
  const targetElement = document.querySelector("body");

  function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const postLink = document.createElement("a");
    postLink.href = post.link;

    if (post.featured_media) {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");

      const image = document.createElement("img");
      fetch(`https://wptavern.com/wp-json/wp/v2/media/${post.featured_media}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((mediaData) => {
          image.src = mediaData.source_url;
          image.alt = mediaData.alt_text;
          imageContainer.appendChild(image);
        })
        .catch((error) => {
          console.error("Error fetching media:", error);
        });

      const title = document.createElement("h2");
      title.textContent = post.title.rendered;
      postLink.appendChild(title);
      postDiv.appendChild(imageContainer);
    }

    const dateAuthor = document.createElement("p");
    const publishedDate = new Date(post.date);
    const authorName = "by Sarah Gooding";
    dateAuthor.textContent = `${publishedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} ${authorName}`;

    postDiv.appendChild(postLink);
    postDiv.appendChild(dateAuthor);

    return postDiv;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const parentContainer = document.createElement("div");
      parentContainer.classList.add("parent-container");

      const prevButtonContainer = document.createElement("div");
      prevButtonContainer.classList.add("prev-button-container");

      const prevBtn = document.createElement("button");
      prevBtn.textContent = "<";
      prevBtn.addEventListener("click", () => {
        stopAutoScroll();
        prevSlide();
        startAutoScroll();
      });

      prevButtonContainer.appendChild(prevBtn);

      const nextButtonContainer = document.createElement("div");
      nextButtonContainer.classList.add("next-button-container");

      const nextBtn = document.createElement("button");
      nextBtn.textContent = ">";
      nextBtn.addEventListener("click", () => {
        stopAutoScroll();
        nextSlide();
        startAutoScroll();
      });

      nextButtonContainer.appendChild(nextBtn);

      const slider = document.createElement("div");
      slider.classList.add("slider");

      data.forEach((post) => {
        const postElement = createPostElement(post);
        slider.appendChild(postElement);
      });

      parentContainer.appendChild(prevButtonContainer);
      parentContainer.appendChild(slider);
      parentContainer.appendChild(nextButtonContainer);

      if (targetElement) {
        targetElement.appendChild(parentContainer);
      }

      let currentSlide = 0;
      const slides = slider.querySelectorAll(".post");
      const slideCount = slides.length;
      let autoScrollInterval;

      function showSlide(slideIndex) {
        slides.forEach((slide, index) => {
          slide.style.display = index === slideIndex ? "block" : "none";
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(currentSlide);
      }

      function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 4000);
      }

      function stopAutoScroll() {
        clearInterval(autoScrollInterval);
      }

      showSlide(currentSlide);
      startAutoScroll();

      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          stopAutoScroll();
          prevSlide();
          startAutoScroll();
        } else if (event.key === "ArrowRight") {
          stopAutoScroll();
          nextSlide();
          startAutoScroll();
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
