<?php
  header('Content-Type:text-html;char-set:UTF-8');
  $title = '怡红画廊';
  $url = 'http://album.imnerd.org/'; //末尾不要/
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title><?php echo $title; ?></title>
		<style type="text/css">
		  body {
		    width:800px;
		    margin:0 auto;	
		  }
		  #gallery {
      }
		  ul {
		  	width:100%;
		    padding:0px;	
		  }
		  ul li{
		    display:inline-table;
		    padding:10px;
		  }
		  #gallery .description {
		    font-size:13px;
		    text-align:center;	
		  }
		  #gallery .description .filecount {
		    display:block;	
		  }
		  #header {
		    margin-bottom:20px;	
		  }
		  #header a, #header a:visited {
		    color:orange;
		    background:paleGoldenrod;
		    text-decoration:none;	
		    padding:5px 10px;
		  }
		  #header a:hover {
		    color:paleGoldenrod;
		    background:orange;	
		  } 
		  #header .title {
		    font-family:microsoft yahei, microsoft jhenghei;	
		  }
		  #header .description {
		    font-size:25px;
		    font-weight:bold;
		    font-style:italic;
		    font-family:Delicious;
		  }
		</style>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
   	<script type="text/javascript" src="http://test.blairmitchelmore.com/jquery.query/jquery.query.js"></script>
   	<script type="text/javascript">
   		var api = 'http://album.imnerd.org/api.php?method=';
    </script>
	</head>
	<body>
		<div id="header">
	    <h2 class="title"><a href="http://imnerd.org/photo.php"><?php echo $title; ?></a></h2>
	    <span class="description"><a href="http://imnerd.org/photo.php"><?php echo $url; ?></a></span>
		</div>
		<!--code here-->
<?php
  if(!isset($_GET['page'])) $_GET['page'] = '';
  switch($_GET['page']) {
  	case 'photos':
  	?>
  	<style type="text/css">
  		 ul#gallery li {padding:5px;}
  		</style>
  	<ul id="gallery"></ul>
  	<ul id="navigation"></ul>
  	<script type="text/javascript">
  	  var page = $.query.get('navi');
  	  if(page == '') page = 1;
  	  var album = $.query.get('album');
  	  var max = 15;
  	  var start = 1 + (page - 1) * max;
  	  $.getJSON(api+'get.photos&name='+album+'&start-index='+start+'&max-results='+max+'&callback=?',function(data){
		    $.each(data, function(i,item) {
		    	$('<li><a href="?page=photo&album='+album+'&photo='+item.name+'"><img src="' + item.thumbnail + '" /></a><li>').appendTo('#gallery');
		    });	
  	  });
		  $.getJSON(api+'get.gallery.filecount&name='+album+'&callback=?', function(data){
		  	 var rest = data%max;
		  	 var pages = (data - rest)/max;
		  	 var pre = page-1;
		  	 var next = page+1;
		  	 if(rest != 0) pages = pages+1;
		  	 if(page > 1) {
		  	   $('<li id="pre"><a href="?page=photos&album='+album+'&navi='+pre+'">上一页</a></li>').appendTo('#navigation');	
		  	 }
		  	 for(i=1;i<=pages;i++) {
		  	   $('<li><a href="?page=photos&album='+album+'&navi=' + i +'">'+i+'</a></li>').appendTo('#navigation');
		  	 }
		  	 var final = max*pages;
		  	 if(page < pages) {
		  	   $('<li id="next"><a href="?page=photos&album='+album+'&navi='+next+'">下一页</a></li></ul>').appendTo('#navigation');	
		  	 }
		  });
  	</script>
  	<?php
  	  break;
  	case 'photo':
  	?>
  	  <div id="photo" style="text-align:center"></div>
  	  <span id="back" style="float:right;"></span>
  	  <div id="pinglunla_here" style="width:600px;margin:0 auto;"></div><a href="http://pinglun.la/" id="logo-pinglunla"></a><script type="text/javascript" src="http://pinglun.la/ad9f200eaea4ca9a7f7bf011735740602fe82102.js" charset="utf-8"></script>
  	  <script type="text/javascript">
				var album = $.query.get('album');
				var photo = $.query.get('photo');
  	    $.getJSON(api + 'get.photo&album='+album +'&photo='+ photo+'&callback=?', function(data) {
		      $('#photo').html('<img src="'+ data.url +'" width="600px"/>');
		      $('\<div id=\"pinglunla_here\" style="width:800px;margin:0 auto;"\>\<\/div\>\<a href\=\"http\:\/\/pinglun\.la\/\" id\=\"logo\-pinglunla\"\>\<\/a\>\<script type\=\"text\/javascript\" src\=\"http:\/\/pinglun.la\/ad9f200eaea4ca9a7f7bf011735740602fe82102.js\" charset\=\"utf-8\"\>\<\/script\>').appendTo('body');
		    });	
		    $('#back').html('<a href="?pages=photos&album='+album+'">返回相册</a>');	
  	  </script>
  	<?php
  	  break;
    default:
      ?>
      <ul id="gallery"></ul>
      <script type="text/javascript">
      	$(function() {
      		$.getJSON(api+'get.gallery.name&callback=?', function(data){
			      $.each(data, function(i,item){
				      $.getJSON(api + 'get.gallery.info&name='+item+'&callback=?', function(data) {
					      if(data.totalFileCount != 0) {
					        $.getJSON(api+'get.photo&album='+item+'&photo='+data.previewimage+'&callback=?', function(preview){
					  	      $('<li><div><a href="?page=photos&album='+item+'"><img src="'+preview.thumbnail+'" /></a></div><div class="description"><div class="title">'+data.name+'</div><div class="filecount">共'+data.totalFileCount+'张</div></div></li>').appendTo('#gallery');
      			      });
      			    }
      		    });
      	    });
      	  });
      	});
      </script>
      <?php
    	break;
  }
  ?>
  <div id="footer" style="text-align:center;margin:114px 0 10px 0;">
  	Powered By Austin.
  </div>
</body>
</html>