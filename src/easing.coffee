module.exports =
  linear: (t) -> t 
  easeInQuad: (t) -> t*t 
  easeOutQuad: (t) -> t*(2-t) 
  easeInOutQuad: (t) -> if t<.5 then 2*t*t else -1+(4-2*t)*t 
  easeInCubic: (t) -> t*t*t 
  easeOutCubic: (t) -> (--t)*t*t+1 
  easeInOutCubic: (t) -> if t<.5 then 4*t*t*t else (t-1)*(2*t-2)*(2*t-2)+1 
  easeInQuart: (t) -> t*t*t*t 
  easeOutQuart: (t) -> 1-(--t)*t*t*t 
  easeInOutQuart: (t) -> if t<.5 then 8*t*t*t*t else 1-8*(--t)*t*t*t 
  easeInQuint: (t) -> t*t*t*t*t 
  easeOutQuint: (t) -> 1+(--t)*t*t*t*t 
  easeInOutQuint: (t) -> if t<.5 then 16*t*t*t*t*t else 1+16*(--t)*t*t*t*t 