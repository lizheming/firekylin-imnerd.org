<?php
//echo "hello world";
header("Access-Control-Allow-Origin: ".$_SERVER['HTTP_ORIGIN']);
if($_GET['format'] == 'json') { header("content-type: application/json");}
echo file_get_contents($_GET['url']);
