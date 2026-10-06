$(function() {
/*playlist init*/
if(location.protocol.indexOf("https") === -1) location.href = "https://"+location.host+location.pathname;
/**
 * All Background Images come from itorr
 * http://i.mouto.org
 */
var bgs = [
	'http://ww3.sinaimg.cn/large/a15b4afejw1e0f7d85hr2j.jpg',
	'http://ww2.sinaimg.cn/large/a15b4afejw1e0bk2z4zsaj.jpg',
	'http://ww4.sinaimg.cn/large/a15b4afejw1e0bggbcc1sj.jpg',
	'http://ww4.sinaimg.cn/large/a15b4afejw1e0bgf1bg0oj.jpg',
	'http://ww3.sinaimg.cn/large/6505e363gw1edhqgqyg2oj21kw11sk41.jpg',
	'http://ww4.sinaimg.cn/large/6505e363gw1edhqg3rxakj21kw11stk0.jpg'
];
var bg = parseInt( bgs.length * Math.random() );
$('#background').attr('src', bgs[bg]);
playlist.load();
if(!location.hash) {
	var lists = $('.playlist li');
	location.hash = '#'+lists[parseInt(Math.random()*lists.length)].getAttribute('data-id');
} else if(!!~location.hash.indexOf('access_token=')) {
    $('#tools').removeClass('display');
    $('.dropbox').html("正在同步中...");
    DropboxSync();
}
/*alert init*/
if(localStorage.alert) {
	$('#alert').addClass('display');
}

/*search*/
$('input[name="song"]').on('keydown', function(e) {
	if(e.keyCode != '13') return true;
	$('.result').attr('page', '1');
	search();
});

/*add song*/
$('.result').on('click', 'li', function() {
	location.href = '#'+$(this).attr('data-id');
	box.init($(this).attr('data-id'), function(res) {box.setplay(res);});
	$('.result ul').html('');
	$('.result').addClass('display');
});

$(document).on('click', '.fa-heart-o', function() {
	playlist.addItem($('.info').attr('data-id'), $('.title').text(), $('.artist').text());

	$(this).addClass('fa-heart');
	$(this).removeClass('fa-heart-o');
});

$(document).on('click', '.fa-heart', function() {
	playlist.removeItem($('.info').attr('data-id'));

	$(this).addClass('fa-heart-o');
	$(this).removeClass('fa-heart');
})

/*prev*/
$('.nav span')[0].onclick = function() {
	var page = parseInt($('.result').attr('page'));
	$('.result').attr('page', page != 1 ? page-1 : 1);
	search();
}

/*next*/
$('.nav span')[1].onclick = function() {
	var page = parseInt($('.result').attr('page'));
	$('.result').attr('page', page+1);
	search();
}

$('.button').on('click', '.fa-play', function() {
	if($('#box audio').length == 0) return false;
	$(this).addClass('fa-pause');
	$(this).removeClass('fa-play');
	box.play();	
});

$('.button').on('click', '.fa-pause', function() {
	if($('#box audio').length == 0) return false;
	$(this).addClass('fa-play');
	$(this).removeClass('fa-pause');
	box.pause();
});

$('.button').on('click', '.fa-fast-forward', function() {
	/*
	 * if Id doesn't exist, then start number be the first one.
	 */
	var _l = $('.playlist li').length, 
		_n = 1;
	if($('.playlist li[data-id="'+$('.info').attr('data-id')+'"]').length > 0) {
		$.each($('.playlist li'), function(i, item){_n = $(item).attr('data-id') == $('.info').attr('data-id') ? i+1 : 0;});
		_n = (_n != _l) ? _n : 1;
	}
	var _t = parseInt(Math.random()*(_l-_n) + _n);
	box.init($($('.playlist li')[_t]).attr('data-id'), function(res){box.setplay(res);});
});

$('.button').on('click', '.fa-fast-backward', function() {
	/*
	 * if Id doesn't exist, then start number be the last one.
	 */
	var _l = $('.playlist li').length, 
		_n = _l;
	if($('.playlist li[data-id="'+$('.info').attr('data-id')+'"]').length > 0) {
		$.each($('.playlist li'), function(i, item){_n = $(item).attr('data-id') == $('.info').attr('data-id') ? i+1 : 0;});
		_n = (_n != 1) ? _n : _l;
	}
	var _t = parseInt(Math.random()*(_n - 1) + 1);
	box.init($($('.playlist li')[_t]).attr('data-id'), function(res){box.setplay(res);});
});

$('.playlist').on('click', 'li', function() {
	location.href = '#'+$(this).attr('data-id');
	box.init($(this).attr('data-id'), function(res) {box.setplay(res);});
});

$('#footer .ctrlist').click(function() {
	if($('#left.hover').length > 0) {
		$('#left').removeClass('hover');
		$('span', $(this)).html('开启');
	} else {
		$('#left').addClass('hover');
		$('span', $(this)).html('关闭');
	}
});

$('#footer .ctrlyric').click(function() {
	if($('#lyric.hover').length > 0) {
		$('#lyric').removeClass('hover');
		$('span', $(this)).html('开启');
	} else {
		$('#lyric').addClass('hover');
		$('span', $(this)).html('关闭');
	}
});

$('#footer a').click(function(){
	window.open($(this).attr('href'),'_blank','resizable=0,scrollbars=0,width=800,height=600');
	return false;
});

$('.fa-times').click(function() {
	localStorage.alert = true;
	$(this).parent().addClass('display');
});

$('#footer .about').click(function() {$('#alert').removeClass('display');});
$('#footer .tool').click(function() {$('#tools').removeClass('display');});

$('#tools .import').click(function() {
	var text = $('#tools textarea').val();
	localStorage.song = text ? JSON.stringify(JSON.parse(text)) : "";
	playlist.reload();
});

$('#tools .export').click(function() {
	var text = $('#tools textarea').val();
	export_raw('redheart.json', text ? JSON.stringify(JSON.parse(text)) : "");
});

/*Dropbox*/
$('.dropbox').click(function() {
    if(!~location.hash.indexOf('access_token')) {
        if(confirm("你必须先授权才能进行同步，是否确定进行授权?")) DropboxSync();
    } else DropboxSync();
})


box.init(location.hash.substr(1), function(res){box.setplay(res)});
$(document).on('keydown', function(e) {
	var fs = $('input[name="song"]').is(':focus');
	if(fs) return true;
	switch(parseInt(e.keyCode)) {
		case 32:
			$('.fa-play').length > 0 ? $('.fa-play').click() : $('.fa-pause').click();
		break;

		case 37:
			$('.fa-fast-backward').click();
		break;

		case 39:
			$('.fa-fast-forward').click();
		break;
		//D
		case 68:
			if($('.fa-heart').length > 0)
				$('.fa-heart').click();
		break;
		//F
		case 70:
			if($('.fa-heart-o').length > 0)
				$('.fa-heart-o').click();
		break;
	}
});

/*progressbar*/
bar = $('#bar'), progress = $('#progress'), control =$('#control');
limit = {
	left:0,
	right:bar.width() - control.width()
};
document.onmouseup = function() {document.onmousemove = null;}
control[0].ondragstart = function(e) {e.preventDefault();}
$(document).on('mousedown', '#control', function(e){
	document.onmousemove = function(e) {
		var left = e.pageX - parseInt( bar.offset().left ), now = progress.width();
		if(left <= limit.left)	left = limit.left;
		if(left >= limit.right) left = limit.right;
		if( now <= limit.right ) {
			control.css('margin-left', left - limit.left + 'px');
			progress.css('width', left - limit.left + 'px');
		}

		var percent = parseInt( progress.width() / ( limit.right - limit.left ) * 100 ) / 100;
		box.play(percent * parseFloat( $('#box').attr('time') ));
	}
});

/*volume*/
var vol = $('.vol'), volume = $('.volume');
var volMax = vol.height();
$(document).on('mousedown', '.vol', function(e) {
	/** cancel drag **/
	var style = document.createElement("style");
	style.type="text/css";
	style.id = "user-select";
	style.innerHTML = "*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}";
	document.body.appendChild(style);

	var intY = e.pageY, intHeight = volume.height();
	document.onmousemove = function(e) {
		// x 1/2 to transition offset
		var offset = (e.pageY - intY) / 2;
		var tarHeight = intHeight + offset;
		if(tarHeight < 0) tarHeight = 0;
		else if(tarHeight > volMax) tarHeight = volMax;
		volume.css({"height":tarHeight+"px"});
		$('#box').jPlayer("volume", 1-tarHeight/volMax);
	}
})
$(document).on('mouseup', function(e) {
	$('#user-select') && $('#user-select').remove();
	document.onmousemove = null;
})
});

