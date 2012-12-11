

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
    var keyCode = e.keyCode;

    if(banged) {
      if(this.deletePressed(keyCode)) {
        command = command.slice(0, -1);
      } else if(this.downArrowPressed(keyCode)) {
        filterSelectedItemDown();
      } else if(this.upArrowPressed(keyCode)) {
        filterSelectedItemUp();
      } else if(this.leftOrRightArrowPressed(keyCode)) {
      } else if(this.enterKeyPressed(keyCode)) {
        e.preventDefault();
        if(liSelected) {
          selected = liSelected.text();
          if(this.isCommand(selected)) {
            extra = command;
            this.addTag(selected);
            this.resetListOfTags();
          }
          this.resetListOfTags();
          return false;
        }
      } else {
        command += String.fromCharCode(e.keyCode).toLowerCase().trim();
      }
      filterListOfTags(command);
    }

    if(this.bangKeyPressed(e.shiftKey, keyCode)) {
      banged = true;
      this.showListOfTags();
    }

    if(this.enterKeyPressed(keyCode)) {
      if(banged) {
        e.preventDefault();
      } else {
        $(el).closest("form").submit();
      }
    }

    if(this.spaceBarPressed(keyCode)) {
      if(banged) {
        if (this.isCommand(command)) {
          this.addTag(command);
        }
        this.resetListOfTags();
      }
    }

    // if backspace was called and text length is 0
    if(this.deletePressed(keyCode) && $(el).val().length == 0) {
      e.preventDefault();
      this.reset();
      removeTag();
    }

    // if the backspace was called and the banged is true so the list
    // is showing then hide list.
    if(this.deletePressed(keyCode) && $(el).val().substr(-1) == "!") {
      this.reset();
    }

    //if the last key pressed was ! and then hit delete
    if(lastKey == 49 && this.deletePressed(keyCode)) {
      this.reset();
    }

    if(e.shiftKey == false && this.tabKeyPressed(keyCode)) {
      if(this.nextElementIsSearchText()) {
        //this stops the tab from going to the main search_txt input
        e.preventDefault();
      }
    }

    //console.log("e.keyCode:" + e.keyCode);
    //40 == down arrow
    //38 == up arrow
    lastKey = e.keyCode;
  }

  this.nextElementIsSearchText = function() {
    var next_id = $(":input:eq(" + ($(":input").index(el) + 1) + ")").attr("id");
    return (next_id == "search_txt");
  };

  this.leftOrRightArrowPressed = function(keycode) {
    return (keycode == 37 || keycode == 39);
  };
  this.upArrowPressed = function(keycode) {
    return (keycode== 38);
  };

  this.downArrowPressed = function(keycode) {
    return (keycode == 40);
  };

  this.bangKeyPressed = function(shift, keycode) {
    return (shift == true && keycode == 49);
  };

  this.deletePressed = function(keycode) {
    return (keycode == 8);
  };

  this.enterKeyPressed = function(keycode) {
    return (keycode == 13);
  };

  this.spaceBarPressed = function(keycode) {
    return (keycode == 32);
  };

  this.tabKeyPressed = function(keycode) {
    return (keycode == 9);
  };

  this.reset = function() {
    if(banged) {
      this.resetListOfTags();
    }
  };

  this.resetListOfTags = function() {
    banged = false;
    command = "";
    liSelected = "";
    this.hideListOfTags();
  }

  this.isCommand = function(command) {
    return $.inArray(command, options.tags) == -1 ? false : true;
  }

  this.addTag = function(command) {
    cmd_count = cmd_count + 1;

    var tagHtml = this.addTagHtml(command, cmd_count);
    var inputs  = $(el).attr("class"); //cmd_count - 1;

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

  this.addTagHtml = function(command, cmd_count) {
    var tagHtml = "<div class='btn btn-primary' id='" + cmd_count + "'>";
        tagHtml += command;
        tagHtml += " <i class='icon-remove icon-white'></i>";
        tagHtml += "</div>";
        tagHtml += "<input type='text' autocomplete='off' class='" + cmd_count + "' id='" + command + "' name='" + command + "'/>";
        tagHtml += "<script language='text/javascript'>";
        tagHtml += "$('#" + cmd_count + "').click(function(e) {";
        tagHtml += "   var txtClass = $(this).attr('id'); ";
        tagHtml += "   $('.' + txtClass).remove();";
        tagHtml += "   $(this).remove();";
        tagHtml += "});";
        tagHtml += "</script>";
    return tagHtml;
  }

  function removeTag() {
    //id of the button to remove is stored in the class attribute of the text input
    var id = $(el).attr("class");
    var previousInput = (id - 1);
    if(isNaN(previousInput)) {
      setLastInputToWidthOfBangControl();
      return;
    } else {
      $("#" + id).remove();
      $(el).remove();
      $(el).bang = null;
      $(".bang_control").unbind("click");


      if($(".bang_control input:last").prev().length == 0) {
        $(".bang_control input").focus();
        setLastInputToWidthOfBangControl();
      } else {
        $(".bang_control input:last").prev().focus();
      }
    }
  }

  function setLastInputToWidthOfBangControl() {
    $(".bang_control input:last").css("width", $(".bang_control").width());
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

  function filterListOfTags(filter) {
    if (filter) {
      $(".tag_list").find("a:not(:contains(" + filter + "))").parent().slideUp();
      $(".tag_list").find("a:contains(" + filter + ")").parent().slideDown();
    } else {
      $(".tag_list").find("li").slideDown();
    }
  }

  this.hideListOfTags = function() {
    $(".tag_list").remove();
  };

  this.showListOfTags = function() {
    $(el).parent().after(this.showTagHtml(options.tags));
  };

  this.showTagHtml = function(tags) {
    var tagsHtml = "<ul class='tag_list span11'>";
    for(var i = 0; i < tags.length; i++) {
      tagsHtml += "<li><a href='#" + tags[i] + "'>" + tags[i] + "</a></li>";
    }
    tagsHtml += "</ul>";
    return tagsHtml;
  };
};

(function( $ ) {
   // custom css expression for a case-insensitive contains()
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

  $.fn.bang = function(options) {
    options = options || {};
	
    var focused = true;

    var min = 24, max = 1060, pad_right = 5, input = $("." + $(this).attr("class") + ":last")[0];
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
            var width = tmp.clientWidth+pad_right+4;
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
      bangbang.reset();
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
