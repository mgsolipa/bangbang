

var BANG = BANG || {};

BANG.Bang = function(el, options) {

  this.options  = options;
  this.parent   = $(el).parent();
  var el       = el;
  var lastKey  = ""
  var banged   = false;
  var command  = "";
  var liSelected;
  var cmd_count = options.count || 0;
  var extra = "";

  this.bangInputKey = function(e) {

    if(banged) {
      if(e.keyCode == 8) {
        //backspace was pressed
        command = command.slice(0, -1);
      } else if(e.keyCode == 40) {
        //down arrow pressed
        filterSelectedItemDown();
      } else if(e.keyCode == 38) {
        //up arrow pressed
        filterSelectedItemUp();
      } else if(e.keyCode == 37 || e.keyCode == 39) {
        //37 = left arrow
        //39 = right arrow
      } else if(e.keyCode == 13) {
        e.preventDefault();
        //enter is pressed and the list is viewable
        if(liSelected) {
          selected = liSelected.text(); //$(el).val().substr(0, $(el).val().lastIndexOf("!")) + liSelected.text();
          if(isCommand(selected)) {
            extra = command;
            addTag(selected);
          }
          resetListOfTags();
        }
      } else {
        command += String.fromCharCode(e.keyCode).toLowerCase().trim();
      }
      filterListOfTags(command);
    }

    //checks for the ! was pressed
    if(e.shiftKey && e.keyCode == 49) {
      banged = true;
      showListOfTags();
    }

    //enter key is pressed do not submit form.
    if(e.keyCode == 13) {
      if(banged) {
        e.preventDefault();
      }
    }

    // if the space bar was pressed
    if(e.keyCode == 32) {
      if(banged) {
        if (isCommand(command)) {
          addTag(command);
        }
        resetListOfTags();
      }
    }

    // if backspace was called and text length is 0
    if(e.keyCode == 8 && $(el).val().length == 0) {
      e.preventDefault();
      if(banged) {
        resetListOfTags();
      }
      removeTag();
    }

    // if the backspace was called and the banged is true so the list
    // is showing then hide list.
    if(e.keyCode == 8 && $(el).val().substr(-1) == "!") {
      if(banged) {
        resetListOfTags();
      }
    }

    //if the last key pressed was ! and then hit delete
    if(lastKey == 49 && e.keyCode == 8) {
      if(banged) {
        resetListOfTags();
      }
    }

    //alert(e.keyCode);
    //40 == down arrow
    //38 == up arrow
    lastKey = e.keyCode;
  }

  //clicks out of the box
  this.bangBlur = function(e) {
    if(banged) {
      resetListOfTags();
    }
  }


  function isCommand(command) {
    return $.inArray(command, options.tags) == -1 ? false : true;
  }

  function addTag(command) {
    cmd_count = cmd_count + 1;

    var tagHtml = "<div class='btn btn-primary' id='" + cmd_count + "'>";
        tagHtml += command;
        tagHtml += " <i class='icon-remove icon-white'></i>";
        tagHtml += "</div>";
        tagHtml += "<input type='text' class='" + cmd_count + "' id='" + command + "' name='" + command + "'/>";
        tagHtml += "<script language='text/javascript'>";
        tagHtml += "$('#" + cmd_count + "').click(function(e) {";
        tagHtml += "   var txtClass = $(this).attr('id'); ";
        tagHtml += "   $('.' + txtClass).remove();";
        tagHtml += "   $(this).remove();";
        tagHtml += "});";
        tagHtml += "</script>";

    var inputs = $(el).attr("class"); //cmd_count - 1;

    if(inputs == 0 || inputs == "none") {
      $(el).val('');
      $(el).before(tagHtml);
    } else {
      var selector = "." + inputs + ":last";

      current_value = $(selector).val().replace("!" + command,"");
      current_value = current_value.replace("!" + extra,"");
      extra = "";

      $(selector).val(current_value);

      var inputSize = current_value.length * 7;
      $(selector).css("width", inputSize);
      $(selector).after(tagHtml);
    }

    $("." + cmd_count + ":last").focus();
    $("." + cmd_count + ":last").bang({ tags: options.tags, count: cmd_count });
  }

  function removeTag() {
    //id of the button to remove is stored in the class attribute of the text input
    var id = $(el).attr("class");
    var previousInput = (id - 1);

    if(isNaN(previousInput)) {
      return;
    } else {
      $("#" + id).remove();
      $(el).remove();
      $(el).bang = null;
      $(".bang_control").unbind("click");

      if($(".bang_control input:last").prev().length == 0) {
        $(".bang_control input").focus();
      } else {
        $(".bang_control input:last").prev().focus();
      }
    }
  }

  function filterSelectedItemDown() {
    var li = $(".tag_list li:visible");
    if(liSelected){
      liSelected.removeClass('selected');
      next = liSelected.next();
      if(next.length > 0){
        liSelected = next.addClass('selected');
      } else {
        liSelected = li.eq(0).addClass('selected');
      }
    } else {
      liSelected = li.eq(0).addClass('selected');
    }
  }

  function filterSelectedItemUp() {
    if(liSelected){
      liSelected.removeClass('selected');
      next = liSelected.prev();
      if(next.length > 0){
        liSelected = next.addClass('selected');
      } else {
        liSelected = li.last().addClass('selected');
      }
    } else {
      liSelected = li.last().addClass('selected');
    }
  }

  function resetListOfTags() {
    banged = false;
    command = "";
    liSelected = "";
    hideListOfTags();
  }

  function filterListOfTags(filter) {
    if (filter) {
      $(".tag_list").find("a:not(:contains(" + filter + "))").parent().slideUp();
      $(".tag_list").find("a:contains(" + filter + ")").parent().slideDown();
    } else {
      $(".tag_list").find("li").slideDown();
    }
  }

  function hideListOfTags() {
    $(".tag_list").remove();
  }

  function showListOfTags() {
    var tagsHtml = "<ul class='tag_list span11'>";
    for(var i = 0; i < options.tags.length; i++) {
      tagsHtml += "<li><a href='#" + options.tags[i] + "'>" + options.tags[i] + "</a></li>";
    }
    tagsHtml += "</ul>";
    $(el).parent().after(tagsHtml);
  }
};

