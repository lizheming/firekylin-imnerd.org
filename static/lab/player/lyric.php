<?php
function callback($text) {
	if(isset($_GET['callback'])) {
		return $_GET['callback'] . '(' . json_encode($text) . ')';	
	} else {
		return json_encode($text);
	}
}
$url = $_GET['url'];
$format = substr($url, -3);
$lrc = array();
if($format=='lrc') {
	$lyric = file_get_contents($url);
	$preg = '/^(.*?)$/m';
	$count = preg_match_all($preg, $lyric, $match);
	foreach($match[1] as $line) {
		$preg = '/\[(\d{2}:.*?)\]/s';
		preg_match_all($preg, $line, $m); 
		$text = implode('', $m[0]);
		$text = str_replace($text,'',$line);
		foreach($m[1] as $t) {
			$i = explode(':',$t);
			$time = $i[0]*60+$i[1];
			$lrc[] = array($time, $text);	
		}
	}
	sort($lrc);
}elseif($format=='txt') {
	$lyric = file_get_contents($url);
	$preg = '/^(.*)$/m';
	$count = preg_match_all($preg, $lyric, $match);
	for($i=0;$i<$count;$i++) {
		$lrc[] = array('', $match[1][$i]);	
	}
}else {
	$lrc[] = array('', '暂无歌词');
}
echo callback($lrc);