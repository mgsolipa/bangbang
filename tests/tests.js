
module("Hide list of tags");
test("hideListOfTags removes .tag_list", function() {
  $("#qunit-fixture").append("<div class='tag_list'></div>");
  equal($(".tag_list").length, 1);

  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  bangbang.hideListOfTags();

  equal($(".tag_list").length, 0);
});

/* KEY CODE TESTS */
module("Left or Right Arrow Tests");
test("when keycode is 37 or 39 should return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.leftOrRightArrowPressed(37) == true);
  ok(bangbang.leftOrRightArrowPressed(39) == true);
});
test("when keycode not 37 or 39 should return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.leftOrRightArrowPressed(1) == false);
});

module("Up Arrow Pressed");
test("when is keycode is 38 return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.upArrowPressed(38) == true);
});
test("when is keycode is not 38 return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.upArrowPressed(1) == false);
});

module("Down Arrow Pressed");
test("when is keycode is 40 return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.downArrowPressed(40) == true);
});
test("when is keycode is not 40 return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.downArrowPressed(1) == false);
});

module("bang key Pressed");
test("when is keycode is 49 and shift key is pressed return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.bangKeyPressed(true, 49) == true);
});
test("when is keycode is not 49 and shift key is pressed return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.bangKeyPressed(true, 1) == false);
});
test("when is keycode is 49 and shift key is not pressed return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.bangKeyPressed(false, 49) == false);
});
test("when is keycode is not 49 and shift key is not pressed return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.bangKeyPressed(false, 1) == false);
});

module("delete key pressed");
test("when is keycode is 8 return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.deletePressed(8) == true);
});
test("when is keycode is not 8 return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.deletePressed(9) == false);
});


module("tab key pressed");
test("when is keycode is 9 return true", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.tabKeyPressed(9) == true);
});
test("when is keycode is not 9 return false", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.tabKeyPressed(10) == false);
});


module( "isCommand Tests" );
test("isCommand should return true when command is found in tags", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.isCommand("test") == true);
});

test("isCommand should return false when command is not found in tags", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  ok(bangbang.isCommand("404") == false);
});

module( "Show Tag Tests" );
test("show tags should render html with a list of tags", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  equal(bangbang.showTagHtml(["FirstName", "LastName"]), "<ul class='tag_list span11'><li><a href='#FirstName'>FirstName</a></li><li><a href='#LastName'>LastName</a></li></ul>")
});
test("show tags should return empty html list when there are no tags", function() {
  var options = { tags: ["bang","test"] };
  var bangbang = new BANG.Bang(this, options);
  equal(bangbang.showTagHtml([]), "<ul class='tag_list span11'></ul>");
});

