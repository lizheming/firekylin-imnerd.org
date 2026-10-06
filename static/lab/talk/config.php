<?php
define('db_host','localhost'); //���ݿ������    
define('db_user','root');      //���ݿ��û���    
define('db_pw','该项目已废弃');    //���ݿ�����    
define('db_name','test'); //���ݿ���[��ǰ׺�����ǰ׺]
define('db_prefix', '');  //��ǰ׺
define('secode', '!@#$%^&*((*&^E#*M>R&*U^Y'); //�����룬����������һЩ�ַ����������������Բ��޸�   
define('db_charset','utf8');    //���ݿ����,�������޸�

//define('db_prefix', strpos(db_name, '_') ? substr(db_name, 0, strpos(db_name, '_')+1) : ''); //���ݿ�ǰ׺,�Զ���ȡ�����޸�

//$db = new mysql($db_host='', $dbuser='', $db_pw='', $db_name = 'test222', $pconnect = 0);    
     
/**   
    
$db = new mysql();   
    
$query = $db->query("select * from test order by ID DESC");   
    
//ȡһ����¼   
$res = $db->fetch_row($query);   
    
//ȡ���м�¼   
$res = $db->fetch_all($query);   
    
//����   
$db->query("insert into test values (3,'����222222222','test','fffff')");   
    
    
//mysql_result ֻȡһ��ʱ   
$query = $db->query("select title from test order by ID DESC");   
$rs = $db->result($query,0);   
print_r($rs);   
    
//��ѯ   
$query = $db->query("select * from test order by ID DESC");   
while($rw = $db->fetch_array($query))   
{   
    print_r($rw);   
}   
    
    
**/   
     
     
?>