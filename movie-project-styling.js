$(function (){
   "use strict";

   $('div img').hover(
       function () {
          $(this).css('opacity', '.5');
       },
       function () {
          $(this).css({'background-color': 'rgba(27,69,51,0)', 'color': 'rgba(152,237,177,0)', 'border-radius': '4px'});
       }
   );





});