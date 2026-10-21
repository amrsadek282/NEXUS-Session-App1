/* ==================================================================
   NEXUS Session 01 — learning interactions (Phase 3B)
   Self-contained: touches only the lesson section, never the quiz.
   ================================================================== */
(function () {
  'use strict';

  const LETTERS = ['A', 'B', 'C', 'D'];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setFeedback(el, kind, text) {
    el.className = 'lx-feedback ' + kind;
    el.textContent = text;
    el.hidden = false;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- Multiple-choice checks ---------- */
  function initChoice(root, onSolved) {
    const group = $('.lx-options', root);
    const feedback = $('.lx-feedback', root);
    const correct = root.dataset.correct;
    const maxAttempts = parseInt(root.dataset.maxAttempts || '0', 10);
    let opts = $$('.lx-opt', group);

    if (root.dataset.shuffle === 'true') {
      opts = shuffle(opts);
      opts.forEach(o => group.appendChild(o));
    }
    opts.forEach((o, i) => { $('.lx-key', o).textContent = LETTERS[i]; });

    let attempts = 0;
    let finished = false;

    function lockAll() {
      finished = true;
      opts.forEach(o => o.setAttribute('aria-disabled', 'true'));
    }

    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        if (finished || opt.getAttribute('aria-disabled') === 'true') return;
        attempts++;
        opts.forEach(o => o.setAttribute('aria-checked', o === opt ? 'true' : 'false'));

        if (opt.dataset.key === correct) {
          opt.classList.add('is-correct');
          lockAll();
          setFeedback(feedback, 'ok', root.dataset.ok);
          if (onSolved) onSolved(true);
          return;
        }

        opt.classList.add('is-wrong');
        opt.setAttribute('aria-disabled', 'true');

        if (maxAttempts && attempts >= maxAttempts) {
          const right = opts.find(o => o.dataset.key === correct);
          if (right) right.classList.add('is-correct');
          lockAll();
          setFeedback(feedback, 'try', root.dataset.bad + ' الإجابة الصح متعلّمة بالأخضر.');
          if (onSolved) onSolved(false);
        } else {
          setFeedback(feedback, 'try', root.dataset.bad);
        }
      });
    });
  }

  /* ---------- Step 1: opening question ---------- */
  function initBigQuestion() {
    const check = $('#bigq-check');
    const reveal = $('#bigq-reveal');
    if (!check || !reveal) return;

    initChoice(check, (solved) => {
      if (solved) markDone(1);
      reveal.hidden = false;
      reveal.focus({ preventScroll: true });
      reveal.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    });

    const btn = $('#runDemoBtn');
    const out = $('#runDemoOut');
    btn.addEventListener('click', () => {
      out.innerHTML = '';
      btn.disabled = true;
      let run = 0;
      const step = () => {
        run++;
        const li = document.createElement('li');
        li.textContent = `#${run}  12 × 7 = ${12 * 7}`;
        out.appendChild(li);
        if (run < 5) {
          if (reduceMotion()) step(); else setTimeout(step, 300);
        } else {
          const note = document.createElement('li');
          note.className = 'lx-runs-note';
          note.textContent = 'نفس الناتج في المرات الخمس. ده الـ Determinism.';
          out.appendChild(note);
          btn.disabled = false;
        }
      };
      step();
    });
  }

  /* ---------- Step 2: user / engineer switch ---------- */
  function initViewSwitch() {
    const buttons = $$('.lx-switch-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          const on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        $('#view-user').hidden = btn.dataset.view !== 'user';
        $('#view-engineer').hidden = btn.dataset.view !== 'engineer';
      });
    });
  }

  /* ---------- Step 3: IPO classification ---------- */
  function initClassify() {
    const root = $('#ipo-classify');
    if (!root) return;
    const items = $$('.lx-sort-item', root);
    const feedback = $('.lx-feedback', root);
    let done = 0;

    items.forEach(item => {
      const hint = $('.lx-hint', item);
      const chips = $$('.lx-chip', item);
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          if (item.classList.contains('is-done')) return;
          if (chip.dataset.choice === item.dataset.answer) {
            item.classList.add('is-done');
            chip.classList.add('is-picked');
            chips.forEach(c => c.setAttribute('aria-disabled', 'true'));
            hint.textContent = '';
            done++;
            if (done === items.length) { setFeedback(feedback, 'ok', root.dataset.ok); markDone(3); }
            else feedback.hidden = true;
          } else {
            hint.textContent = item.dataset.hint;
            setFeedback(feedback, 'try', root.dataset.bad);
          }
        });
      });
    });
  }

  /* ---------- Select groups (diagrams with an info panel) ---------- */
  function initSelectGroups() {
    $$('[data-select-group]').forEach(group => {
      const buttons = $$('[data-target]', group);
      const panels = buttons.map(b => document.getElementById(b.dataset.target));

      function select(btn) {
        buttons.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        panels.forEach(p => { if (p) p.hidden = p.id !== btn.dataset.target; });
        group.dispatchEvent(new CustomEvent('lx:select', { detail: btn.dataset.target }));
      }

      buttons.forEach(b => b.addEventListener('click', () => select(b)));
      select(buttons[0]);
    });
  }

  /* ---------- Step 5: nothing extra (uses select group + choice) ---------- */

  /* ---------- Step 7: AND gate simulator ---------- */
  function initGate() {
    const sim = $('#gate-sim');
    if (!sim) return;
    const state = { a: 0, b: 0 };
    const seen = new Set();
    const toggles = $$('.lx-toggle', sim);
    const lamp = $('#gate-lamp');
    const out = $('#gate-out');
    const rows = $$('#gate-table tbody tr');
    const checkWrap = $('#gate-check-wrap');

    function render() {
      toggles.forEach(t => {
        const key = t.dataset.input;
        const v = state[key];
        t.setAttribute('aria-pressed', v ? 'true' : 'false');
        t.setAttribute('aria-label', `${key.toUpperCase()}: القيمة الحالية ${v}`);
        $('.lx-toggle-val', t).textContent = `${v} · ${v ? 'High' : 'Low'}`;
      });
      const result = state.a & state.b;
      lamp.classList.toggle('is-on', result === 1);
      out.textContent = `Output = ${result}`;

      seen.add(`${state.a}${state.b}`);
      rows.forEach(row => {
        if (seen.has(row.dataset.row)) {
          row.classList.add('is-seen');
          $('.lx-out', row).textContent = String(Number(row.dataset.row[0]) & Number(row.dataset.row[1]));
        }
      });
      if (seen.size === 4) checkWrap.hidden = false;
    }

    toggles.forEach(t => t.addEventListener('click', () => {
      state[t.dataset.input] = state[t.dataset.input] ? 0 : 1;
      render();
    }));

    initChoice($('#gate-check'), ok => { if (ok) markDone(7); });
    render();
  }

  /* ---------- Step 8: sequence sort + journey cycle ---------- */
  function initSequence() {
    const root = $('#seq-sort');
    if (!root) return;
    const order = root.dataset.order.split(',');
    const slots = $$('.lx-slot', root);
    const pool = $$('.lx-card-chip', root);
    const feedback = $('.lx-feedback', root);
    const reset = $('#seq-reset');
    let picks = [];

    pool.forEach(card => {
      card.addEventListener('click', () => {
        if (card.getAttribute('aria-disabled') === 'true' || picks.length >= order.length) return;
        picks.push(card.dataset.step);
        const slot = slots[picks.length - 1];
        slot.innerHTML = card.innerHTML;
        slot.classList.add('is-filled');
        card.setAttribute('aria-disabled', 'true');
        if (picks.length === order.length) evaluate();
      });
    });

    function evaluate() {
      const ok = picks.every((p, i) => p === order[i]);
      if (ok) {
        slots.forEach(s => s.classList.add('is-right'));
        setFeedback(feedback, 'ok', root.dataset.ok);
        reset.hidden = true;
        markDone(8);
      } else {
        setFeedback(feedback, 'try', root.dataset.bad);
        reset.hidden = false;
        reset.focus();
      }
    }

    reset.addEventListener('click', () => {
      picks = [];
      slots.forEach(s => { s.textContent = ''; s.className = 'lx-slot'; });
      pool.forEach(c => c.removeAttribute('aria-disabled'));
      feedback.hidden = true;
      reset.hidden = true;
      pool[0].focus();
    });
  }

  function initJourneyCycle() {
    const group = $('#journey-group');
    if (!group) return;
    const chips = $$('.lx-cycle-chip', group);
    let timer = null;
    let index = 0;

    function stop() {
      clearInterval(timer);
      timer = null;
      chips.forEach(c => c.classList.remove('is-on'));
    }

    function start() {
      stop();
      if (reduceMotion()) return;
      index = 0;
      chips[0].classList.add('is-on');
      timer = setInterval(() => {
        if (!group.offsetParent) return; // tab not visible
        chips[index].classList.remove('is-on');
        index = (index + 1) % chips.length;
        chips[index].classList.add('is-on');
      }, 900);
    }

    group.addEventListener('lx:select', e => {
      if (e.detail === 'st-cpu') start(); else stop();
    });
  }

  /* ---------- Topic progress line ----------
     Position = which step is open. "Done" is only set when that step's
     activity was actually completed correctly (steps 2 and 6 have none). */
  const STEP_OF = { 'os-check': 4, 'ram-check': 5 };
  const TOTAL_STEPS = 8;

  function markDone(step) {
    const btn = document.getElementById('tabbtn-' + step);
    if (!btn || btn.classList.contains('is-done')) return;
    btn.classList.add('is-done');
    const note = document.createElement('span');
    note.className = 'sr-only';
    note.textContent = ' (مكتمل)';
    btn.appendChild(note);
  }

  function initProgressLine() {
    const fill = $('#lxTrackFill');
    if (!fill) return;
    const track = fill.parentElement;
    const label = $('#lxStepLabel');
    const set = index => {
      const n = index + 1;
      const text = 'الخطوة ' + n + ' من ' + TOTAL_STEPS;
      fill.style.width = (n / TOTAL_STEPS * 100) + '%';
      track.setAttribute('aria-valuenow', String(n));
      track.setAttribute('aria-valuetext', text);
      if (label) label.textContent = text;
    };
    set(0);
    document.addEventListener('lx:tab', e => set(e.detail.index));
  }

  /* ---------- Header navigation follows the section in view ---------- */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav-link');
    const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = map.get(entry.target.id);
        if (!link) return;
        links.forEach(l => l.classList.toggle('active', l === link));
      });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
  }

  /* ---------- Step 8: looping Fetch → Decode → Execute → Store ---------- */
  function initCycleDemo() {
    const root = $('#cycle-demo');
    if (!root) return;
    const chips = $$('.lx-cycle-chip', root);
    const toggle = $('#cycleToggle');
    let timer = null;
    let index = 0;
    let paused = false;

    function show(i) { chips.forEach((c, n) => c.classList.toggle('is-on', n === i)); }
    function tick() {
      if (document.hidden || !root.offsetParent) return;
      index = (index + 1) % chips.length;
      show(index);
    }
    function play() { paused = false; show(index); timer = setInterval(tick, 1100); toggle.textContent = 'إيقاف الحركة'; toggle.setAttribute('aria-pressed', 'false'); }
    function pause() { paused = true; clearInterval(timer); timer = null; toggle.textContent = 'تشغيل الحركة'; toggle.setAttribute('aria-pressed', 'true'); }

    if (reduceMotion()) { toggle.hidden = true; return; }  // static diagram, no motion
    toggle.addEventListener('click', () => (paused ? play() : pause()));
    play();
  }

  /* ---------- Page scroll progress ---------- */
  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    let queued = false;

    function update() {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }
    function request() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    // Content height changes (tab switches, reveals, quiz views, media) without any scroll event.
    if ('ResizeObserver' in window) new ResizeObserver(request).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(request);
    update();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    $$('.en').forEach(el => { if (!el.hasAttribute('lang')) el.setAttribute('lang', 'en'); });

    initBigQuestion();
    initViewSwitch();
    initClassify();
    $$('.lx-check').forEach(root => {
      if (root.id === 'bigq-check' || root.id === 'gate-check') return; // initialised by their own sections
      initChoice(root, ok => { if (ok && STEP_OF[root.id]) markDone(STEP_OF[root.id]); });
    });
    initJourneyCycle();   // listener first so the initial select is observed
    initSelectGroups();
    initGate();
    initSequence();
    initCycleDemo();
    initProgressLine();
    initScrollSpy();
    initScrollProgress();
  });
})();
