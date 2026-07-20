(function () {
    "use strict";

    const TRACKING_KEYS = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "gclid",
        "fbclid"
    ];

    function trackingData() {
        const query = new URLSearchParams(window.location.search);
        const result = {};

        TRACKING_KEYS.forEach(function (key) {
            const value = query.get(key);

            if (value) {
                result[key] = value;
            }
        });

        return result;
    }

    function renderSuccess(container, message) {
        const success = document.createElement("div");
        success.className = "mil-center mil-up mil-mb-60";
        success.style.opacity = "0";
        success.style.transform = "translateY(20px)";

        const heading = document.createElement("h4");
        heading.className = "mil-mb-15";
        heading.textContent = "Message Sent!";

        const copy = document.createElement("p");
        copy.className = "mil-mb-30";
        copy.textContent =
            message ||
            "Thank you for getting in touch. I will get back to you as soon as possible.";

        success.appendChild(heading);
        success.appendChild(copy);

        container.replaceChildren(success);

        if (window.gsap) {
            window.gsap.to(success, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "sine"
            });
        } else {
            success.style.opacity = "1";
            success.style.transform = "none";
        }
    }

    function initLeadstrackrForm() {
        const form = document.querySelector(
            "#contact-form form[data-leadstrackr-form]"
        );

        if (!form || form.dataset.leadstrackrBound === "true") {
            return;
        }

        const container = document.querySelector("#contact-form");
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonLabel = submitButton
            ? submitButton.querySelector("span")
            : null;

        if (!container || !submitButton || !form.dataset.endpoint) {
            return;
        }

        form.dataset.leadstrackrBound = "true";

        const status = document.createElement("p");
        status.className = "mil-up mil-mb-30";
        status.setAttribute("role", "status");
        status.hidden = true;
        form.appendChild(status);

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(form);

            const payload = {
                name: String(formData.get("name") || "").trim(),
                email: String(formData.get("email") || "").trim(),
                message: String(formData.get("message") || "").trim(),
                website: String(formData.get("website") || "").trim(),
                source_url: window.location.href,
                referrer_url: document.referrer,
                tracking_data: trackingData()
            };

            submitButton.disabled = true;
            status.hidden = false;
            status.textContent = "Sending your message…";

            if (buttonLabel) {
                buttonLabel.textContent = "Sending…";
            }

            try {
                const response = await fetch(form.dataset.endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(function () {
                    return {};
                });

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Your message could not be sent. Please try again."
                    );
                }

                if (window.gsap) {
                    window.gsap.to(form, {
                        opacity: 0,
                        y: -20,
                        duration: 0.4,
                        onComplete: function () {
                            renderSuccess(container, data.message);
                        }
                    });
                } else {
                    renderSuccess(container, data.message);
                }
            } catch (error) {
                status.textContent =
                    error.message ||
                    "Your message could not be sent. Please email cary.wood.777@gmail.com.";

                submitButton.disabled = false;

                if (buttonLabel) {
                    buttonLabel.textContent = "Send message";
                }
            }
        });
    }

    initLeadstrackrForm();

    document.addEventListener(
        "DOMContentLoaded",
        initLeadstrackrForm,
        { once: true }
    );

    document.addEventListener(
        "swup:contentReplaced",
        initLeadstrackrForm
    );
})();
