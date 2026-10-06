<?php
	// 豆瓣 V2 接口已废弃
	// 0adedd45e9f8295b209c97d1bde87c11 该 token 也被废弃
	// 封存
	
	set_time_limit(0);
	function get($url) {
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
		$result = curl_exec($curl);
		curl_close($curl);
		return $result;
	}

	function callback($text) {
		if(isset($_GET['callback'])) {
			echo $_GET['callback'] . '(' . $text . ')';
		} else {
			echo $text;
		}
	}

	function parase($item) {
		//电影名称匹配
		preg_match_all('/\<title\>(.*?)\<\/title\>/s', $item, $title_match);
		$title = $title_match[1][1];				
		//电影海报匹配
		preg_match_all('/\<link href\=\"(.*?)\" rel\=\"image\"\/\>/i', $item, $img_match);
		$img = $img_match[1][0];
		//电影主页匹配
		preg_match_all('/\<link href\=\"(.*?)\" rel\=\"alternate\"\/\>/i', $item, $alternate_match);
		$alternate = $alternate_match[1][0];
		//电影国家匹配
		preg_match_all('/\<db\:attribute name\=\"country\"\>(.*?)\<\/db\:attribute\>/s', $item, $country_match);
		$country = $country_match[1];
		//收藏时间匹配
		preg_match_all('/\<updated\>(.*?)\<\/updated\>/s', $item, $update_match);
		$update = $update_match[1][0];
		//电影评分匹配
		preg_match_all('/\<gd\:rating max\=\"5\" min\=\"1\" value\=\"([1-5])\"\/\>/i', $item, $rate_match);
		if(!isset($rate_match[1][0])) {
			$rate = 0;
		} else {
			$rate = $rate_match[1][0];
		}
		$result = array('title' => $title, 'url' => $alternate, 'img' => $img, 'country' => $country, 'update' => $update, 'rate' => $rate);
		return $result;
	}
	
	function is_entry($content) {
		preg_match_all('/\<entry\>(.*?)\<\/entry\>/s', $content, $entry);
		if(isset($entry[1][0])) {
			return $entry[1];
		} else {
			return FALSE;
		}
	}
	
	function process($user, $max, $min) {
		global $m;
		$url = 'http://api.douban.com/people/'.$user;
		$url .= '/collection?cat=movie&status=watched&apikey=0adedd45e9f8295b209c97d1bde87c11&updated-max='.$max.'&updated-min='.$min;
		$content = get($url);
		$entries = is_entry($content);
		if($entries === FALSE) return $m;
		foreach($entries as $entry) {
			$m[] = parase($entry);
		}
		$e = end($m);
		$max = $e['update'];
		process($user, $max, $min);
	}
		
	$user = $_GET['user'];
	$max = $_GET['max'];
	$min = $_GET['min'];
	$m = array();	
	process($user, $max, $min);
	echo callback(json_encode($m));
