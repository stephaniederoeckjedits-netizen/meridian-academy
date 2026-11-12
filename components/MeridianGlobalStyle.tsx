'use client';
const CSS = `
:root{--m-bg:#0a1018;--m-bg-deep:#070d14;--m-bg-glow:#10293a;--m-cyan:#22d3ee;--m-violet:#8b5cf6;--m-text:#e5e9f0;--m-muted:#8892a6;--m-dim:#566074;--m-line:rgba(34,211,238,.16);--m-line-strong:rgba(34,211,238,.30)}
html,body{background:var(--m-bg)!important;color:var(--m-text)!important;margin:0;min-height:100dvh;overflow-x:hidden;}
body>div:first-child,main{background:var(--m-bg)!important;color:var(--m-text)!important;}
*{scrollbar-width:none;-ms-overflow-style:none;}
*::-webkit-scrollbar{width:0;height:0;display:none;}
[data-portal-scroll]{overflow-y:auto!important;max-height:calc(100dvh - 130px);-webkit-overflow-scrolling:touch;}
.m-bg-root{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:transparent!important;}
.m-bg-base{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 18% 8%,var(--m-bg-glow) 0%,transparent 55%),radial-gradient(ellipse 70% 60% at 85% 12%,rgba(139,92,246,.10) 0%,transparent 50%),linear-gradient(180deg,var(--m-bg) 0%,var(--m-bg-deep) 100%)!important;}
.m-bg-grid{position:absolute;inset:0;opacity:.30;background-image:linear-gradient(rgba(34,211,238,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.05) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 28%,#000 0%,transparent 78%);mask-image:radial-gradient(ellipse 70% 60% at 50% 28%,#000 0%,transparent 78%);}
.m-bg-orb{position:absolute;border-radius:50%;filter:blur(60px);}
.m-bg-orb.a{width:46vw;height:46vw;left:-8vw;top:-12vw;background:radial-gradient(circle,rgba(34,211,238,.40),transparent 70%);opacity:.22;}
.m-bg-orb.b{width:40vw;height:40vw;right:-10vw;top:6vw;background:radial-gradient(circle,rgba(139,92,246,.35),transparent 70%);opacity:.16;}
.m-bg-horizon{position:absolute;left:0;right:0;bottom:0;height:38vh;background:linear-gradient(180deg,transparent,rgba(7,13,20,.85));opacity:.9;}
.m-bg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 42%,transparent 40%,rgba(3,6,12,.40) 100%);}
.meridian-logo-stage{display:grid;place-items:center;background:transparent!important;padding:0;margin:0;}
.meridian-logo-stage svg,.meridian-logo-stage img{display:block;background:transparent!important;filter:drop-shadow(0 0 16px rgba(34,211,238,.22)) drop-shadow(0 0 30px rgba(139,92,246,.12));}
.m-home{position:relative;min-height:100dvh;display:flex;flex-direction:column;}
.m-home-top,.m-home-bot{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px 22px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.22em;color:var(--m-dim);text-transform:uppercase;}
.m-home-top{padding-top:18px;}
.m-home-bot{margin-top:auto;padding-bottom:18px;}
.m-dot-live{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 10px #34d399;display:inline-block;margin-right:8px;}
.m-home-body{position:relative;z-index:10;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 18px 40px;}
.m-home-logo{margin-bottom:30px;}
.m-home-logo svg{width:min(46vw,230px);height:auto;}
.m-menu{width:min(92vw,560px);background:rgba(10,16,24,.62)!important;border:1px solid var(--m-line-strong)!important;border-radius:14px;box-shadow:0 0 70px rgba(34,211,238,.08),inset 0 0 70px rgba(34,211,238,.025);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);overflow:hidden;}
.m-menu-head{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--m-line);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;}
.m-menu-head .l{display:inline-flex;align-items:center;gap:9px;color:var(--m-cyan);}
.m-menu-head .l .dot{width:6px;height:6px;border-radius:50%;background:var(--m-cyan);box-shadow:0 0 8px var(--m-cyan);}
.m-menu-head .r{color:var(--m-dim);}
.m-menu-list{max-height:min(52vh,420px);overflow-y:auto;}
.m-row{display:flex;align-items:center;gap:16px;padding:16px 18px;text-decoration:none;color:inherit;border-bottom:1px solid rgba(255,255,255,.04);transition:background .18s,transform .18s;}
.m-row:last-child{border-bottom:0;}
.m-row:hover,.m-row:focus-visible{background:rgba(34,211,238,.06);outline:none;}
.m-row:hover .m-row-chev{transform:translateX(4px);color:var(--m-cyan);}
.m-row-icon{flex:0 0 auto;width:42px;height:42px;border-radius:10px;display:grid;place-items:center;border:1px solid var(--m-line);background:rgba(255,255,255,.02);color:var(--m-muted);transition:color .18s,border-color .18s;}
.m-row:hover .m-row-icon{color:var(--m-cyan);border-color:var(--m-line-strong);}
.m-row-icon svg{width:20px;height:20px;}
.m-row-main{flex:1;min-width:0;}
.m-row-idx{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;letter-spacing:.2em;color:var(--m-dim);margin-bottom:3px;}
.m-row-title{font-size:17px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--m-text);line-height:1.1;}
.m-row-sub{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.12em;color:var(--m-muted);margin-top:4px;text-transform:uppercase;}
.m-row-chev{flex:0 0 auto;color:var(--m-dim);transition:transform .18s,color .18s;}
.m-row-chev svg{width:18px;height:18px;}
.m-load{position:relative;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:24px;}
.m-load-logo svg{width:min(54vw,250px);height:auto;animation:m-pulse 2.4s ease-in-out infinite;}
.m-load-quote{font-family:'Cinzel','Trajan Pro',Georgia,serif;font-style:italic;font-size:clamp(15px,2.4vw,22px);color:var(--m-text);text-align:center;max-width:640px;opacity:.92;}
.m-load-author{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.3em;color:var(--m-cyan);text-transform:uppercase;margin-top:-10px;}
.m-load-bar-wrap{width:min(72vw,320px);margin-top:8px;}
.m-load-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;letter-spacing:.34em;color:var(--m-dim);text-transform:uppercase;text-align:center;margin-bottom:8px;}
.m-load-bar{height:2px;width:100%;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;}
.m-load-fill{height:100%;width:0%;background:linear-gradient(90deg,var(--m-cyan),var(--m-violet));box-shadow:0 0 12px rgba(34,211,238,.6);animation:m-fill 2.1s cubic-bezier(.4,0,.2,1) forwards;}
@keyframes m-fill{from{width:0%}to{width:100%}}
@keyframes m-pulse{0%,100%{filter:drop-shadow(0 0 14px rgba(34,211,238,.25)) drop-shadow(0 0 26px rgba(139,92,246,.14))}50%{filter:drop-shadow(0 0 22px rgba(34,211,238,.4)) drop-shadow(0 0 40px rgba(139,92,246,.24))}}
@media(prefers-reduced-motion:reduce){.m-load-logo svg{animation:none}.m-load-fill{animation:none;width:100%}}
@media(max-width:560px){.m-home-top,.m-home-bot{padding:12px 14px;font-size:9px;letter-spacing:.16em}.m-row-title{font-size:15px}.m-row-icon{width:38px;height:38px}}
`;
export default function MeridianGlobalStyle(){return<style dangerouslySetInnerHTML={{__html:CSS}}/>}