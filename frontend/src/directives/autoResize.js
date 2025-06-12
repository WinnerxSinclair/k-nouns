const EL_HEIGHT = 325;

export default {
  mounted(el){

    function resize(){
      if(el.scrollHeight > EL_HEIGHT){
        el.style.overflow = 'auto';
        el.style.height = 'auto';
        el.style.height = EL_HEIGHT + 'px';
        return;
      }
      el.style.overflow = 'hidden';
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }

    el.addEventListener('input', resize);

    resize();
  },
  updated(el){
    function resize(){
      if(el.scrollHeight > EL_HEIGHT){
        el.style.overflow = 'auto';
        el.style.height = 'auto';
        el.style.height = EL_HEIGHT + 'px';
        return;
      }
      el.style.overflow = 'hidden';
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
    resize();
  }
}