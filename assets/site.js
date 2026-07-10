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

/* ─── 出現アニメ（.rv）＋レーザー描画（.draw） ─── */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll(".rv,.draw").forEach(el => io.observe(el));

/* ─── 数字カウントアップ ─── */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  if (REDUCED) { el.childNodes[0].nodeValue = target; return; }
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