var search = function() {
	var query = $('input[name="song"').val(), page = $('.result').attr('page');
	$.getJSON('http://songs.sinaapp.com/search/key/'+query+'/page/'+page+'?callback=?', function(res) {
		$('.result').removeClass('display');
		$('.result ul').html('');
		$.each(res.results, function(i, item) {
			$('<li data-id="'+item.song_id+'">'+decodeURIComponent(item.song_name).split('+').join(' ')+' - '+decodeURIComponent(item.artist_name).split('+').join(' ')+'</li>').appendTo('.result ul');
		});
	});
}

var box = {
	init: function(id, callback) {
		$.getJSON('http://songs.sinaapp.com/apiv3.php?id='+id+'&callback=?', function(res) {
			callback(res);
		});
	},
	setplay: function(res) {
		box.clear();
		$('#box').jPlayer({
			ready: function(e) {
				$(this).jPlayer('setMedia', {mp3: res.location}).jPlayer('play');
				box.setinfo(res);
			},
			preload: 'auto',
			play: function(e) {
				$('.fa-play').addClass('fa-pause');
				$('.fa-play').removeClass('fa-play');
			},
			ended: function() {
				$('.button .fa-fast-forward').click();
			},
			swfPath: './box/',
			supplied: 'mp3,wma,ogg,ape',
			timeupdate: function(e) {
				if($('#box').attr('time') != e.jPlayer.status.duration)	$('#box').attr('time', e.jPlayer.status.duration);
				$('.info .time').html(box.time(e.jPlayer.status.duration - e.jPlayer.status.currentTime));
				/*progressbar*/
				$('#control').css('margin-left', (parseFloat(e.jPlayer.status.currentTime / e.jPlayer.status.duration)*100).toFixed(2)+'%');
				$('#progress').css('width', (parseFloat(e.jPlayer.status.currentTime / e.jPlayer.status.duration)*100).toFixed(2)+'%');
				/*1 min 6 circles*/
				var deg = parseInt(parseInt(e.jPlayer.status.duration / 15) * 360 * parseFloat(e.jPlayer.status.currentTime / e.jPlayer.status.duration));
				$('.album img').css('-webkit-transform', 'rotate('+deg+'deg)');
				$('.album img').css('transform', 'rotate('+deg+'deg)');
				/*lyric*/
				var _now = $('#lyric p.now').length > 0 ? $('#lyric p.now') : $('#lyric p:first-child');
				if(e.jPlayer.status.currentTime > parseInt(_now.next().attr('time'))) {
					_now.removeClass('now');
					_now.next().addClass('now');
					var marginTop = parseFloat($('#lyric p:first-child').css('margin-top')), lineHeight = _now.height();
					$('#lyric p:first-child').css('margin-top', marginTop - lineHeight + 'px');
				}
			}
		});
	},
	setinfo: function(res) {
		location.hash = res.id;
		$('title').html(res.title);
		$('.album img').attr('src', res.pic);
		$('.info .title').html(res.title);
		$('.info .artist').html(res.artist);
		if(playlist.findItem(res.id)) {
			var fav = $('.fa-heart-o');
			if(fav.length > 0) {
				fav.removeClass('fa-heart-o');
				fav.addClass('fa-heart');
			}
		} else {
			var fav = $('.fa-heart');
			if(fav.length > 0) {
				fav.removeClass('fa-heart');
				fav.addClass('fa-heart-o')
			}
		}
		$('.info').attr('data-id', res.id);
		setTimeout(function(){
			var _img = encodeURIComponent(res.pic), _name = encodeURIComponent(res.title), _text = encodeURIComponent("我正在#红心电台#听«"+res.title+"»这首歌。还不错哟，你也快来听听吧！"), _url = encodeURIComponent("http://imnerd.org/lab/player/#"+res.id);
			$('#footer a')[0].href = "http://service.weibo.com/share/share.php?url="+_url+"&title="+_text+"&language=zh_cn&pic="+_img+"&appkey=1583605849&source=bookmarket";
			$('#footer a')[1].href = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+_url+"&title="+_name+"&pics="+_img+"&summary="+_text;
			$('#footer a')[2].href = "http://www.douban.com/share/service?image="+_img+"&href="+_url+"&name="+_text+"&summary="+_text;
		},650);
		box.getlyric(res.lyric, function(res) {
			$('#lyric').html('');
			$.each(res, function(i,item){
				$('#lyric').append('<p time="'+item[0]+'">'+item[1]+'</p>');
			});
		});
	},
	play: function(time) {
		time != null ? $('#box').jPlayer('play', time) : $('#box').jPlayer('play');
	},
	pause: function() {
		$('#box').jPlayer('pause');
	},
	stop: function() {
		$('#box').jPlayer('stop');
	},
	clear: function() {
		$('#box').jPlayer('destroy');
	},
	time: function(sec) {
		var min = parseInt(sec/60), second = parseInt(sec - min*60);
		if(min < 10) min = '0'+min;
		if(second < 10) second = '0'+second;
		return '- '+min+':'+second;
	},
	getlyric: function(url, callback) {
		$.getJSON('http://imnerd.org/lab/player/lyric.php?url='+url+'&callback=?', function(res){callback(res)});
	}
}

