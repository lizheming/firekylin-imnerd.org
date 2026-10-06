<?php
	if(!isset($_POST['text'])) die();
	include_once 'inc/class.mysql.php';
	include_once 'config.php';
	$text = addslashes(htmlspecialchars($_POST['text']));
	$time = time();
	$db = new mysql();  
	$q = $db->query("INSERT INTO `content` VALUES ('', '$text', '$time')");
	if($q) header('location:index.html');
	
?>
