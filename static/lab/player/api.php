 <?php
function u($t) {
	$l = substr($t,0,1); //第一个字符意为排几行
	$t = substr($t, 1);	//剩下的字符就是地址了
	$tn = strlen($t);	//计算总字数
	$ln = $tn / $l;	//计算平均每行要放多少字符
	$r = $tn % $l;	//计算多余字符
	$res = array();
	for($i=0;$i<$l;$i++) { 
		if($i<$r) $e = $ln+1;
		else $e = $ln;
		$m = substr($t, 0, $e);
		$res[] = str_split($m);
		$t = substr($t, $e);
	}
	$text = '';
	for($i=0;$i<$ln;$i++) {
		for($j=0;$j<$l;$j++) {
			if(isset($res[$j][$i])) $text .= $res[$j][$i];
			else break;
		}
	}
	return str_replace('^', 0, urldecode($text));
}
function ua($t) {
	$l = substr($t,0,1);
	$t = substr($t, 1);
	$tn = strlen($t);
	$ln = floor($tn/$l);
	$r = $tn % $l;
	$tex = str_split($t);
	$text = '';
	for($i=0;$i<=$ln;$i++) {
		for($j=0;$j<$l;$j++) {
			$n = $j*$ln+$i;
			if($j<$r) $n += $j;
			else $n += $r;
			if(isset($tex[$n])) $text .= $tex[$n];
			else break;
		}
	}
	$preg = array('^', '%');
	$replace = array(0, '|');
	return str_replace($preg, $replace, urldecode(substr($text, 0, $tn)));
}
function callback($text) {
	if(isset($_GET['callback'])) {
		return $_GET['callback'] . '(' . $text . ')';
	} else {
		return $text;
	}
}
if(!isset($_GET['id'])) die('lack of the id parameter');
$xml = simplexml_load_file('http://www.xiami.com/song/playlist/id/'.$_GET['id']);
$track = $xml->trackList->track;
$song = array('id' => (string) $track->song_id,
			  'title' => (string) $track->title,
			  'artist' => (string) $track->artist,
			  'location' => (string) ua($track->location),
			  'lyric' => (string) $track->lyric,
			  'pic' => (string) substr($track->pic,0, -5).'4.jpg'
			  );
echo callback(json_encode($song));
?>