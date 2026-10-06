<?php
$file = "user.txt";
function output() {
	global $file;
	return json_decode(file_get_contents($file), true);
}
function input($text) {
	global $file;
	return file_put_contents($file, json_encode($text));
}
function get($url) {
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($curl);
	curl_close($curl);
	return json_decode($result, true);
}
function post($url, $data) {
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	$result = curl_exec($curl);
	curl_close($curl);
	return json_decode($result, true);
}

define("DEBUG", false);
define("TOKEN", "pagecookery");

require_once(dirname(__FILE__) . "/wechat.php");

$w = new Wechat(TOKEN, DEBUG);
$w->reply("reply_cb");
exit();

function reply_cb($request, $w) {
	$user = output();
	$wcuser = $request['FromUserName'];
	switch($w->get_msg_type()) {
		case 'location':
			$latx = $request['Location_X'];
			$laty = $request['Location_Y'];
			$attitude = $request['Label'];
			$content = "我在这里：($latx,$laty) $attitude";
			$data = array('usr' => $user[$wcuser]['usr'],'auth' => $user[$wcuser]['auth'],'content' => $content);
			$res = post($user[$wcuser]['url'].'/wechat.php?do=post', $data);
			return $res['message'];
		break;
		
		case 'image':
			$PicUrl = $request['PicUrl'];
			$res = get('http://iphoto.sinaapp.com/index.php?photo='.$PicUrl);
			if($res['code']) $PicUrl = $res['url'];
			$content = "<img src=\"$PicUrl\" style=\"width:50%;height:50%;\" />";
			$data = array('usr' => $user[$wcuser]['usr'],'auth' => $user[$wcuser]['auth'],'content' => $content);
			$res = post($user[$wcuser]['url'].'/wechat.php?do=post', $data);
			return $res['message'];
		break;
		
		case 'text':
			$content = trim($request['Content']);
			if ($content === "Hello2BizUser") return "欢迎使用PageCookery机器人，首先你需要绑定你的网站和账号，请输入\"-url 网站地址\"进行绑定";
			$code = substr($content, 0, 4);
			if($code === '-url') {
				$url = substr($content, 5);
				$res = get($url.'/wechat.php');
				if($res['code']) {
					$user[$wcuser]['url'] = $url;
					input($user);
					$url .= '/wechat.php?do=signature';
					return $res['message'].'请跳转到'.$url.'页面获取识别码（微信无法复制，推荐复制地址到浏览器中访问）';
				} else {
					return '请确定你使用的是PageCookery程序，并上传wechat.php到网站根目录！';
				}
			} else if ($code === '-sig') {
				$id = substr($content, 5, 1);
				$signature = substr($content, 6);
				$url = $user[$wcuser]['url'].'/wechat.php?do=auth';
				$data = array('usr'=> $id, 'auth'=>$signature);
				$res = post($url, $data);
				if($res['code']) {
					$user[$wcuser]['usr'] = $id;
					$user[$wcuser]['auth'] = $signature;
					input($user);
				} 
				return $res['message'];
			} else if ($code === '-des') {
				$data = array('usr'=> $user[$wcuser]['usr'], 'auth' => $user[$wcuser]['auth'], 'content'=> $content);
				$res = post($user[$wcuser]['url'].'/wechat.php?do=tex2img', $data);
			} else {
				$data = array('usr' => $user[$wcuser]['usr'],'auth' => $user[$wcuser]['auth'],'content' => $content);
				$res = post($user[$wcuser]['url'].'/wechat.php?do=post', $data);
				return $res['message'];
			}
		break;
		
		default:
			return '你输的东西机器人暂时还无法识别哦';
		break;	
	}
}