(function( $ ) {
   // custom css expression for a case-insensitive contains()
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

  $.fn.bang = function(options) {
    options = options || {};
	
    var focused = true;

    var min = 20, max = 1060, pad_right = 5, input = $("." + $(this).attr("class") + ":last")[0]; //document.getElementById($(this).attr("id"));
    input.style.width = min+'px';
    input.onkeypress = input.onkeydown = input.onkeyup = function(){
        var input = this;
        setTimeout(function(){
            var tmp = document.createElement('div');
            tmp.style.padding = '0';
            if(getComputedStyle)
                tmp.style.cssText = getComputedStyle(input, null).cssText;
            if(input.currentStyle)
                tmp.style = input.currentStyle;
            tmp.style.width = '';
            tmp.style.position = 'absolute';
            tmp.innerHTML = input.value.replace(/&/g, "&amp;")
                                       .replace(/</g, "&lt;")
                                       .replace(/>/g, "&gt;")
                                       .replace(/"/g, "&quot;")
                                       .replace(/'/g, "&#039;")
                                       .replace(/ /g, '&nbsp;');
            if(input.parentNode) {
            input.parentNode.appendChild(tmp);
            var width = tmp.clientWidth+pad_right+1;
            tmp.parentNode.removeChild(tmp);
            if(min <= width && width <= max)
                input.style.width = width+'px';
            }
        }, 1);
    }

    var bangbang = new BANG.Bang(this, options);
    $(this).keydown(function(e) {
      bangbang.bangInputKey(e);
    });

    $(this).blur(function(e) {
      bangbang.bangBlur();
    });

    $(".bang_control input").click(function() {
      $(this).focus();
      return false;
    });

    $(".bang_control").click(function(e) {
      e.stopPropagation();
      if($(".bang_control input").length <= 1) {
        $(".bang_control input:last").focus();
      } else {
        $(".bang_control input:last").prev().focus();
      } 
    });
  };

})( jQuery );
