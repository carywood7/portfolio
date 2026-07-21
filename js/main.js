/* -------------------------------------------

Name: 		Courtney
Version:    1.0
Developer:	Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

$(function () {

    "use strict";

    /***************************

    swup

    ***************************/
    const options = {
        containers: ['#swupMain', '#swupPerson', '#swupBg', '#swupSkills', '#swupMenu'],
        animateHistoryBrowsing: true,
        linkSelector: 'a:not([data-no-swup])',
        plugins: [new SwupBodyClassPlugin()]
    };
    const swup = new Swup(options);

    const bodyClassPlugin = new SwupBodyClassPlugin({
        prefix: '.mil-fw-page'
    });

    function initPortfolioHoverVideos() {
        document.querySelectorAll('.portfolio-hover-preview').forEach(function (preview) {
            if (preview.dataset.hoverVideoReady === 'true') {
                return;
            }

            const video = preview.querySelector('.portfolio-preview-video');

            if (!video) {
                return;
            }

            preview.dataset.hoverVideoReady = 'true';

            preview.addEventListener('mouseenter', function () {
                const playRequest = video.play();

                if (playRequest !== undefined) {
                    playRequest.then(function () {
                        if (preview.matches(':hover')) {
                            preview.classList.add('mil-video-playing');
                        }
                    }).catch(function () {
                        preview.classList.remove('mil-video-playing');
                    });
                } else {
                    preview.classList.add('mil-video-playing');
                }
            });

            preview.addEventListener('mouseleave', function () {
                preview.classList.remove('mil-video-playing');
                video.pause();
                video.currentTime = 0;
            });
        });
    }

    initPortfolioHoverVideos();

    /***************************

    register gsap plugins

    ***************************/
    gsap.registerPlugin(ScrollTrigger);

    const projectDataCache = {};
    const testimonialDataCache = {};
    let reviewsSwiperInstance = null;
    let portfolioSwiperInstance = null;

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function resolveProjectAsset(path, source) {
        if (!path) {
            return '';
        }

        return new URL(path, new URL(source, window.location.href)).href;
    }

    function projectArrowIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
    }

    function animateProjectCards(container) {
        const projectElements = container.querySelectorAll(".mil-up");

        projectElements.forEach((section) => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 50,
                ease: 'sine',
            }, {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: section,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        ScrollTrigger.refresh();
    }

    function renderProjectCards(container, projects, source) {
        // Show at most 4 projects on the index page
        const projectsToShow = projects.slice(0, 4);

        let html = projectsToShow.map(function (project) {
            const title = escapeHtml(project.title || project.name || 'Project');
            const category = escapeHtml(project.category || 'Project');
            const image = resolveProjectAsset(project.image, source);
            const video = resolveProjectAsset(project.video, source);

            return '<div class="col-lg-6">' +
                '<button type="button" class="mil-portfolio-item mil-project-card mil-mb-60" data-project-video="' + escapeHtml(video) + '" data-project-title="' + title + '" aria-label="Play video for ' + title + '">' +
                '<div class="mil-cover-frame mil-up">' +
                '<img src="' + escapeHtml(image) + '" alt="' + title + ' cover" loading="lazy">' +
                '</div>' +
                '<div class="mil-description mil-up">' +
                '<div><p class="mil-upper mil-mb-5">' + category + '</p><h4>' + title + '</h4></div>' +
                '<div class="mil-link mil-icon-link" aria-hidden="true">' + projectArrowIcon() + '</div>' +
                '</div>' +
                '</button>' +
                '</div>';
        }).join('');

        if (projects.length > 4) {
            html += '<div class="col-lg-12 mil-center mil-up mil-mb-60">' +
                '<a href="projects.html" class="mil-btn mil-sm-btn" data-no-swup>Show more</a>' +
                '</div>';
        }

        container.innerHTML = html;
        container.hidden = false;

        animateProjectCards(container);
    }

    function initProjects() {
        const container = document.querySelector("#projectsGrid");

        if (!container) {
            return;
        }

        const source = container.dataset.projectsSource || 'data/projects.json';

        if (!projectDataCache[source]) {
            projectDataCache[source] = fetch(source).then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load project data.');
                }

                return response.json();
            });
        }

        projectDataCache[source].then(function (data) {
            renderProjectCards(container, data.projects || [], source);
        }).catch(function () {
            container.innerHTML = '<div class="col-lg-12"><p class="mil-up">Projects could not be loaded right now.</p></div>';
            container.hidden = false;
        });
    }

    function renderProjectSlides(container, projects, source) {
        container.innerHTML = projects.map(function (project) {
            const title = escapeHtml(project.title || project.name || 'Project');
            const category = escapeHtml(project.category || 'Lead Generation Funnel');
            const description = escapeHtml(project.description || '');
            const status = escapeHtml(project.status || 'Campaign Showcase');
            const image = resolveProjectAsset(project.image, source);
            const video = resolveProjectAsset(project.video, source);

            return '<div class="swiper-slide">' +
                '<article class="mil-funnel-slide">' +
                    '<div class="mil-cover-frame portfolio-hover-preview">' +
                        '<img ' +
                            'src="' + escapeHtml(image) + '" ' +
                            'alt="' + title + ' landing-page preview" ' +
                            'class="portfolio-preview-image" ' +
                            'loading="lazy" ' +
                            'data-swiper-parallax="-130" ' +
                            'data-swiper-parallax-scale="1.15"' +
                        '>' +
                        '<video ' +
                            'class="portfolio-preview-video" ' +
                            'muted ' +
                            'loop ' +
                            'playsinline ' +
                            'preload="metadata" ' +
                            'data-swiper-parallax="-130" ' +
                            'data-swiper-parallax-scale="1.15"' +
                        '>' +
                            '<source src="' + escapeHtml(video) + '" type="video/mp4">' +
                        '</video>' +
                    '</div>' +
                    '<div class="mil-funnel-slide-content">' +
                        '<div class="mil-funnel-slide-meta">' +
                            '<span>' + status + '</span>' +
                            '<span>' + category + '</span>' +
                        '</div>' +
                        '<h4>' + title + '</h4>' +
                        '<p>' + description + '</p>' +
                        '<button ' +
                            'type="button" ' +
                            'class="mil-project-card mil-funnel-preview-btn" ' +
                            'data-project-video="' + escapeHtml(video) + '" ' +
                            'data-project-title="' + title + '" ' +
                            'aria-label="View the page walkthrough for ' + title + '"' +
                        '>' +
                            'View Page Walkthrough ' +
                            '<span aria-hidden="true">→</span>' +
                        '</button>' +
                    '</div>' +
                '</article>' +
            '</div>';
        }).join('');
    }

    function initProjectsCarousel() {
        const wrapper = document.querySelector('#projectsSwiperWrapper');

        if (!wrapper) {
            return;
        }

        const carousel = wrapper.closest('.mil-portfolio-carousel');
        const showcase = wrapper.closest('.mil-funnel-showcase');

        if (!carousel || !showcase) {
            return;
        }

        const source = carousel.dataset.projectsSource || 'data/projects.json';
        const previousButton = showcase.querySelector('.mil-portfolio-prev');
        const nextButton = showcase.querySelector('.mil-portfolio-next');
        const pagination = showcase.querySelector('.mil-portfolio-pagination');

        if (!projectDataCache[source]) {
            projectDataCache[source] = fetch(source).then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load project data.');
                }

                return response.json();
            });
        }

        projectDataCache[source].then(function (data) {
            if (portfolioSwiperInstance && portfolioSwiperInstance.destroy) {
                portfolioSwiperInstance.destroy(true, true);
                portfolioSwiperInstance = null;
            }

            renderProjectSlides(wrapper, data.projects || [], source);
            initPortfolioHoverVideos();

            portfolioSwiperInstance = new Swiper(carousel, {
                slidesPerView: 1,
                spaceBetween: 30,
                speed: 800,
                parallax: true,
                watchOverflow: true,
                observer: true,
                observeParents: true,
                mousewheel: {
                    enabled: true,
                    forceToAxis: true,
                },
                navigation: {
                    nextEl: nextButton,
                    prevEl: previousButton,
                },
                pagination: {
                    el: pagination,
                    type: 'fraction',
                },
                breakpoints: {
                    1200: {
                        spaceBetween: 60,
                    },
                },
            });
        }).catch(function (error) {
            console.error(error);
            wrapper.innerHTML = '<div class="swiper-slide"><p>Projects could not be loaded.</p></div>';
        });
    }

    function initContactForm() {
        const form = document.querySelector("#contact-form form");
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const container = document.querySelector("#contact-form");
            if (container) {
                gsap.to(form, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    onComplete: function () {
                        container.innerHTML =
                            '<div class="mil-center mil-up mil-mb-60" style="opacity: 0; transform: translateY(20px);">' +
                            '<h4 class="mil-mb-15">Message Sent!</h4>' +
                            '<p class="mil-mb-30">Thank you for getting in touch. I will get back to you as soon as possible.</p>' +
                            '</div>';

                        const successEl = container.querySelector(".mil-center");
                        gsap.to(successEl, {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: "sine"
                        });
                    }
                });
            }
        });
    }

    function initReviewsSlider() {
        const slider = document.querySelector(".mil-reviews-slider");

        if (!slider) {
            return;
        }

        if (reviewsSwiperInstance && reviewsSwiperInstance.destroy) {
            reviewsSwiperInstance.destroy(true, true);
        }

        reviewsSwiperInstance = new Swiper('.mil-reviews-slider', {
            spaceBetween: 30,
            speed: 800,
            parallax: true,
            navigation: {
                nextEl: '.mil-reviews-next',
                prevEl: '.mil-reviews-prev',
            },
            pagination: {
                el: '.swiper-reviews-pagination',
                clickable: true,
            },
        });
    }

    function renderTestimonials(container, testimonials) {
        container.innerHTML = testimonials.map(function (testimonial) {
            const title = escapeHtml(testimonial.title || 'Selected Result');
            const text = escapeHtml(testimonial.text || '');

            return '<div class="swiper-slide">' +
                '<div class="mil-review mil-center" data-swiper-parallax-opacity="0" data-swiper-parallax="-90" data-swiper-parallax-scale=".8">' +
                '<div class="mil-review-top">' +
                '<div class="mil-name">' +
                '<h4 class="mil-upper mil-up">' + title + '</h4>' +
                '</div>' +
                '</div>' +
                '<p class="mil-up">' + text + '</p>' +
                '</div>' +
                '</div>';
        }).join('');

        container.hidden = false;
        initReviewsSlider();
        animateProjectCards(container);
    }

    function initTestimonials() {
        const container = document.querySelector("#testimonialsSlider");

        if (!container) {
            return;
        }

        const source = container.dataset.testimonialsSource || 'data/testimonials.json';

        if (!testimonialDataCache[source]) {
            testimonialDataCache[source] = fetch(source).then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load testimonial data.');
                }

                return response.json();
            });
        }

        testimonialDataCache[source].then(function (data) {
            renderTestimonials(container, data.testimonials || [], source);
        }).catch(function () {
            container.innerHTML = '<div class="swiper-slide"><div class="mil-review mil-center"><p class="mil-up">Testimonials could not be loaded right now.</p></div></div>';
            container.hidden = false;
            initReviewsSlider();
        });
    }

    function ensureProjectDialog() {
        let dialog = document.querySelector(".mil-project-dialog");

        if (dialog) {
            return dialog;
        }

        dialog = document.createElement("div");
        dialog.className = "mil-project-dialog";
        dialog.setAttribute("aria-hidden", "true");
        dialog.innerHTML = '<div class="mil-project-dialog-backdrop" data-project-dialog-close></div>' +
            '<div class="mil-project-dialog-panel" role="dialog" aria-modal="true" aria-label="Project video">' +
            '<button type="button" class="mil-project-dialog-close" aria-label="Close project video" data-project-dialog-close>' +
            '<span></span><span></span>' +
            '</button>' +
            '<video class="mil-project-dialog-video" playsinline autoplay muted loop></video>' +
            '</div>';
        document.body.appendChild(dialog);

        return dialog;
    }

    function closeProjectDialog() {
        const dialog = document.querySelector(".mil-project-dialog");

        if (!dialog) {
            return;
        }

        const video = dialog.querySelector("video");
        dialog.classList.remove("mil-active");
        dialog.setAttribute("aria-hidden", "true");
        document.body.classList.remove("mil-project-dialog-open");

        window.setTimeout(function () {
            if (!dialog.classList.contains("mil-active")) {
                video.pause();
                video.removeAttribute("src");
                video.load();
            }
        }, 350);
    }

    function openProjectDialog(videoSrc, title) {
        if (!videoSrc) {
            return;
        }

        const dialog = ensureProjectDialog();
        const panel = dialog.querySelector(".mil-project-dialog-panel");
        const video = dialog.querySelector("video");

        panel.setAttribute("aria-label", title ? title + ' video' : 'Project video');
        video.src = videoSrc;
        video.muted = true;
        video.loop = true;
        video.play().catch(function () {});

        dialog.classList.add("mil-active");
        dialog.setAttribute("aria-hidden", "false");
        document.body.classList.add("mil-project-dialog-open");
    }

    function setupProjectVideoDialog() {
        $(document).off("click.projectDialog").on("click.projectDialog", ".mil-project-card", function (event) {
            event.preventDefault();
            openProjectDialog(this.dataset.projectVideo, this.dataset.projectTitle);
        });

        $(document).off("click.projectDialogClose").on("click.projectDialogClose", "[data-project-dialog-close]", function () {
            closeProjectDialog();
        });

        $(document).off("keydown.projectDialog").on("keydown.projectDialog", function (event) {
            if (event.key === "Escape") {
                closeProjectDialog();
            }
        });
    }

    setupProjectVideoDialog();
    initProjects();
    initProjectsCarousel();
    initTestimonials();
    initContactForm();

    /***************************

    preloader

    ***************************/
    var timeline = gsap.timeline();

    timeline.to(".mil-preloader-content", {
        ease: "sine",
        y: 0,
        duration: 0.4,
        scale: 1,
        opacity: 1,
        delay: '.2',
    });

    timeline.to(".mil-preloader-content", {
        ease: "sine",
        y: '-200',
        duration: 0.4,
        scale: .6,
        opacity: 0,
        delay: '1.2',
    });

    timeline.to(".mil-preloader-frame", {
        ease: "sine",
        duration: 0.4,
        height: 0,
        onComplete: function () {
            $('html').removeClass('is-animating');
        }
    });
    /***************************

    scroll progress

    ***************************/
    gsap.to('.mil-progress', {
        height: '100%',
        ease: 'linear',
        scrollTrigger: {
            scrub: 1
        }
    });
    /***************************

    parallax

    ***************************/
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        limitY: 15,
    });
    /***************************

    anchor scroll

    ***************************/
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        var target = $($.attr(this, 'href'));
        var offset = 90;

        if (!target.length) {
            return;
        }

        $(".mil-navigation , .mil-menu-btn").removeClass('mil-active');

        $('html, body').animate({
            scrollTop: target.offset().top - offset
        }, 400);
    });
    /***************************

    back to top

    ***************************/
    const btt = document.querySelector(".mil-back-to-top .mil-link");

    gsap.set(btt, {
        opacity: .5,
    });

    gsap.to(btt, {
        opacity: 1,
        ease: 'sine',
        scrollTrigger: {
            trigger: "body",
            start: "top -20%",
            end: "top -20%",
            toggleActions: "play none reverse none"
        }
    });
    /***************************

    scroll animations

    ***************************/

    const appearance = document.querySelectorAll(".mil-up");

    appearance.forEach((section) => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 50,
            ease: 'sine',
        }, {
            y: 0,
            opacity: 1,
            scrollTrigger: {
                trigger: section,
                toggleActions: 'play none none reverse',
            }
        });
    });

    const rotate = document.querySelectorAll(".mil-rotate");

    rotate.forEach((section) => {
        var value = $(section).data("value");
        gsap.fromTo(section, {
            ease: 'sine',
            rotate: 0,

        }, {
            rotate: value,
            scrollTrigger: {
                trigger: section,
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
    });
    /***************************

    progressbar type 1

    ***************************/

    const progGo = document.querySelectorAll(".mil-circular-progress");

    progGo.forEach((section) => {
        var value = $(section).data("value");
        gsap.fromTo(section, {
            "--p": '0',
            ease: 'sine',
        }, {
            "--p": value,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                toggleActions: 'play none none reverse',
            }
        });
    });

    /***************************

    counter

    ***************************/
    const number = $(".mil-counter");
    number.each(function (index, element) {
        var count = $(this),
            zero = {
                val: 0
            },
            num = count.data("number"),
            split = (num + "").split("."), // to cover for instances of decimals
            decimals = split.length > 1 ? split[1].length : 0;

        gsap.to(zero, {
            val: num,
            duration: 2,
            scrollTrigger: {
                trigger: element,
                toggleActions: 'play none none reverse',
            },
            onUpdate: function () {
                count.text(zero.val.toFixed(decimals));
            }
        });
    });

    /***************************

    progressbars type 2

    ***************************/
    const width = document.querySelectorAll(".mil-bar");

    width.forEach((section) => {
        var value = $(section).data("value");
        gsap.fromTo(section, {
            width: 0,
            duration: 5000,
            ease: 'sine',
        }, {
            width: value,
            scrollTrigger: {
                trigger: section,
                toggleClass: 'mil-active',
                toggleActions: 'play none none reverse',
            }
        });
    });

    /***************************

    navigation

    ***************************/
    $(".mil-menu-btn").on("click", function () {
        $(this).toggleClass('mil-active');
        $('.mil-navigation').toggleClass('mil-active');
    });

    /***************************

    reviews slider

    ***************************/
    initReviewsSlider();

    /***************************

    portfolio carousel

    ***************************/
    // Initialized with the other dynamic page modules above.

    /***************************

    accordion

    ***************************/

    let groups = gsap.utils.toArray(".mil-accordion-group");
    let menus = gsap.utils.toArray(".mil-accordion-menu");
    let menuToggles = groups.map(createAnimation);

    menus.forEach((menu) => {
        menu.addEventListener("click", () => toggleMenu(menu));
    });

    function toggleMenu(clickedMenu) {
        menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
    }

    function createAnimation(element) {
        let menu = element.querySelector(".mil-accordion-menu");
        let title = element.querySelector(".mil-accordion-menu h6");
        let box = element.querySelector(".mil-accordion-content");
        let minusElement = element.querySelector(".mil-minus");
        let plusElement = element.querySelector(".mil-plus");

        gsap.set(box, {
            height: "auto",
        });

        let animation = gsap
            .timeline()
            .from(box, {
                height: 0,
                duration: 0.5,
                ease: "sine"
            })
            .from(minusElement, {
                duration: 0.2,
                autoAlpha: 0,
                color: '#BCFF00',
                ease: "none",
            }, 0)
            .to(plusElement, {
                duration: 0.2,
                autoAlpha: 0,
                ease: "none",
            }, 0)
            .from(title, {
                color: '#fff',
                duration: 0.2,
                ease: "sine",
            }, 0)
            .to(title, {
                duration: 0.2,
                color: '#BCFF00',
                ease: "sine",
            }, 0)
            .reverse();

        return function (clickedMenu) {
            if (clickedMenu === menu) {
                animation.reversed(!animation.reversed());
            } else {
                animation.reverse();
            }
        };
    }

    /*----------------------------------------------------------
    ------------------------------------------------------------

    REINIT

    ------------------------------------------------------------
    ----------------------------------------------------------*/
    document.addEventListener("swup:contentReplaced", function () {

        $(".mil-navigation , .mil-menu-btn").removeClass('mil-active');
        initPortfolioHoverVideos();

        window.scrollTo({
            top: 0,
        });

        ScrollTrigger.refresh();
        initProjects();
        initProjectsCarousel();
        initTestimonials();
        initContactForm();

        /***************************

        back to top

        ***************************/
        const btt = document.querySelector(".mil-back-to-top .mil-link");

        gsap.set(btt, {
            opacity: .5,
        });

        gsap.to(btt, {
            opacity: 1,
            ease: 'sine',
            scrollTrigger: {
                trigger: "body",
                start: "top -20%",
                end: "top -20%",
                toggleActions: "play none reverse none"
            }
        });
        /***************************

        scroll animations

        ***************************/

        const appearance = document.querySelectorAll(".mil-up");

        appearance.forEach((section) => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 50,
                ease: 'sine',
            }, {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: section,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        const rotate = document.querySelectorAll(".mil-rotate");

        rotate.forEach((section) => {
            var value = $(section).data("value");
            gsap.fromTo(section, {
                ease: 'sine',
                rotate: 0,

            }, {
                rotate: value,
                scrollTrigger: {
                    trigger: section,
                    scrub: true,
                    toggleActions: 'play none none reverse',
                }
            });
        });
        /***************************

        progressbar type 1

        ***************************/

        const progGo = document.querySelectorAll(".mil-circular-progress");

        progGo.forEach((section) => {
            var value = $(section).data("value");
            gsap.fromTo(section, {
                "--p": '0',
                ease: 'sine',
            }, {
                "--p": value,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        /***************************

        counter

        ***************************/
        const number = $(".mil-counter");
        number.each(function (index, element) {
            var count = $(this),
                zero = {
                    val: 0
                },
                num = count.data("number"),
                split = (num + "").split("."), // to cover for instances of decimals
                decimals = split.length > 1 ? split[1].length : 0;

            gsap.to(zero, {
                val: num,
                duration: 2,
                scrollTrigger: {
                    trigger: element,
                    toggleActions: 'play none none reverse',
                },
                onUpdate: function () {
                    count.text(zero.val.toFixed(decimals));
                }
            });
        });

        /***************************

        progressbars type 2

        ***************************/
        const width = document.querySelectorAll(".mil-bar");

        width.forEach((section) => {
            var value = $(section).data("value");
            gsap.fromTo(section, {
                width: 0,
                duration: 5000,
                ease: 'sine',
            }, {
                width: value,
                scrollTrigger: {
                    trigger: section,
                    toggleClass: 'mil-active',
                    toggleActions: 'play none none reverse',
                }
            });
        });

        /***************************

        reviews slider

        ***************************/
        initReviewsSlider();

        /***************************

        portfolio carousel

        ***************************/
        // Handled dynamically by initProjectsCarousel()
        /***************************

    accordion

    ***************************/

        let groups = gsap.utils.toArray(".mil-accordion-group");
        let menus = gsap.utils.toArray(".mil-accordion-menu");
        let menuToggles = groups.map(createAnimation);

        menus.forEach((menu) => {
            menu.addEventListener("click", () => toggleMenu(menu));
        });

        function toggleMenu(clickedMenu) {
            menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
        }

        function createAnimation(element) {
            let menu = element.querySelector(".mil-accordion-menu");
            let title = element.querySelector(".mil-accordion-menu h6");
            let box = element.querySelector(".mil-accordion-content");
            let minusElement = element.querySelector(".mil-minus");
            let plusElement = element.querySelector(".mil-plus");

            gsap.set(box, {
                height: "auto",
            });

            let animation = gsap
                .timeline()
                .from(box, {
                    height: 0,
                    duration: 0.5,
                    ease: "sine"
                })
                .from(minusElement, {
                    duration: 0.2,
                    autoAlpha: 0,
                    ease: "none",
                }, 0)
                .to(plusElement, {
                    duration: 0.2,
                    autoAlpha: 0,
                    ease: "none",
                }, 0)
                .from(title, {
                    duration: 0.2,
                    ease: "sine",
                }, 0)
                .to(title, {
                    duration: 0.2,
                    ease: "sine",
                }, 0)
                .reverse();

            return function (clickedMenu) {
                if (clickedMenu === menu) {
                    animation.reversed(!animation.reversed());
                } else {
                    animation.reverse();
                }
            };
        }

    });

});
