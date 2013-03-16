$(document).ready(function() {
  var updateListHeight = function() {
    $('#list .nav-list').height($('#list').height() - $('#list fieldset').outerHeight(true));
  };
  
  updateListHeight();
  $(window).on('resize', updateListHeight);
});