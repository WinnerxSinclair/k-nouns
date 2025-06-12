export function schedule ({ reps, interval, ease }, quality) {

  if(quality === 1) return 2;

  if (quality <= 3) {  
    return 1;
  }

  if(reps === 0){
    interval = 1;
  }else if(reps === 1){
    interval = 6;
  }else{
    interval = Math.round(interval * ease);
  }

  return interval;

}