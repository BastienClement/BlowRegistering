<?php

define("CALENDAR_ROOT", dirname(__FILE__));

define('ARRAS_FORCE_LAYOUT', "1c-fixed");
require CALENDAR_ROOT."/../www/wp-load.php";

$phpbbForum->foreground();

function is_blow_raider() {
	global $user;
	return in_array($user->data["group_id"], array(10, 9, 8, 11));
}

function is_blow_officier() {
	global $user;
	return $user->data["group_id"] == 8 || 
	       $user->data["user_id"] == 2  || 
	       $user->data["user_id"] == 54;
}

function is_user_authorized($owner) {
	global $user;
	return $user->data["user_id"] == $owner || is_blow_officier();
}

function blow_header() {
	$header_inject = array(
		'<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>',
		'<script type="text/javascript" src="/static/btools.js"></script>',
		'<script type="text/javascript" src="/static/prefixfree.js"></script>',
		'<link rel="stylesheet" type="text/css" href="/static/fontello.css">',
		'<link rel="stylesheet" type="text/css" href="/static/btools.css">'
	);
	
	ob_start();
	get_header();
	$head = ob_get_contents();
	ob_end_clean();
	
	$head = str_replace("<link", "<link data-noprefix='1'", $head);
	
	echo str_replace("</head>", implode("\n", $header_inject)."\n</head>", $head);
}

function blow_footer() {
	/*ob_start();*/
	get_footer();
	/*$foot = ob_get_contents();
	ob_end_clean();
	
	$loader = '<div id="loader"><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>';
	echo str_replace("</body>", $loader."\n</body>", $foot);*/
}