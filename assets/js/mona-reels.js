(function () {
  "use strict";

  var LOCAL_BASE = "assets/mona/educational videos/";
  var THUMB_BASE = "assets/mona/educational videos/thumbs/";

  // Order: clinic reels first, then long-form YouTube, then Shorts, then Instagram.
  var LOCAL_FILES = [
    "1 lakh Patients Celebration Reel_Dr Mona Shroff.mp4",
    "1 Lakh Positive Pregnancy_Dr.Mona_4_4_26.mp4",
    "As a Doctor_Dr.Mona_15_4_26.mp4",
    "Confidence_Dr.Mona_8_4_26 (1).mp4",
    "Fertility_Dr.Mona_12_3_26.mp4",
    "Hope_Dr.Mona_13_3_26.mp4",
    "IVF Artificial_Dr.Mona_13_3_26.mp4",
    "India Health Crisis_Dr.Mona_22_4_26.mp4",
    "Negative Report_Dr.Mona_17_4_26.mp4",
    "Perfect Body_Dr.Mona_12_3_26.mp4",
    "Same Problems_Dr.Mona_7_4_26.mp4",
    "Second Opinion_Dr.Mona_22_4_26.mp4",
    "Skipping Treatment_Dr.Mona_18_4_26.mp4",
    "B10F7035-E474-4DB2-9843-5EE1928FD506.MP4",
    "CFF2D75D-36D8-4C04-81DA-ECF9628F7B01.MP4"
  ];

  function prettyClinicTitle(file) {
    var base = file.replace(/\.(mp4|MP4)$/, "");
    if (/^[A-F0-9-]{20,}$/.test(base)) return "Clinic Moment";
    base = base.split("_")[0].replace(/\s*\(\d+\)\s*/, "").trim();
    return base || "Clinic Reel";
  }

  function thumbForFile(file) {
    // Thumbnails live alongside the videos as pre-generated .jpg with the same basename.
    return THUMB_BASE + file.replace(/\.(mp4|MP4)$/, ".jpg");
  }

  var clinicReels = LOCAL_FILES.map(function (file) {
    return {
      type: "clinic",
      title: prettyClinicTitle(file),
      src: LOCAL_BASE + file,
      thumbnail: thumbForFile(file),
      openUrl: null
    };
  });

  // YouTube long-form first, then Shorts (Shorts IDs are generally tagged on original URL path).
  var youtubeVideos = [
    { id: "EjVX0dhqKZ8", shorts: false, title: "Fertility Perspective" },
    { id: "TQjmQquk4sE", shorts: false, title: "Treatment Clarity" },
    { id: "cKh2hB3i3Rk", shorts: false, title: "Counselling Deep Dive" },
    { id: "XjgBP4rJqIo", shorts: false, title: "IVF Explained" },
    { id: "IQrF_6enE-g", shorts: false, title: "Patient Guidance" },
    { id: "z1ofCiK4pds", shorts: false, title: "Expert Conversation" },
    { id: "cstd4-L5sos", shorts: false, title: "Evidence-Led Care" },
    { id: "45YrUF_3wGw", shorts: true, title: "Short: Quick Insight" },
    { id: "8iJ8aG0aGUo", shorts: true, title: "Short: Clinic Tip" },
    { id: "ZA_zdDYHbk8", shorts: true, title: "Short: Patient Note" },
    { id: "yiQMLfr2D8o", shorts: true, title: "Short: Fertility Fact" },
    { id: "_p5OH-zbqAk", shorts: true, title: "Short: Decision Guide" }
  ].map(function (v) {
    return {
      type: "youtube",
      title: v.title,
      youtubeId: v.id,
      isShort: v.shorts,
      openUrl: v.shorts
        ? "https://www.youtube.com/shorts/" + v.id
        : "https://www.youtube.com/watch?v=" + v.id,
      thumbnail: "https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg",
      thumbnailHD: "https://img.youtube.com/vi/" + v.id + "/maxresdefault.jpg"
    };
  });

  var instagramReels = [
    { code: "DM26U7OBfOr", title: "Instagram Reel" },
    { code: "DM49TP1Beny", title: "Instagram Reel" }
  ].map(function (r) {
    return {
      type: "instagram",
      title: r.title,
      instagramCode: r.code,
      openUrl: "https://www.instagram.com/reel/" + r.code + "/"
    };
  });

  var VIDEOS = clinicReels.concat(youtubeVideos, instagramReels);

  var TYPE_META = {
    clinic:    { label: "Clinic Reel",    icon: "fa-solid fa-stethoscope" },
    youtube:   { label: "YouTube",        icon: "fa-brands fa-youtube" },
    instagram: { label: "Instagram",      icon: "fa-brands fa-instagram" }
  };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function buildCard(video, index) {
    var slide = document.createElement("div");
    slide.className = "swiper-slide";

    var card = document.createElement("article");
    card.className = "mona-reel-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Play video " + (index + 1) + ": " + video.title);
    card.dataset.index = String(index);

    var media = document.createElement("div");
    media.className = "mona-reel-media";

    if (video.type === "youtube" || video.type === "clinic") {
      var img = document.createElement("img");
      img.className = "mona-reel-thumb";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = video.title + " thumbnail";
      img.src = encodeURI(video.thumbnail);
      media.appendChild(img);
    } else if (video.type === "instagram") {
      // Instagram doesn't expose a stable public thumbnail URL, but the
      // official embed iframe renders the reel's poster natively. We let it
      // act as the card preview and disable pointer events so clicks pass
      // through to the card and open our modal.
      var ifr = document.createElement("iframe");
      ifr.className = "mona-reel-thumb mona-reel-ig-embed";
      ifr.src = "https://www.instagram.com/reel/" + video.instagramCode + "/embed/";
      ifr.loading = "lazy";
      ifr.setAttribute("scrolling", "no");
      ifr.setAttribute("allowtransparency", "true");
      ifr.setAttribute("frameborder", "0");
      media.appendChild(ifr);
    }

    var play = document.createElement("span");
    play.className = "mona-reel-play";
    play.innerHTML = '<i class="fa-solid fa-play"></i>';
    play.setAttribute("aria-hidden", "true");

    media.appendChild(play);
    card.appendChild(media);
    slide.appendChild(card);

    card.addEventListener("click", function () { openModal(index); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });

    return slide;
  }

  /* --------------------- Modal --------------------- */
  var modal, stage, currentPlayer;

  function bindModalRefs() {
    if (modal) return;
    modal = document.querySelector("[data-mona-reels-modal]");
    if (!modal) return;
    stage = modal.querySelector("[data-mona-reels-stage]");
  }

  function openModal(index) {
    var video = VIDEOS[index];
    if (!video) return;

    bindModalRefs();
    if (!modal) return;

    clearStage();

    if (video.type === "clinic") {
      stage.classList.add("is-vertical");
      var v = document.createElement("video");
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.src = encodeURI(video.src);
      stage.appendChild(v);
      currentPlayer = v;
    } else if (video.type === "youtube") {
      stage.classList.toggle("is-vertical", !!video.isShort);
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + video.youtubeId + "?autoplay=1&rel=0&modestbranding=1";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      stage.appendChild(iframe);
      currentPlayer = iframe;
    } else if (video.type === "instagram") {
      stage.classList.add("is-instagram");
      var igFrame = document.createElement("iframe");
      igFrame.src = "https://www.instagram.com/reel/" + video.instagramCode + "/embed/";
      igFrame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; web-share");
      igFrame.setAttribute("allowfullscreen", "true");
      igFrame.setAttribute("scrolling", "no");
      igFrame.setAttribute("frameborder", "0");
      stage.appendChild(igFrame);
      currentPlayer = igFrame;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mona-modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mona-modal-open");
    // Let the transition finish before tearing down media so we don't flash a black frame.
    window.setTimeout(clearStage, 260);
  }

  function clearStage() {
    if (!stage) return;
    if (currentPlayer && currentPlayer.tagName === "VIDEO") {
      try { currentPlayer.pause(); } catch (e) {}
      currentPlayer.removeAttribute("src");
      currentPlayer.load();
    }
    currentPlayer = null;
    stage.innerHTML = "";
    stage.classList.remove("is-vertical");
    stage.classList.remove("is-instagram");
  }

  /* --------------------- Init --------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-mona-reels]");
    if (!root) return;
    var track = root.querySelector("[data-mona-reels-track]");
    var prevBtn = root.querySelector(".mona-reels-prev");
    var nextBtn = root.querySelector(".mona-reels-next");

    VIDEOS.forEach(function (video, i) {
      track.appendChild(buildCard(video, i));
    });

    if (typeof window.Swiper !== "function") {
      // Graceful fallback if Swiper failed to load: simple horizontal scroll.
      track.parentElement.style.overflowX = "auto";
      track.style.display = "flex";
      track.style.gap = "16px";
      return;
    }

    // Construct Swiper WITHOUT an `init` callback — that callback fires
    // synchronously inside `new Swiper(...)`, before the `swiper` identifier
    // is assigned, which can throw a TypeError and kill all subsequent setup
    // (including autoplay). We wire events below, after assignment completes.
    var swiper;
    try {
      swiper = new window.Swiper(root.querySelector(".mona-reels-swiper"), {
        slidesPerView: 1.15,
        spaceBetween: 16,
        grabCursor: true,
        loop: false,
        speed: 620,
        navigation: { prevEl: prevBtn, nextEl: nextBtn },
        breakpoints: {
          520:  { slidesPerView: 1.6, spaceBetween: 18 },
          720:  { slidesPerView: 2.4, spaceBetween: 20 },
          992:  { slidesPerView: 3.3, spaceBetween: 22 },
          1200: { slidesPerView: 4,   spaceBetween: 24 }
        }
      });
    } catch (e) {
      console.warn("[mona-reels] Swiper init failed:", e);
    }

    /* ---------- Autoplay (manual, bulletproof) ----------
       Uses setInterval + nextBtn.click() so it works even if Swiper's
       internal state is unusual. Pauses on hover / modal / hidden tab. */
    var AUTOPLAY_DELAY = 3800;
    var autoplayPaused = { hover: false, modal: false, hidden: false };

    function autoplayBlocked() {
      return autoplayPaused.hover || autoplayPaused.modal || autoplayPaused.hidden;
    }

    function autoplayTick() {
      if (autoplayBlocked()) return;
      try {
        if (swiper && !swiper.destroyed) {
          if (swiper.isEnd) swiper.slideTo(0);
          else swiper.slideNext();
        } else if (nextBtn && typeof nextBtn.click === "function") {
          nextBtn.click();
        }
      } catch (e) {
        console.warn("[mona-reels] autoplay tick failed:", e);
      }
    }

    // Kick off after a short delay so Swiper has settled its loop clones.
    window.setTimeout(function () {
      window.setInterval(autoplayTick, AUTOPLAY_DELAY);
    }, 600);

    var hoverTarget = root.querySelector(".mona-reels-swiper");
    if (hoverTarget) {
      hoverTarget.addEventListener("mouseenter", function () { autoplayPaused.hover = true; });
      hoverTarget.addEventListener("mouseleave", function () { autoplayPaused.hover = false; });
    }

    document.addEventListener("visibilitychange", function () {
      autoplayPaused.hidden = !!document.hidden;
    });

    // Modal handlers — direct listeners on each close target PLUS delegated
    // capture-phase fallback, so the close button works even if the iframe
    // stacking context or child <i> glyph interferes with normal bubbling.
    bindModalRefs();

    function handleClose(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeModal();
      autoplayPaused.modal = false;
    }

    if (modal) {
      modal.querySelectorAll("[data-mona-reels-close]").forEach(function (el) {
        el.addEventListener("click", handleClose);
        // If the user clicks the X icon inside the button, the event target is
        // the <i>; pointer-events:none on the icon guarantees the click lands
        // on the button itself.
        el.querySelectorAll("i").forEach(function (icon) {
          icon.style.pointerEvents = "none";
        });
      });
    }

    // Capture-phase delegated fallback.
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("[data-mona-reels-close]")) {
        handleClose(e);
      }
    }, true);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && modal.classList.contains("is-open")) handleClose(e);
    });

    // Pause autoplay while the modal is open; handleClose() resumes it.
    var _openModal = openModal;
    openModal = function (idx) {
      _openModal(idx);
      autoplayPaused.modal = true;
    };

    // Expose a global handle as a last-resort escape hatch.
    window.__monaCloseReels = handleClose;
  });
})();
