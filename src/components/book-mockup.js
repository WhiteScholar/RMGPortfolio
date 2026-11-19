/**
 * <book-mockup> — interactive 3D hardcover with dust jacket.
 * Zero dependencies, Shadow DOM (no style leakage either way).
 *
 * Attributes
 *   src     Base path to the folder holding front/back/spine/flapL/flapR.webp
 *           (default: "./assets/"). Must end with "/".
 *   ext     Image extension (default: "webp").
 *   ratio   Jacket panel proportions "front:spine:flap:height" in source px
 *           (default: "381:43:148:576").
 *   label   Accessible description (default: "3D book cover mockup").
 *   no-controls   Hide the view buttons (drag + idle spin still work).
 *
 * Behaviour
 *   - Drag (mouse or touch) to turn the book; it idles with a slow spin.
 *   - Buttons: Front / Spine / Back / Open (shows inside-front flap).
 *   - Animation pauses when off-screen; respects prefers-reduced-motion.
 */
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>
  :host{display:block;position:relative;width:100%;aspect-ratio:1/1;max-height:720px;
    --endpaper:#151628;--btn-bg:rgba(255,255,255,.75);--btn-fg:#1d1c1a;--btn-active-bg:#1d1c1a;--btn-active-fg:#fff;--shadow:rgba(0,0,0,.45)}
  .stage{position:absolute;inset:0;display:grid;place-items:center;perspective:2200px;perspective-origin:50% 45%;cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;overflow:hidden}
  .stage.drag{cursor:grabbing}
  .scaler{position:absolute;left:50%;top:45%;width:0;height:0;transform:scale(var(--k,1));transform-style:preserve-3d}
  .book{position:absolute;left:calc(var(--W)/-2);top:calc(var(--H)/-2);width:var(--W);height:var(--H);transform-style:preserve-3d}
  .f,.lid{position:absolute;left:50%;top:50%}
  .f{backface-visibility:hidden;-webkit-backface-visibility:hidden}
  .spine{width:var(--D);height:var(--H);margin:calc(var(--H)/-2) 0 0 calc(var(--D)/-2);background:var(--img-spine) 0 0/100% 100%;transform:rotateY(-90deg) translateZ(calc(var(--W)/2))}
  .pbf,.pbb{width:calc(var(--W) - 8px);height:calc(var(--H) - 10px);margin:calc(var(--H)/-2 + 5px) 0 0 calc(var(--W)/-2 + 2px);background:linear-gradient(90deg,#d9d2c2 0,#f6f1e6 6%,#fbf8f1 60%,#f1ebde 100%)}
  .pbf{transform:translateZ(calc(var(--D)/2 - 3px))}
  .pbb{transform:rotateY(180deg) translateZ(calc(var(--D)/2 - 3px))}
  .pbe{width:calc(var(--D) - 6px);height:calc(var(--H) - 10px);margin:calc(var(--H)/-2 + 5px) 0 0 calc(var(--D)/-2 + 3px);transform:rotateY(90deg) translateZ(calc(var(--W)/2 - 6px));
    background:repeating-linear-gradient(90deg,#f4efe4 0 1px,#ddd6c6 1px 2px,#f8f3ea 2px 3px);box-shadow:inset 0 0 8px rgba(0,0,0,.18)}
  .pbt,.pbo{width:calc(var(--W) - 8px);height:calc(var(--D) - 6px);margin:calc(var(--D)/-2 + 3px) 0 0 calc(var(--W)/-2 + 2px);background:repeating-linear-gradient(0deg,#f4efe4 0 1px,#ddd6c6 1px 2px,#f8f3ea 2px 3px)}
  .pbt{transform:rotateX(90deg) translateZ(calc(var(--H)/2 - 5px))}
  .pbo{transform:rotateX(-90deg) translateZ(calc(var(--H)/2 - 5px))}
  .lid{width:var(--W);height:var(--H);margin:calc(var(--H)/-2) 0 0 calc(var(--W)/-2);transform-style:preserve-3d;transform-origin:0 50%}
  .lid .f{left:0;top:0;width:100%;height:100%}
  .lidF{transform:translateZ(calc(var(--D)/2)) rotateY(calc(var(--open,0)*-1deg))}
  .lidF .out{background:var(--img-front) 0 0/100% 100%;border-radius:0 3px 3px 0}
  .lidF .in{transform:rotateY(180deg) translateZ(3px);background:var(--img-flapR) left top/var(--F) 100% no-repeat,var(--endpaper)}
  .lidB{transform:translateZ(calc(var(--D)/-2))}
  .lidB .out{transform:rotateY(180deg);background:var(--img-back) 0 0/100% 100%;border-radius:3px 0 0 3px}
  .lidF .out::before,.lidB .out::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(var(--dir,90deg),rgba(0,0,0,.4) 0,transparent 1.4%,rgba(255,255,255,.13) 2.6%,transparent 4.6%)}
  .lidB .out::before{--dir:270deg}
  .in::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 30px rgba(0,0,0,.3)}
  .spine::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.27),transparent 18%,rgba(255,255,255,.08) 50%,transparent 82%,rgba(0,0,0,.27))}
  .out::after,.spine::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.17) 47%,transparent 59%);background-size:300% 100%;background-position:var(--glare,50%) 0;mix-blend-mode:screen}
  .shadow{position:absolute;left:50%;top:45%;width:calc(var(--W)*1.5);height:calc(var(--W)*.38);margin-left:calc(var(--W)*-.75);margin-top:calc(var(--H)*.46*var(--k,1) - var(--W)*.19);border-radius:50%;
    background:radial-gradient(closest-side,var(--shadow),transparent);filter:blur(12px);transform:scaleX(var(--k,1));pointer-events:none}
  .controls{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:6px;flex-wrap:wrap}
  button{font:500 12px/1 system-ui,sans-serif;color:var(--btn-fg);background:var(--btn-bg);border:1px solid rgba(0,0,0,.1);padding:7px 12px;border-radius:999px;cursor:pointer;backdrop-filter:blur(6px)}
  button[aria-pressed="true"]{background:var(--btn-active-bg);color:var(--btn-active-fg)}
  button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
  :host([no-controls]) .controls{display:none}
