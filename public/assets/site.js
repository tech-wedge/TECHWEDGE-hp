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

/* ─── 画像を押すと同じページの上で大きく見せる（2026-10-25追加・悠太「クリックしたら拡大表示されなわからん」） ───
   対象は main の中の figure の画像と、HP制作の見本（.mock-frame）の画像だけ。
   ほかのページへ飛ぶリンクの中の画像（HP制作の実績など）と、QR は対象にしない。
   閉じ方は × ・暗い所を押す・Esc の3つ。スマホは指で広げて拡大できる。 */
(() => {
  const imgs = [...document.querySelectorAll("main figure img, main .mock-frame img")].filter(img => {
    const a = img.closest("a");
    return !a || a.href === img.src; // 画像そのものへのリンク（図面のコラム）だけは、別のタブの代わりにここで開く
  });
  if (!imgs.length) return;

  const box = document.createElement("div");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "画像の拡大");
  // 隠すのは display で行う（hidden 属性は、ここで書く display:flex に負けて幕が出たままになるため）
  box.style.cssText = "position:fixed;inset:0;z-index:1000;background:rgba(46,46,46,.92);display:none;align-items:center;justify-content:center;padding:56px 12px 12px;overflow:auto;touch-action:pinch-zoom";
  const big = document.createElement("img");
  big.style.cssText = "max-width:100%;max-height:100%;background:#fff;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,.35)";
  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "閉じる");
  close.textContent = "×";
  close.style.cssText = "position:fixed;top:10px;right:12px;width:44px;height:44px;border-radius:50%;border:none;background:#fff;color:#2E2E2E;font-size:28px;line-height:44px;cursor:pointer";
  box.append(big, close);
  document.body.append(box);

  let opener = null;
  const open = img => {
    opener = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.style.display = "flex";
    document.documentElement.style.overflow = "hidden";
    close.focus();
  };
  const isOpen = () => box.style.display !== "none";
  const shut = () => {
    box.style.display = "none";
    big.removeAttribute("src");
    document.documentElement.style.overflow = "";
    if (opener) opener.focus();
  };
  box.addEventListener("click", e => { if (e.target !== big) shut(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) shut(); });

  imgs.forEach(img => {
    img.style.cursor = "zoom-in";
    const link = img.closest("a"); // 図面のコラムは画像そのものへのリンクの中＝リンクで Enter を押した時も、別のタブでなく拡大にする
    if (link) {
      link.addEventListener("click", e => { e.preventDefault(); open(img); });
    } else {
      img.tabIndex = 0;
      img.addEventListener("click", e => { e.preventDefault(); open(img); });
      img.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); open(img); } });
    }
  });
})();
