<?php
	if(!isset($_POST['text']) && !isset($_POST['user'])) die();
	
	include_once 'config.php';
	include_once 'class.mysql.php';

	$db = new mysql();
	$user = $_POST['user'];
	$text = addslashes($_POST['text']);
	$time = time();
	
	$sql = "INSERT INTO talk VALUES('', '$user', '$text', '$time')";
	$res = $db->query($sql);
	
?>