</style>
<div class="stage" part="stage">
  <div class="shadow"></div>
  <div class="scaler">
    <div class="book" role="img">
      <div class="f pbf"></div><div class="f pbb"></div><div class="f pbe"></div><div class="f pbt"></div><div class="f pbo"></div>
      <div class="f spine"></div>
      <div class="lid lidB"><div class="f out"></div></div>
      <div class="lid lidF"><div class="f out"></div><div class="f in"></div></div>
    </div>
  </div>
</div>
<div class="controls" part="controls">
  <button data-v="front">Front</button><button data-v="spine">Spine</button><button data-v="back">Back</button><button data-v="open">Open</button>
</div>`;

const VIEWS = { front:[-24,6,0,0], spine:[90,0,0,0], back:[156,6,0,0], open:[-14,8,150,0.45] };
const BASE_H = 540; // design height in CSS px; the whole book is scaled to fit the host

class BookMockup extends HTMLElement {
  static get observedAttributes(){ return ['src','ext','ratio','label']; }
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(TEMPLATE.content.cloneNode(true));
    const $ = s => this.shadowRoot.querySelector(s);
    this.$stage=$('.stage'); this.$book=$('.book'); this.$scaler=$('.scaler'); this.$shadow=$('.shadow');
    this.s={ry:-24,rx:6,open:0,tx:0}; this.t={...this.s};
    this.idle=true; this.visible=false; this.raf=0; this.lastInput=0;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  connectedCallback(){
    this.applyGeometry(); this.applyImages();
    this.$book.setAttribute('aria-label', this.getAttribute('label') || '3D book cover mockup');
    this.shadowRoot.querySelectorAll('[data-v]').forEach(b=>b.addEventListener('click',()=>this.view(b.dataset.v)));
    this.bindDrag();
    this.ro = new ResizeObserver(()=>this.fit()); this.ro.observe(this);
    this.io = new IntersectionObserver(([e])=>{ this.visible=e.isIntersecting; if(this.visible) this.loop(); }); this.io.observe(this);
    this.render();
  }
  disconnectedCallback(){ this.ro?.disconnect(); this.io?.disconnect(); cancelAnimationFrame(this.raf); this.raf=0; }
  attributeChangedCallback(){ if(this.isConnected){ this.applyGeometry(); this.applyImages(); } }

  applyGeometry(){
    const [w,d,f,h]=(this.getAttribute('ratio')||'381:43:148:576').split(':').map(Number);
    const px=v=>(BASE_H*v/h).toFixed(2)+'px', st=this.$stage.style;
    st.setProperty('--H',BASE_H+'px'); st.setProperty('--W',px(w)); st.setProperty('--D',px(d)); st.setProperty('--F',px(f));
    this.bookW=BASE_H*w/h; this.fit();
  }
  applyImages(){
    const base=this.getAttribute('src')||'./assets/', ext=this.getAttribute('ext')||'webp';
    for(const n of ['front','back','spine','flapR']) this.$stage.style.setProperty('--img-'+n,`url("${base}${n}.${ext}")`);
  }
  fit(){
    if(!this.bookW) return;
    const r=this.getBoundingClientRect(); if(!r.width) return;
    // leave room for the open spread (~2 book widths) and the button row
    const k=Math.min(1,(r.width*0.40)/this.bookW,(r.height*0.78)/BASE_H);
    this.$stage.style.setProperty('--k',k.toFixed(3)); this.k=k;
  }
  view(name){
    const [y,x,o,tx]=VIEWS[name]; this.idle=false; this.lastInput=performance.now();
    this.t.ry+=((y-this.t.ry)%360+540)%360-180; this.t.rx=x; this.t.open=o; this.t.tx=tx;
    this.shadowRoot.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===name)));
    if(this.reduced){ Object.assign(this.s,this.t); this.render(); } else this.loop();
  }
  bindDrag(){
    let down=false,lx=0,ly=0;
    this.$stage.addEventListener('pointerdown',e=>{ down=true; lx=e.clientX; ly=e.clientY; this.idle=false; this.$stage.classList.add('drag'); this.$stage.setPointerCapture(e.pointerId);
      this.shadowRoot.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed','false')); this.loop(); });
    this.$stage.addEventListener('pointermove',e=>{ if(!down) return; this.t.ry+=(e.clientX-lx)*.45; this.t.rx=Math.max(-30,Math.min(30,this.t.rx-(e.clientY-ly)*.3)); lx=e.clientX; ly=e.clientY;
      this.lastInput=performance.now(); if(this.reduced){ Object.assign(this.s,this.t); this.render(); } });
    const up=()=>{ down=false; this.$stage.classList.remove('drag'); this.lastInput=performance.now(); };
    this.$stage.addEventListener('pointerup',up); this.$stage.addEventListener('pointercancel',up);
  }
  loop(){
    if(this.raf||this.reduced) return;
    const step=()=>{
      this.raf=0; if(!this.visible) return;
      // resume the idle spin 6s after the last interaction, with the cover closed
      if(!this.idle && this.t.open===0 && performance.now()-this.lastInput>6000) this.idle=true;
      if(this.idle){ this.t.ry+=.25; this.t.open=0; this.t.tx=0; }
      let moving=this.idle;
      for(const k in this.s){ const d=this.t[k]-this.s[k]; if(Math.abs(d)>.01){ this.s[k]+=d*.1; moving=true; } }
      this.render();
      if(moving||!this.idle) this.raf=requestAnimationFrame(step);
    };
    this.raf=requestAnimationFrame(step);
  }
  render(){
    const s=this.s;
    this.$book.style.transform=`translateX(${s.tx*this.bookW}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
    this.$book.style.setProperty('--open',s.open.toFixed(2));
    this.$book.style.setProperty('--glare',(50+((((s.ry%360)+360)%360)-180)/3.6)+'%');
    this.$shadow.style.opacity=(.7+.3*Math.abs(Math.cos(s.ry*Math.PI/180))).toFixed(2);
  }
}
if(!customElements.get('book-mockup')) customElements.define('book-mockup', BookMockup);
