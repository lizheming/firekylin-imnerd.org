<?php
//废弃脚本封存
function getCookie($content) {
    list($header, $body) = explode("\r\n\r\n", $content);
    preg_match_all("/set\-cookie:([^\r\n]*)/is", $header, $matches);  
    $cookie_str = join('; ',$matches[1]);
    return $cookie_str;
}

function sign($username, $password) {
    $curl_post = http_build_query(array( 
        "email"=>$username,
        "password"=>$password,
        "remember"=>1,
        "LoginButton"=>"登录"
    ));
    $curl = curl_init('https://login.xiami.com/web/login');
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Host:login.xiami.com', 'Origin:http://www.xiami.com', 'Referer:http://www.xiami.com/web/login'));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post);
    $res = curl_exec($curl);
    curl_close($curl);
    $cookie_str = getCookie($res);
    //获取手机版首页   
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, "http://www.xiami.com/web");
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_COOKIE, $cookie_str);
    $data = curl_exec($curl);
    curl_close($curl);

    $cookie_str .= ";".getCookie($data); 
    //获取签到URL,如果已经签到则获取签到天数
    $preg = '/\<a class\=\"check\_in\" href\=\"(.*?)\"\>每日签到\<\/a\>/s';
    preg_match_all($preg, $data, $match);
    if(!isset($match[1][0])) {
        $preg = '/\<div class\=\"idh\"\>已连续签到(\d+)天\<\/div\>/s';
        preg_match_all($preg, $data, $match);
        return isset($match[1][0]) ? $match[1][0] : $data;
    }

    //自动签到
    $url = 'http://www.xiami.com' . $match[1][0];
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_COOKIE, $cookie_str);
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_REFERER, 'http://www.xiami.com/web');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $day = curl_exec($curl);
    curl_close($curl);
    return $day;
}

$accounts = array(
    array(
        "username" => "虾米账号",
        "password" => "虾米密码"
    )
);
foreach($accounts as $usr) {
    echo $usr['username'],":",sign($usr['username'], $usr['password']),"\r\n";
}