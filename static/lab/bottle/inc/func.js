function GET(p) {
	var h = '';
	var colors=['#F99D35','#FB353E','#301141','#388CDE','#FE0096','#1BA0E1','#339933','#E91104'];
	var share = '<div id="share" class="icon-sina-weibo"></div>';
	$.ajax({
		url: 's.php?p='+p,
		type: 'GET',
		dataType: 'jsonp',
		success: function(d) {
			$.each(d, function(i, item){
				var c = i % 8;
				h += '<li id="'+item.id+'" style="background-color:'+colors[c]+';">'+item.text+share+'</li>';	
			});
			$('#show').html(h);
		}
	});
}

//Support For Insert Someting to TextArea
function insertAtCursor(myField, myValue) {
  //IE support
  if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
    sel.select();
  }
  //MOZILLA/NETSCAPE support
  else if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    // save scrollTop before insert
    var restoreTop = myField.scrollTop;
    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
    if (restoreTop > 0) {
      // restore previous scrollTop
      myField.scrollTop = restoreTop;
    }
    myField.focus();
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
  } else {
    myField.value += myValue;
    myField.focus();
  }
}

//Support For Tab
		HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
		    return this.selectionStart;
		};
		HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
		    this.selectionStart = position;
		    this.selectionEnd = position;
		    this.focus();
		};
		HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
		    if (this.selectionStart == this.selectionEnd) {
		        return false;
		    } else {
		        return true;
		    }
		};
		HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
		    return this.value.substring(this.selectionStart, this.selectionEnd);
		};
		HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
		    this.selectionStart = start;
		    this.selectionEnd = end;
		    this.focus();
		};
		 
		var textarea = document.getElementsByTagName('textarea')[0];
		 
		textarea.onkeydown = function(event) {
		     
		    //support tab on textarea
		    if (event.keyCode == 9) { //tab was pressed
		        var newCaretPosition;
		        newCaretPosition = textarea.getCaretPosition() + "    ".length;
		        textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "    " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		        textarea.setCaretPosition(newCaretPosition);
		        return false;
		    }
		    if(event.keyCode == 8){ //backspace
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            var newCaretPosition;
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 3) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    }
		    if(event.keyCode == 37){ //left arrow
		        var newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }   
		    }
		    if(event.keyCode == 39){ //right arrow
		        var newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() + 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() + 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    }
		}