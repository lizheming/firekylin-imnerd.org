<?php
$song = array();

if( isset($_GET["id"]) && $_GET["id"]) {
	$curl = curl_init("http://www.xiami.com/app/iphone/song/id/" . $_GET["id"]);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$res=curl_exec($curl);
	curl_close($curl);

	if ($res) {
		$result = json_decode($res,true);
		$song = array(
			"title" => $result["name"],
			"id" => $result["song_id"],
			"location" => $result["location"],
			"artist" => $result["singers"],
			"pic" => $result["album_logo"],
			"lyric" => $result["lyric"]
		);
	}
}
echo isset($_GET["callback"]) ? $_GET["callback"] . '(' . json_encode( $song ) . ')' : json_encode( $song );
?>