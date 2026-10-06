	<?php
		include_once 'inc/class.mysql.php';
		include_once 'config.php';

		if(!isset($_GET['id'])) die();
		$id = $_GET['id'];
		
		$db = new mysql();
		$query = $db->query("SELECT * FROM content WHERE id=$id");
		$res = $db->fetch_array($query);

		
		$text = htmlspecialchars_decode($res['text']);



		$preg = '@((https?://)?([-\w]+\.[-\w\.]+)+\w(:\d+)?(/([-\w/_\.]*(\?\S+)?)?)*)@';
		preg_match_all($preg, $text, $urls);

		foreach($urls[0] as $url) {
			$ext = pathinfo($url, PATHINFO_EXTENSION);
			//is image?
			if(preg_match('/(jpg|bmp|gif|png)/', $ext) > 0) {
				$text = str_replace($url, '<img src="'.$url.'" alt="" />', $text);
				continue;
			} elseif(preg_match('/(mp3|wma)/', $ext) > 0) {
				//is music?
				$text = str_replace($url, "<a href='$url'>This is a mp3 link!</a>", $text);
				continue;
			}
			//is music?
			$para = parse_url($url);
			if(preg_match('/xiami/', @$para['host'])>0) {
				$id = basename($url);
				$embed = '<embed src="http://www.xiami.com/widget/0_'.$id.'/singlePlayer.swf" type="application/x-shockwave-flash" width="257" height="33" wmode="transparent">';
				$text = str_replace($url, $embed, $text);
				continue;
			}
			if(preg_match('/yinyuetai/', @$para['host'])>0) {
				$id = basename($url);
				$embed = '<embed src="http://player.yinyuetai.com/video/player/'.$id.'/v_0.swf" quality="high" width="480" height="334" align="middle"  allowScriptAccess="sameDomain" allowfullscreen="true" type="application/x-shockwave-flash"></embed>';
				$text = str_replace($url, $embed, $text);
				continue;
				
			}
			$text = str_replace($url, '<a href="'.$url.'" target="_blank">'.$url.'</a>', $text);
		}

		preg_match_all('/\[(.*?)\]/s', $text, $te);
		$ems = json_decode(file_get_contents('em.json'), true);
		foreach($te[1] as $k => $t) {
			$text = str_replace($te[0][$k], '<img src="'.$ems[$t].'" alt="'.$t.'" />', $text);
		}
	?>
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8" />
	<title><?php echo $res['id'],'.txt'; ?></title>
	<style type="text/css">
	html{overflow:auto;zoom:1;}
	body{margin:0;padding:0;}
	pre{font:12px/1.8 'Lucida Console',sans-serif;color:#333;white-space:pre-wrap;word-wrap:break-word;margin:0;}
	a{color:#36C;}
	img{border:0 none;}
	html::-webkit-scrollbar-track-piece{background:#E5E5E5;}
	html::-webkit-scrollbar{width:8px;height:8px;}
	html::-webkit-scrollbar-thumb{height:40px;border:0;background-color:#999;}
	html::-webkit-scrollbar-thumb:hover{background-color:#666;}
	</style>
	</head>
	<body>
	<pre><?php echo $text;?></pre>
	</body>
	</html>