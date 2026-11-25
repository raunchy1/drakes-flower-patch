(function(){
  document.documentElement.classList.add('anim');
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* split hero title into words for the intro animation (safe for nested tags) */
  $$('[data-split]').forEach(function(el){
    var i=0;
    (function split(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if(!part.trim()){frag.appendChild(document.createTextNode(part));return}
            var w=document.createElement('span');w.className='w';
            var it=document.createElement('i');it.style.setProperty('--i',i++);it.textContent=part;
            w.appendChild(it);frag.appendChild(w);
          });
          node.replaceChild(frag,n);
        } else if(n.nodeType===1 && !/^br$/i.test(n.tagName)) split(n);
      });
    })(el);
  });

  /* reveal on scroll; a clip-path element never "intersects": watch its container */
  var mappa=new Map();
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      (mappa.get(e.target)||[]).forEach(function(el){el.classList.add('in')});
      io.unobserve(e.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('[data-r]').forEach(function(el){io.observe(el)});
  $$('[data-svela]').forEach(function(el){
    var t=(el.parentElement&&el.parentElement!==document.body)?el.parentElement:el;
    if(!mappa.has(t)){mappa.set(t,[]);io.observe(t)}
    mappa.get(t).push(el);
  });
  var split=$('[data-split]');
  requestAnimationFrame(function(){requestAnimationFrame(function(){split&&split.classList.add('in')})});

  /* fail-safe: if the observer doesn't fire (old browser, throttled tab),
     everything becomes visible shortly after load — no blank page */
  setTimeout(function(){
    $$('[data-r],[data-svela],[data-split]').forEach(function(el){el.classList.add('in')});
  },1500);

  /* 6% parallax on the hero photo only, not under reduced motion */
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var heroImg=$('#hero-img');
    var raf=false;
    addEventListener('scroll',function(){
      if(raf) return; raf=true;
      requestAnimationFrame(function(){
        raf=false;
        if(heroImg){
          var r=heroImg.getBoundingClientRect();
          var off=Math.max(-14,Math.min(14,(r.top-.5*innerHeight)*.02));
          heroImg.style.transform='translateY('+off+'px) scale(1.08)';
        }
      });
    },{passive:true});
  }

  /* sticky header shadow */
  var hdr=$('#hdr');
  addEventListener('scroll',function(){hdr.style.boxShadow=scrollY>10?'0 2px 18px rgba(34,39,31,.08)':''},{passive:true});

  /* mobile menu */
  var b=$('#burger'),m=$('#menu');
  b.addEventListener('click',function(){
    var open=m.classList.toggle('open');
    b.setAttribute('aria-expanded',open);
  });
  $$('a',m).forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded','false')})});
})();
