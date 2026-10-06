// Make ScrollTrigger available for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSection = document.querySelectorAll(".scroll-section");

scrollSection.forEach((section) => {
  const wrapper = section.querySelector(".wrapper");
  const items = wrapper.querySelectorAll(".item");

  // Initialize
  let direction = null;

  if (section.classList.contains("vertical-section")) {
    direction = "vertical";
  } else if (section.classList.contains("horizontal-section")) {
    direction = "horizontal";
  }

  initScroll(section, items, direction);
});

function initScroll(section, items, direction) {
  // ---------------------------------------------------------------
  // 1. INITIAL STATES
  //    First item stays in place. Every other item is offset on the
  //    axis based on its own class (from-top / from-bottom for
  //    vertical, from-left / from-right for horizontal).
  // ---------------------------------------------------------------
  items.forEach((item, index) => {
    if (index === 0) return; // first card is already visible

    if (direction === "horizontal") {
      const startX = item.classList.contains("from-left") ? -100 : 100;
      gsap.set(item, { xPercent: startX });
    } else {
      const startY = item.classList.contains("from-top") ? -100 : 100;
      gsap.set(item, { yPercent: startY });
    }
  });

  // ---------------------------------------------------------------
  // 2. TIMELINE (unchanged logic)
  // ---------------------------------------------------------------
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
    defaults: { ease: "none" },
  });

  items.forEach((item, index) => {
    // Shrink / round the current card as the next one comes in
    timeline.to(item, {
      scale: 0.9,
      borderRadius: "10px",
    });

    const nextItem = items[index + 1];
    if (!nextItem) return;

    // Bring the next card to its neutral position on the same beat.
    // Because each item was offset individually in step 1, we don't
    // need to know here which side it came from — we just reset.
    if (direction === "horizontal") {
      timeline.to(nextItem, { xPercent: 0 }, "<");
    } else {
      timeline.to(nextItem, { yPercent: 0 }, "<");
    }
  });
}