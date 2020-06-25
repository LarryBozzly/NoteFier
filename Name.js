export function Days_Count() {
  var days = ["Mon", "Tue", "Wed","Thu","Fri","Sat","Sun"];
  return days;
}
export function GetHours (){
  var Hours=[];
  for(var i=0;i<24;i++)
  {
    i=0+i;
    Hours[i]=i;
  }
  Hours[24]="";
  return Hours;
}
export function GetMinutes (){
  var Minutes=[];
  for(var i=0;i<60;i++)
  {
    Minutes[i]=i;
  }
  Minutes[60]="";
  return Minutes;
}
export function GetMonth (month){

  if(month==='January')
  {
    month='0';
    return month;
  }
  else if(month==="February")
  {
    month='1';
    return month;
  }
  else if(month==="March")
  {
    month='2';
    return month;
  }
  else if(month==="April")
  {
    month='3';
    return month;
  }
  else if(month==="May")
  {
    month='4';
    return month;
  }
  else if(month==="June")
  {
    month='5';
    return month;
  }
  else if(month==="July")
  {
    month='6';
    return month;
  }
  else if(month==="August")
  {
    month='7';
    return month;
  }
  else if(month==="September")
  {
    month='8';
    return month;
  }
  else if(month==="October")
  {
    month='9';
    return month;
  }
  else if(month==="November")
  {
    month='10';
    return month;
  }
  else if(month==="December")
  {
    month='11';
    return month;
  }
} 

