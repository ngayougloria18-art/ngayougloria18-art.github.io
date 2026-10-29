
/* =========================================
   1. SÉLECTION DES ÉLÉMENTS
========================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("back-to-top");
const typingText = document.getElementById("typing-text");
const yearElement = document.getElementById("year");

/* =========================================
   2. ANNÉE AUTOMATIQUE
========================================= */

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   3. MENU MOBILE
========================================= */

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
        icon.classList.replace("fa-xmark", "fa-bars");
    }
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fermer le menu" : "Ouvrir le menu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    });

    navItems.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            closeMenu();
        }
    });
}

/* =========================================
   4. EFFETS AU DÉFILEMENT
========================================= */

function updateScrollUI() {
    const scrollPosition = window.scrollY;

    if (header) {
        header.classList.toggle("scrolled", scrollPosition > 30);
    }

    if (backToTop) {
        backToTop.classList.toggle("visible", scrollPosition > 450);
    }
}

window.addEventListener("scroll", updateScrollUI, {
    passive: true
});

updateScrollUI();

/* Retour en haut */

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* =========================================
   5. APPARITION DES ÉLÉMENTS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

/* =========================================
   6. NAVIGATION ACTIVE
========================================= */

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navItems.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-30% 0px -55% 0px",
            threshold: 0
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

/* =========================================
   7. TEXTE ANIMÉ
========================================= */

const words = [
    "l'intelligence artificielle",
    "le développement web",
    "la programmation",
    "l'innovation numérique"
];

let wordIndex = 0;
let characterIndex = 0;
let deleting = false;
let typingTimer;

function typeEffect() {
    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (deleting) {
        characterIndex--;
    } else {
        characterIndex++;
    }

    typingText.textContent = currentWord.slice(
        0,
        Math.max(0, characterIndex)
    );

    let delay = deleting ? 35 : 75;

    if (!deleting && characterIndex === currentWord.length) {
        deleting = true;
        delay = 1600;
    } else if (deleting && characterIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
    }

    typingTimer = window.setTimeout(typeEffect, delay);
}

if (typingText && !reduceMotion) {
    typeEffect();
}

/* =========================================
   8. PETITES AMÉLIORATIONS
========================================= */

/* Éviter que le navigateur conserve le menu ouvert
   après un retour depuis une autre page. */

window.addEventListener("pageshow", () => {
    closeMenu();
});

/* Respecter les préférences de mouvement si elles
   changent pendant que la page est ouverte. */

const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

motionPreference.addEventListener?.("change", (event) => {
    if (event.matches && typingTimer) {
        window.clearTimeout(typingTimer);

        if (typingText) {
            typingText.textContent = words[0];
        }
    }
});
