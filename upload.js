function select_file(tag) {
  $(tag).removeAttr("onClick");
  $(tag).children(".select_file").html($("<input type=file name='image'><input type='submit' value='Envoyer' onClick='put_file($(this).parent(),\""+ $(tag).attr("id")+"\")'>"))
}