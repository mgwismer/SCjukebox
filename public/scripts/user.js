$(document).ready(function(){
  $( ".main-delete-btn" ).click(function() {
     $('#delete-modal').modal("show");
  });
  $(".cancel-btn").click(function(){
     $('#delete-modal').modal("hide");
  });
});