playlist = {
    key: "Redio",
    update: function(songs) {
        localStorage[this.key] = JSON.stringify(songs);
    },
    getItem: function() {
        return JSON.parse(localStorage[this.key] || "[]").sort(function(a,b){
            return a.created-b.created
        });
    },
    do: function(id, title, artist, action) {
        var songs = this.getItem();
        songs.push({
            created: new Date().getTime(),
            action: action,
            song: {id:id, title:title, artist:artist}       
        })
        this.update(songs);
        this.reload();
    },
    addItem: function(id, title, artist) {
        this.do(id, title, artist, "+");
    },
    removeItem: function(id, title, artist) {
        this.do(id, title, artist, "-");
    },
    loadList: function() {
        var songs = {};
        this.getItem().forEach(function(item) {
            var song = item.song;
            switch(item.action) {
                case "+":
                    songs[song.id] = song;
                break;
                case "-":
                    if(songs[song.id]) delete songs[song.id];
                break;
            }
        })
        return Object.keys(songs).map(function(k){return songs[k]});
    },
    reload: function(DOM) {
        var songs = this.loadList(); 
        DOM = DOM || $(".playlist ul");
        $('#tools textarea').val(JSON.stringify(songs, null, '\t'));
        DOM.html("");
        songs.forEach(function(song) {
            DOM.append('<li data-id="' + song.id + '">' + song.title + '-' + song.artist + '</li>');
        })
    },
    findItem: function(id) {
        var songs = this.loadList();
        for(var i=0, l=songs.length; i<l; i++) 
            if(songs[i].id === id) return true;
        return false;
    },
    load: function() {
        if(this.loadList().length>0) this.reload();
        else return true;
    }
}

