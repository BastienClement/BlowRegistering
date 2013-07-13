<?php

define("PHPBB_QUIET_VISIT", true);
require "core.php";

$u = $user->data["user_id"];

$call = $_POST["c"];
$args = $_POST["ca"];

// Return object
$return = null;

function set_error($error) {
	exit(json_encode(["error" => $error]));
}

if(!is_blow_officier()):
	set_error("Access denied");
endif;

switch($call) {
	case "event":
		break;
	
	case "ping":
		$return = "pong";
		break;

	default:
		set_error("Unknown API call '$call'");
		break;
};

echo json_encode($return);
