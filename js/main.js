/* =========================================================
   LINKS: every external app/CV link lives here.
   Leave a value empty ("") and its button shows as "coming soon".
   ========================================================= */
const LINKS = {
    cv: "https://drive.google.com/file/d/1yM3WpBLHyt_AT1xCwq5UA7u3bWj3qdc-/view?usp=sharing",
    ideyPlay: "https://play.google.com/store/apps/details?id=com.idey.app",
    // Still in Play review (listing returns 404). Once public, set to:
    // https://play.google.com/store/apps/details?id=com.labafoods.app
    labaPlay: "",
    ridifyApk: "https://drive.google.com/drive/folders/1b2G52h2F3HYau-kJtyrP7pYyWTzL4HAj?usp=sharing",
    movixVideo: "https://drive.google.com/drive/folders/1sn20VyBBRL31IrQJGZuba4KdV-1lk0mg?usp=drive_link",
    movixWeb: "https://movixapp-sable.vercel.app",
};

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Links ---------- */
document.querySelectorAll("[data-link]").forEach((a) => {
    const url = LINKS[a.dataset.link];
    if (url) {
        a.href = url;
        return;
    }
    if (a.dataset.pendingLabel === "") {
        a.remove();
        return;
    }
    a.removeAttribute("href");
    a.classList.add("is-pending");
    a.setAttribute("aria-disabled", "true");
    a.title = a.dataset.pendingLabel || "Link coming soon";
});

/* ---------- Status bars for screens exported without one ---------- */
const STATUS_ICONS =
    '<svg viewBox="0 0 54 16" aria-hidden="true">' +
    '<path d="M1 15h3v-4H1zM6 15h3V8H6zM11 15h3V5h-3zM16 15h3V1h-3z"/>' +
    '<path d="M30 15.5 22.6 7.2a10.6 10.6 0 0 1 14.8 0Z"/>' +
    '<rect x="41" y="3" width="11" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<rect x="43" y="5" width="7" height="6" rx="1"/><rect x="52.6" y="6" width="1.4" height="4" rx=".7"/></svg>';

const addStatusBar = (screen) => {
    screen.querySelector(".statusbar")?.remove();
    if (!screen.dataset.bar) return;
    const bar = document.createElement("span");
    bar.className = "statusbar";
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = `<span>9:41</span>${STATUS_ICONS}`;
    screen.prepend(bar);
};
document.querySelectorAll(".phone__screen[data-bar]").forEach(addStatusBar);

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const links = document.getElementById("nav-links");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
links.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
});

/* ---------- Reveal on scroll ---------- */
const revealables = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach((el) => io.observe(el));
} else {
    revealables.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Galleries ---------- */
const visibleTrack = (gallery) =>
    [...gallery.querySelectorAll(".gallery__track")].find((t) => !t.hidden);

const updateNav = (gallery) => {
    const track = visibleTrack(gallery);
    const [prev, next] = gallery.querySelectorAll(".gallery__nav .icon-btn");
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
    track.classList.toggle("at-end", next.disabled);
    gallery.querySelector(".gallery__nav").hidden = max <= 4;
};

document.querySelectorAll(".gallery").forEach((gallery) => {
    gallery.querySelectorAll(".gallery__nav .icon-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const track = visibleTrack(gallery);
            const shot = track.querySelector(".shot");
            const step = shot ? shot.offsetWidth + 28 : track.clientWidth * 0.8;
            track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: reduceMotion ? "auto" : "smooth" });
        });
    });
    gallery.querySelectorAll(".gallery__track").forEach((track) => {
        track.addEventListener("scroll", () => updateNav(gallery), { passive: true });
    });

    // Tabs (Lábà FOODS customer / rider)
    const tabs = gallery.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => {
                const selected = t === tab;
                t.setAttribute("aria-selected", String(selected));
                document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
            });
            visibleTrack(gallery).scrollLeft = 0;
            updateNav(gallery);
        });
        tab.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const list = [...tabs];
            const i = (list.indexOf(tab) + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
            list[i].focus();
            list[i].click();
        });
    });

    updateNav(gallery);
});
window.addEventListener("resize", () => document.querySelectorAll(".gallery").forEach(updateNav));

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbPhone = lightbox.querySelector(".lightbox__phone");
const lbScreen = lightbox.querySelector(".phone__screen");
const lbImg = lightbox.querySelector("img");
const lbCaption = lightbox.querySelector(".lightbox__caption");
let lbItems = [];
let lbIndex = 0;
let lbReturnFocus = null;

const showShot = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const btn = lbItems[lbIndex];
    const img = btn.querySelector("img");
    lbPhone.classList.toggle("phone--ios", btn.classList.contains("phone--ios"));
    lbPhone.classList.toggle("phone--android", !btn.classList.contains("phone--ios"));
    const screen = btn.querySelector(".phone__screen");
    lbScreen.style.setProperty("--screen-bg", screen.style.getPropertyValue("--screen-bg"));
    if (screen.dataset.bar) lbScreen.dataset.bar = screen.dataset.bar;
    else delete lbScreen.dataset.bar;
    addStatusBar(lbScreen);
    lbImg.src = btn.dataset.full;
    lbImg.alt = img.alt;
    lbCaption.textContent = btn.closest(".shot").querySelector("figcaption").textContent;
};

const openLightbox = (btn) => {
    lbItems = [...btn.closest(".gallery__track").querySelectorAll("button.phone")];
    lbReturnFocus = btn;
    showShot(lbItems.indexOf(btn));
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox__close").focus();
};

const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lbReturnFocus) lbReturnFocus.focus();
};

document.querySelectorAll("button.phone[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn));
});
lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox__prev").addEventListener("click", () => showShot(lbIndex - 1));
lightbox.querySelector(".lightbox__next").addEventListener("click", () => showShot(lbIndex + 1));
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showShot(lbIndex - 1);
    if (e.key === "ArrowRight") showShot(lbIndex + 1);
    if (e.key === "Tab") {
        // keep focus inside the dialog
        const focusables = [...lightbox.querySelectorAll("button")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

/* ---------- Hero tilt (pointer devices only) ---------- */
const tilt = document.querySelector("[data-tilt]");
if (tilt && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    hero.addEventListener("pointerleave", () => {
        tilt.style.transform = "";
    });
}

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