function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
        );
    obj.dispatchEvent(ev);
}

function export_raw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;

    var export_blob = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fake_click(save_link);
}

function DropboxSync(APP_KEY) {
    var APP_KEY = APP_KEY || '5my22218prhex99';
    function requestAccessToken(APP_KEY, DIRECT_URI) {
        DIRECT_URI = DIRECT_URI || "//imnerd.org/lab/player/index.html";
        var anchor = document.createElement("a");
        var url = "https://www.dropbox.com/1/oauth2/authorize?client_id=<app key>&response_type=token&redirect_uri=<redirect URI>&state=<CSRF token>";
        anchor.href = url.replace("<app key>", APP_KEY).replace("<redirect URI>", DIRECT_URI);
        //anchor.setAttribute("target", "_blank");
        anchor.setAttribute("id", "dropboxSync");
        document.body.appendChild(anchor);
        document.querySelector("#dropboxSync").click();
    }
    function getAccessToken() {
        var h = {};
        location.hash.substr(1).split("&").forEach(function(item){
            var o = item.split("=");
            h[o[0]] = o[1];
        })
        var access_token = h.access_token;
        if(access_token == "") return false;
        return access_token;
    }
    function file_get_contents(url, SuccessCallback, FailCallback) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) SuccessCallback(xmlhttp.responseText);
                else FailCallback(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }
    function file_put_contents(data, url, SuccessCallback, FailCallback) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) SuccessCallback(xmlhttp.responseText);
                else FailCallback();
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/octet-stream");
        xmlhttp.send(data);
    }   
    var callback = {
        get: {
            success: function(text) {
                var songs = {};
                JSON.parse(text).concat( JSON.parse(localStorage[playlist.key] || "[]")).forEach(function(item) {
                    songs[JSON.stringify(item)] = item;
                });
                songs = Object.keys(songs).map(function(created){return songs[created]});
                return localStorage[playlist.key] = JSON.stringify(songs);
            },
            fail: function(text) {
                // if(text.indexOf("NOT FOUND")) return true;
                // if(text.indexOf('error')) {
                //     console.log(JSON.parse(text).error);
                //     return false;
                // }
                file_put_contents(localStorage.song, API.put, callback.put.success, callback.put.fail);
            }
        },
        put: {
            success: function() {
                alert('同步成功');
                location.hash = "";
                location.reload();
            },
            fail: function() {
                alert('同步失败请稍后尝试');
            }
        }
    } 

    if(!~location.hash.indexOf("access_token=")) return requestAccessToken(APP_KEY);
    var access_token = getAccessToken();
    var API = {
        get: "https://api-content.dropbox.com/1/files/auto/songs.json?access_token="+access_token,
        put: "https://api-content.dropbox.com/1/files_put/auto/songs.json?overwrite=true&access_token="+access_token
    };
    file_get_contents(API.get, function(text) {
        var songs = callback.get.success(text);
        file_put_contents(songs, API.put, callback.put.success, callback.put.fail);
    }, callback.get.fail);
}

















        