<?php
header("content-type=text/html; charset=utf-8");
error_reporting(E_ALL ^ E_NOTICE);
//set Maximum execution time
set_time_limit(0);  
function read($file) {
	$file_handle = fopen($file, "r");
	$item = array();
	while (!feof($file_handle)) {
	   $item[] = fgets($file_handle);
	}
	fclose($file_handle);
	return $item;
}
switch($_GET['step']) {
  case '1':
		/*上传文件*/
		if ($_FILES["file"]["type"] == "text/plain") {
		  if ($_FILES["file"]["error"] > 0) {
		    echo "错误: " . $_FILES["file"]["error"] . "<br />";
		  } else {
				move_uploaded_file($_FILES["file"]["tmp_name"],$_FILES["file"]["name"]);
				header('location:?step=2&file=' . $_FILES["file"]["name"]);
		  }
		} else {
		  echo "只可以上传txt格式的文件！";
		}
  break;
  
	case '2':
	  if(!file_exists($_GET['file'])) {
	    echo '文件不存在';	
	  } else {
		  $word = read($_GET['file']);
		  $data = array();
			foreach($word as $item) {
			  $youdao = file_get_contents('http://fanyi.youdao.com/fanyiapi.do?keyfrom=lizheming&key=355263407&type=data&doctype=json&version=1.1&q=' . $item);	
			  $youdao = json_decode($youdao, true);
			  $phonetic = explode(', ', $youdao['basic']['phonetic']);
			  $data[] = array($item, $phonetic[0], $youdao['basic']['explains']);
			}
	?>
	   <style type="text/css">
	     table {
	     	 border-collapse:collapse;
	     }
	     td {
	       border-bottom:1px solid black;	
	     }
	     td#radom {
	       border-left:1px solid black;
               text-align:right;	
	     }
	   </style>
			<table>
				<tbody>
					<?php
					  $old = $data;
					  $shuffle = shuffle($data);
					  for($i=0; $i< count($old);$i++) {
					    echo '<tr>';
					    echo '<td>' . $old[$i][0] . '</td>';
					    echo '<td style="font-family:geogria, century, Arial;">[' . $old[$i][1] . ']</td>';
					    echo '<td>';
					    foreach($old[$i][2] as $each) {
					      echo $each;
					      echo '<br />';
					    }
					    echo '</td>';
					    echo '<td id="radom">' . $data[$i][0] . '</td>';
					    echo '</tr>';
					  }
					?>
				</tbody>
			</table>
	<?php
}
	break;
	default:
?>
<!DOCTYPE HTML>
<html>
<head>
	<title>Mint Blue</title>
	<style tyle="text/css">
		red {color:red;}
	</style>
</head>
<body>
<div id="heder" style="font-size:30px;">Mint Blue<span style="font-size:16px;">-单词本自制程序</span></div>
<div id="copright" style="font-size:13px;"><a href="http://imnerd.org" alt="怡红院落">怡红公子</a>制作 | <a href="mailto:i@imnerd.org">与我联系</a></div>
<div id="description">
	<p>大家平常一定有过将平时见到的陌生单词抄在自己的单词本上的经验吧！现在本网站将带给大家一个不一样的记单词体验！</p>
  <p>如何使用本程序：
  	<ul>
  		<li>1.首先将所有的单词输入到一个txt的文本内(<red>注意:请保持一行一个单词/短语的格式<red>)</li>
  		<li>2.看到下方的上传按钮没？将刚才写好的txt文本上传到网站即可</li>
  		<li>3.最后程序会得到一个单词表页面，将此页面Ctrl+A复制到Word中或者直接另存该网页。</li>
  		<li>4.将得到的Word文档或者是网页拷贝到复印店去打印一份出来吧！</li>
  	</ul>
  </p>
  <p>友情提示：
  	<ul>
  		<li>1.<red>程序运行期间网页可能会一直处在加载中，请一定不要关闭页面！</red>加载时间视您上传的文档大小而定</li>
  		<li>2.程序生成的单词表第四栏是乱序版单词表，方便大家巩固记忆。</li>
  	</ul>
  </p>
</div>
<div id="up" style="border:1px dotted #DDD;padding:10px 5px;">	
<form action="index.php?step=1" method="post" enctype="multipart/form-data">
<label for="file">请上传你已经制作好的txt单词表文档:</label>
<input type="file" name="file" id="file" /> 
<input type="submit" name="submit" value="上传" />
</form>
</div>
</body>
</html>
<?php
	break;
}
?>