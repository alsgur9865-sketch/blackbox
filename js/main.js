/* ==========================================================================
   BLACKBOX — Landing Page Script
   순수 Vanilla JavaScript (라이브러리 · 빌드도구 없음)
   --------------------------------------------------------------------------
   01. 스크롤 진입 애니메이션 (IntersectionObserver)
   02. 헤더 스크롤 상태 + 모바일 하단 고정 CTA
   03. 모바일 햄버거 메뉴 토글
   04. 앵커 부드러운 스크롤 (헤더 높이 보정)
   05. 내비게이션 현재 섹션 표시 (스크롤 스파이)
   06. FAQ 아코디언 (한 번에 하나만 열림)
   07. 사전 신청 모달 (Fake Door)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 공통 헬퍼 ---------- */
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var HEADER_OFFSET = 80;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ======================================================================
     01. 스크롤 진입 애니메이션
     ====================================================================== */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    // 모션 최소화 설정 또는 미지원 브라우저 → 즉시 노출
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    items.forEach(function (el) { observer.observe(el); });
  }


  /* ======================================================================
     02. 헤더 스크롤 상태 + 모바일 하단 고정 CTA
     ====================================================================== */
  function initScrollState() {
    var header    = $('#site-header');
    var mobileBar = $('#mobile-bar');
    var ticking   = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (header)    header.classList.toggle('is-scrolled', y > 12);
      if (mobileBar) mobileBar.classList.toggle('is-visible', y > 400);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }


  /* ======================================================================
     03. 모바일 햄버거 메뉴 토글
     ====================================================================== */
  var setMobileNav = function () {};

  function initMobileNav() {
    var burger = $('#burger');
    var panel  = $('#mobile-nav');
    if (!burger || !panel) return;

    setMobileNav = function (open) {
      panel.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };

    burger.addEventListener('click', function () {
      setMobileNav(panel.hidden);
    });

    // 데스크탑 폭으로 넓어지면 패널 정리
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && !panel.hidden) setMobileNav(false);
    });
  }


  /* ======================================================================
     04. 앵커 부드러운 스크롤 (헤더 높이 보정)
     ====================================================================== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        if (!id) return;

        var target = (id === 'top') ? document.body : document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        setMobileNav(false);

        var top = (id === 'top')
          ? 0
          : target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }


  /* ======================================================================
     05. 내비게이션 현재 섹션 표시 (스크롤 스파이)
     ====================================================================== */
  function initScrollSpy() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(function (s) { observer.observe(s); });
  }


  /* ======================================================================
     06. FAQ 아코디언 — 한 번에 하나만 열림
     ====================================================================== */
  function initFaq() {
    var items = $$('.faq-item[data-faq]');
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      });
    });
  }


  /* ======================================================================
     07. 사전 신청 모달 (Fake Door)
     ====================================================================== */
  function initModal() {
    var modal = $('#modal');
    if (!modal) return;

    var dialog     = $('.modal__dialog', modal);
    var form       = $('#pre-form');
    var done       = $('#pre-done');
    var emailInput = $('#pre-email');
    var emailError = $('#pre-email-error');

    var lastFocused = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

    function getFocusable() {
      return $$(FOCUSABLE, modal).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function openModal() {
      lastFocused = document.activeElement;

      // 항상 입력 화면부터 다시 시작
      if (form) form.hidden = false;
      if (done) done.hidden = true;
      if (emailError) emailError.hidden = true;
      if (emailInput) emailInput.removeAttribute('aria-invalid');

      modal.hidden = false;
      document.body.style.overflow = 'hidden';

      window.setTimeout(function () {
        if (emailInput) emailInput.focus();
      }, 60);
    }

    function closeModal() {
      modal.classList.add('is-closing');

      window.setTimeout(function () {
        modal.hidden = true;
        modal.classList.remove('is-closing');
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      }, prefersReducedMotion ? 0 : 160);
    }

    function isOpen() { return !modal.hidden; }

    /* --- 열기 버튼 (헤더 · Hero · 요금 · Final · 모바일바) --- */
    $$('[data-cta]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        setMobileNav(false);
        openModal();
      });
    });

    /* --- 닫기 --- */
    $$('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });

    // 배경(오버레이) 클릭으로 닫기
    modal.addEventListener('mousedown', function (e) {
      if (e.target === modal) closeModal();
    });

    /* --- 제출: 서버 전송 없이 완료 화면으로 전환 (Fake Door) --- */
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var value = emailInput ? emailInput.value.trim() : '';
        var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

        if (!valid) {
          if (emailError) emailError.hidden = false;
          if (emailInput) {
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.focus();
          }
          return;
        }

        if (emailError) emailError.hidden = true;
        if (emailInput) emailInput.removeAttribute('aria-invalid');

        form.hidden = true;
        if (done) {
          done.hidden = false;
          var closeBtn = $('button', done);
          if (closeBtn) closeBtn.focus();
        }
      });
    }

    // 입력을 다시 시작하면 에러 메시지 정리
    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (emailError) emailError.hidden = true;
        emailInput.removeAttribute('aria-invalid');
      });
    }

    /* --- 키보드: Esc 닫기 + Tab 포커스 트랩 --- */
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key !== 'Tab') return;

      var focusable = getFocusable();
      if (!focusable.length) return;

      var first = focusable[0];
      var last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (dialog && !dialog.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    });
  }


  /* ======================================================================
     초기화
     ====================================================================== */
  function init() {
    initReveal();
    initScrollState();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initFaq();
    initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
