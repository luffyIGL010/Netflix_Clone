const carousel = document.querySelector("[data-carousel]");
const watchlistFilter = document.querySelector("[data-watchlist-filter]");
const watchlistKey = "netflix-clone-watchlist";

if (carousel && watchlistFilter) {
    const cards = [...carousel.querySelectorAll("[data-title-id]")];
    const emptyState = document.querySelector("[data-empty-state]");
    const status = document.createElement("p");
    status.className = "form-message";
    status.setAttribute("aria-live", "polite");
    watchlistFilter.insertAdjacentElement("afterend", status);

    const savedIds = JSON.parse(localStorage.getItem(watchlistKey) || "[]");
    const watchlist = new Set(
        Array.isArray(savedIds)
            ? savedIds.filter((id) => cards.some((card) => card.dataset.titleId === id))
            : []
    );
    let showingWatchlist = false;

    const updateWatchlist = () => {
        cards.forEach((card) => {
            const id = card.dataset.titleId;
            const isSaved = watchlist.has(id);
            const button = card.querySelector("[data-watchlist-toggle]");

            button.textContent = isSaved ? "✓ In My List" : "+ My List";
            button.setAttribute("aria-pressed", String(isSaved));
            button.setAttribute(
                "aria-label",
                `${isSaved ? "Remove" : "Add"} title ${id.slice(-1)} ${isSaved ? "from" : "to"} My List`
            );
            card.hidden = showingWatchlist && !isSaved;
        });

        watchlistFilter.textContent = showingWatchlist ? "Show all titles" : `My List (${watchlist.size})`;
        watchlistFilter.setAttribute("aria-pressed", String(showingWatchlist));
        emptyState.hidden = !showingWatchlist || watchlist.size > 0;
    };

    cards.forEach((card) => {
        card.querySelector("[data-watchlist-toggle]").addEventListener("click", () => {
            const id = card.dataset.titleId;

            if (watchlist.has(id)) {
                watchlist.delete(id);
                status.textContent = `Title ${id.slice(-1)} removed from My List.`;
            } else {
                watchlist.add(id);
                status.textContent = `Title ${id.slice(-1)} added to My List.`;
            }

            localStorage.setItem(watchlistKey, JSON.stringify([...watchlist]));
            updateWatchlist();
        });
    });

    watchlistFilter.addEventListener("click", () => {
        showingWatchlist = !showingWatchlist;
        updateWatchlist();
    });

    document.querySelectorAll("[data-carousel-direction]").forEach((button) => {
        button.addEventListener("click", () => {
            carousel.scrollBy({
                left: Number(button.dataset.carouselDirection) * carousel.clientWidth * 0.8,
                behavior: "smooth"
            });
        });
    });

    updateWatchlist();
}

document.querySelectorAll(".hero-form form, .form-2 form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.nextElementSibling.textContent =
            "Thanks! Account creation isn't connected in this demo.";
    });
});

const passwordToggle = document.querySelector("[data-password-toggle]");

if (passwordToggle) {
    const passwordInput = passwordToggle.previousElementSibling;

    passwordToggle.addEventListener("click", () => {
        const shouldShowPassword = passwordInput.type === "password";

        passwordInput.type = shouldShowPassword ? "text" : "password";
        passwordToggle.textContent = shouldShowPassword ? "Hide password" : "Show password";
        passwordToggle.setAttribute("aria-pressed", String(shouldShowPassword));
    });
}

const signInForm = document.querySelector("[data-demo-signin]");

if (signInForm) {
    signInForm.addEventListener("submit", (event) => {
        event.preventDefault();
        signInForm.querySelector(".form-message").textContent =
            "Sign-in isn't connected in this demo.";
    });
}
