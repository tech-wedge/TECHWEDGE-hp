/* ============================================================
   TechWedge 共有JS v2（MAXラウンド）
   ブランド名一元管理・出現/描画・慣性基準線・磁気CTA・カウンタ
   ============================================================ */

/* ─── 組織名はここ1箇所だけ（確定したら書き換え） ─── */
const BRAND_HEAD = "TECH";
const BRAND_TAIL = "WEDGE";
const BRAND_PROVISIONAL = false; // 2026-07-08 組織名TechWedge確定（悠太）

document.querySelectorAll("[data-brand]").forEach(el => {
  el.innerHTML = BRAND_HEAD + '<i style="font-style:normal;color:var(--laser)">' + BRAND_TAIL + "</i>";
});
document.querySelectorAll("[data-brand-note]").forEach(el => {
  el.textContent = "© 2026 " + BRAND_HEAD + BRAND_TAIL + (BRAND_PROVISIONAL ? "（名称仮）" : "");
});

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = matchMedia("(pointer: fine)").matches;

/* ─── 出現アニメ（.rv）＋レーザー描画（.draw） ───
   要素は最初から見えている。動かすのは、読み込んだ時点で画面より下にあった物だけで、
   画面に入る少し手前で .on を付ける（2026-09-30: 止まった状態で撮ると半分以上が空白だった件の直し） */
if (!REDUCED) {
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px 12% 0px" });
  document.querySelectorAll(".rv,.draw").forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) return; // 最初から画面に入っている物は動かさない
    io.observe(el);
  });
}

/* ─── 数字カウントアップ ─── */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  if (REDUCED) { el.childNodes[0].nodeValue = target; return; }
  el.childNodes[0].nodeValue = 0;
  const dur = 1400, t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.childNodes[0].nodeValue = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}
document.querySelectorAll("[data-count]").forEach(el => {
  const o = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { countUp(el); o.unobserve(el); } });
  }, { threshold: .6 });
  o.observe(el);
});

/* ─── 基準線マーカー: 慣性追従（ヌルヌルの本体・lerp係数0.1） ─── */
const datum = document.getElementById("datum");
if (datum) {
  let target = 8, current = 8;
  addEventListener("scroll", () => {
    const p = scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
    target = 8 + p * 84;
  }, { passive: true });
  if (REDUCED) {
    addEventListener("scroll", () => datum.style.setProperty("--datum-y", target + "%"), { passive: true });
  } else {
    /* 動きが収束したらループを止める（省電力・アイドル復帰） */
    let raf = null;
    const follow = () => {
      current += (target - current) * 0.1;
      datum.style.setProperty("--datum-y", current + "%");
      if (Math.abs(target - current) > 0.02) { raf = requestAnimationFrame(follow); }
      else { current = target; raf = null; }
    };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(follow); }, { passive: true });
    follow();
  }
}

/* ─── 磁気CTA（PC・ファインポインタ限定） ─── */
if (FINE_POINTER && !REDUCED) {
  document.querySelectorAll(".cta").forEach(btn => {
    const R = 90, MAX = 7;
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${(dx / R) * MAX}px, ${(dy / R) * MAX - 3}px) scale(1.02)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

/* ─── ヒーローのパララックス（リピートテキストの奥行き） ─── */
const rep = document.querySelector(".hero-repeat");
if (rep && !REDUCED) {
  addEventListener("scroll", () => {
    rep.style.transform = `translateY(${scrollY * 0.18}px)`;
    rep.style.opacity = Math.max(0, .045 - scrollY / 12000);
  }, { passive: true });
}

/* ─── モバイルのハンバーガー（2026-09-03追加） ─── */
(() => {
  const nav = document.querySelector(".nav");
  const btn = document.querySelector(".nav-toggle");
  if (!nav || !btn) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // 画面が広がったら閉じる（開いたまま残らんように）
  matchMedia("(min-width:721px)").addEventListener("change", e => {
    if (e.matches) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  });
})();
