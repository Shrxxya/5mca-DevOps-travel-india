(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Highlight the current page in the nav */
    function markActiveNavLink() {
        var path = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-links a").forEach(function (link) {
            var linkPath = link.getAttribute("href").split("/").pop().split("#")[0];
            if (linkPath === path || (linkPath === "" && path === "index.html")) {
                link.setAttribute("aria-current", "page");
            }
        });
    }

    /* Mobile nav toggle */
    function setupNavToggle() {
        var toggle = document.querySelector(".nav-toggle");
        var links = document.querySelector(".nav-links");
        if (!toggle || !links) return;

        toggle.addEventListener("click", function () {
            var isOpen = links.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        links.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                links.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* Sticky header gains a shadow once the page scrolls, driven by an
       IntersectionObserver sentinel instead of a scroll listener. */
    function setupHeaderScrollState() {
        var header = document.querySelector(".site-header");
        var sentinel = document.querySelector("#scroll-sentinel");
        if (!header || !sentinel || !("IntersectionObserver" in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
        });
        observer.observe(sentinel);
    }

    /* Scroll-reveal for elements marked with .reveal. Elements are only
       hidden ("armed") once we've confirmed this script is running and an
       observer is in place to bring them back, so a JS failure never
       leaves content permanently invisible. */
    function setupScrollReveal() {
        var items = document.querySelectorAll(".reveal");
        if (!items.length) return;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        items.forEach(function (el, index) {
            el.style.transitionDelay = Math.min(index * 60, 240) + "ms";
            el.classList.add("reveal-armed");
            observer.observe(el);
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        markActiveNavLink();
        setupNavToggle();
        setupHeaderScrollState();
        setupScrollReveal();
    });
})();
