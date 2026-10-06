<?php
	header('meta:charset=utf-8');
	include_once 'inc/class.mysql.php';
	include_once 'config.php';
	function ajson_encode($text) {
		return isset($_GET['callback']) ? $_GET['callback'].'('.json_encode($text).')' : json_encode($text);
	}

	$page = 20;
	$p = isset($_GET['p']) ? $_GET['p'] : 1;
	$start = 20*($p-1);
	$end = 20*$p;
	
	$db = new mysql();
	$query = $db->query("SELECT * FROM content ORDER BY id DESC LIMIT $start, $end");
	$res = $db->fetch_all($query);
	foreach($res as $k => $i) {
		$res[$k]['text'] = mb_strimwidth($res[$k]['text'], 0, 200, '<a href="'.$i['id'].'.txt">查看完整内容</a>','UTF-8');
	}
	echo ajson_encode($res);

	
?>
