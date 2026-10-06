<?php
	if(!isset($_GET['start'])) die();
		
	include_once 'config.php';
	include_once 'class.mysql.php';
	function ajson_encode($t) {
		return isset($_GET['callback']) ? $_GET['callback'].'('.json_encode($t).')' : json_encode($t);
	}
	function cmp($a, $b) {
	    if ($a['time'] == $b['time']) {
	        return 0;
	    }
	    return ($a['time'] < $b['time']) ? 1 : -1;
	}

	$db = new mysql();
	$sql = "SELECT * FROM `talk` WHERE `time` >" . $_GET['start'];
	$res = $db->query($sql);
	$res = $db->fetch_all($res);
	if(count($res) != 0) {
		usort($res, "cmp");
		$t = array('time'=>$res[0]['time'], 'status'=>$res);
	} else {
		$t = array('time'=>0, 'status'=>'');
	}
	echo ajson_encode($t);
?>
