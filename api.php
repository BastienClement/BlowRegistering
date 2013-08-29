<?php

define("PHPBB_QUIET_VISIT", true);
require "core.php";

$u = $user->data["user_id"];

$call = $_POST["c"];
$args = $_POST["ca"];

$d = $_POST["d"];
$a = $_POST["a"];

// Return object
$return = [];

function set_error($error, $fatal = false) {
	global $return;
	if($fatal) {
		exit(json_encode(["error" => $error, "fatal" => true]));
	}
	$return["error"] = $error;
}

function set_redirect($display, $arg = null) {
	global $return, $d, $a;
	$return["redirect"] = [
		"display" => ($d = $display),
		"arg" => ($a = $arg)
	];
}

// Ensure the user is allowed to access the registering
if(!is_blow_raider()):
	set_error("Votre session forum a expiré, veuillez vous reconnecter.", true);
endif;

// --- Casts -------------------------------------------------------------------

function cast_int(&$val, $default = null) {
	return $val = is_null($val) ? $default : (int) $val;
}

function cast_bool(&$val, $default = null) {
	return $val = is_null($val) ? $default : (bool) $val;
}

function cast_cid(&$val, $default = null) {
	return $val = preg_replace("/[^0-9]/", "", $val);
}

function cast_event(&$row) {
	cast_int($row["id"]);
	cast_int($row["type"]);
	cast_int($row["owner"]);
	cast_int($row["state"]);
	
	if(isset($row["answer"])):
		cast_int($row["answer"]);
	endif;
	
	preg_match("/ (\d{2}:\d{2})/", $row["date"], $matches);
	$row["hour"] = $matches[1];
	
	return $row;
}

function cast_character(&$row) {
	cast_cid($row["id"]);
	cast_int($row["owner"]);
	cast_bool($row["main"]);
	cast_bool($row["active"]);
	cast_int($row["class"]);
	cast_int($row["race"]);
	cast_int($row["gender"]);
	cast_int($row["level"]);
	cast_int($row["achievements"]);
	cast_int($row["ilvl"]);
	cast_bool($row["is_blow"]);
	cast_int($row["last_update"]);
	cast_int($row["last_full_update"]);
	cast_bool($row["update_pending"]);
	
	if($row["thumbnail"]):
		$tRace = is_null($row["race"]) ? 0 : $row["race"];
		$tGender = is_null($row["gender"]) ? 0 : $row["gender"];
		$row["thumbnail"] = "http://eu.battle.net/static-render/eu/{$row['thumbnail']}?alt=/wow/static/images/2d/avatar/$tRace-$tGender.jpg";
	else:
		$row["thumbnail"] = "http://eu.battle.net//wow/static/images/2d/avatar/0-0.jpg";
	endif;
	
	return $row;
}

function cast_event_answer(&$row) {
	cast_int($row["answer"], 0);
	cast_int($row["class"]);
	cast_int($row["group_id"]);
	cast_bool($row["is_blow"]);
	
	return $row;
}

function cast_event_raidcomp(&$row) {
	unset($row["slot"]);
	cast_int($row["class"]);
	cast_bool($row["is_blow"]);
	
	return $row;
}

// --- Fetch the entire user roster and correct bad main flags -----------------

function refresh_chars() {
	global $db, $u, $chars, $main, $has_chars, $has_main;
	
	$chars = [];
	$has_chars = false;
	$has_main = 0;
	
	$db->_sql_transaction("begin");
	
	$db->sql_query("SELECT c.*, cl.name AS class_name, r.name AS race_name FROM bt_chars AS c LEFT JOIN bt_classes AS cl ON cl.id = c.class LEFT JOIN bt_races AS r ON r.id = c.race WHERE owner = $u ORDER BY main DESC, active DESC, name ASC");
	while($row = $db->sql_fetchrow()):
		$has_chars = true;
		$char = cast_character($row);
		if($char["main"]):
			$main_list .= $char["name"];
			$main = $char;
			$has_main++;
		endif;
		$chars[] = $char;
	endwhile;
	
	if($has_main > 1):
		$db->sql_query("UPDATE bt_chars SET main = 0 WHERE owner = $u");
		$has_main = 0;
	endif;
	
	if($has_chars && $has_main < 1):
		$db->sql_query("UPDATE bt_chars SET main = 1 WHERE owner = $u ORDER BY main DESC, name ASC LIMIT 1");
		$db->_sql_transaction("commit");
		refresh_chars();
	else:
		$db->_sql_transaction("commit");
	endif;
}

// Check if the user has chars before doing anything else.
function require_chars() {
	global $has_chars;
	if(!$has_chars):
		set_error("Vous ne pouvez pas effectuer cette action sans personnage associé à votre compte. Actualisez la page et associez un personnage à votre compte pour continuer.", true);
	endif;
}

refresh_chars();

// --- Call --------------------------------------------------------------------

switch($call):
	case "announce":
		if(!is_blow_officier()):
			set_error("Vous n'avez pas l'autorisation de publier des annonces.");
			break;
		endif;
		
		$text = $db->sql_escape(trim($args));
		$now = time();
		
		if(!$text):
			set_error("Annonce invalide.");
			break;
		endif;
		
		$db->sql_query("INSERT INTO `phpbb_mchat` (`user_id`, `user_ip`, `message`, `message_time`) VALUES (144, '127.0.0.1', '$text', $now)");
		break;
	
	case "associate-blow":
		$id = cast_cid($args);
		
		$db->sql_query("SELECT main FROM bt_chars WHERE owner = $u AND main = 1 LIMIT 1");
		$main = ($db->sql_affectedrows() > 0) ? 0 : 1;
		
		$db->sql_query("UPDATE bt_chars SET owner = $u, main = $main, active = 1 WHERE id = $id AND is_blow = 1 LIMIT 1");
		if($db->sql_affectedrows() < 1):
			set_error("Ce personnage n'est plus disponible.");
			break;
		endif;
		
		refresh_chars();
		set_redirect("characters");
		break;
	
	case "dissociate":
		$id = cast_cid($args);
		
		$db->sql_query("UPDATE bt_chars SET owner = NULL, active = 0 WHERE id = $id AND owner = $u AND main = 0 AND active = 0 LIMIT 1");
		if($db->sql_affectedrows() < 1):
			set_error("Vous ne pouvez pas dissocier ce personnage.");
			break;
		endif;
		
		refresh_chars();
		break;
	
	case "set-role":
		$role = $args["role"];
		if(!in_array($role, ["HEALING", "TANK", "DPS"])):
			set_error("Rôle invalide.");
			break;
		endif;
		$args = $args["char"];
	
	case "set-main":
	case "set-active":
	case "set-inactive":
		$id = cast_cid($args);
		
		switch($call):
			case "set-main":
				$db->_sql_transaction("begin");
				
				$db->sql_query("UPDATE bt_chars SET main = 1, active = 1 WHERE id = $id AND owner = $u LIMIT 1");
				if($db->sql_affectedrows() < 1):
					set_error("Ce personnage n'est pas associé à votre utilisateur.");
					$db->_sql_transaction("rollback");
					break 2;
				endif;
				
				$db->sql_query("UPDATE bt_chars SET main = 0 WHERE id != $id AND owner = $u");
				$db->_sql_transaction("commit");
				break;
			
			case "set-role":
				$db->sql_query("SELECT s.role FROM bt_specs AS s, bt_chars AS c WHERE id = $id AND s.role = '$role' AND c.class = s.class LIMIT 1");
				if($db->sql_affectedrows() < 1):
					set_error("Ce personnage ne peut pas exercer ce rôle.");
					break;
				endif;
				
				$db->sql_query("UPDATE bt_chars SET role = '$role' WHERE id = $id AND owner = $u LIMIT 1");
				break;
			
			case "set-active":
			case "set-inactive":
				switch($call):
					case "set-active":
						$db->sql_query("UPDATE bt_chars SET active = 1 WHERE id = $id AND owner = $u LIMIT 1");
						break;
						
					case "set-inactive":
						$db->sql_query("UPDATE bt_chars SET active = 0 WHERE id = $id AND owner = $u LIMIT 1");
						break;
				endswitch;
				
				if($db->sql_affectedrows() < 1):
					set_error("Ce personnage n'est pas associé à votre utilisateur.");
					break 2;
				endif;
				break;
		endswitch;
		
		refresh_chars();
		break;
		
	case "update-char":
		set_error("La fonction d'actualisation n'est pas encore disponible.");
		break;
		
	case "register":
		require_chars();
		$id = (int) $args["id"];
		
		$db->sql_query("SELECT id FROM bt_events WHERE id = $id AND type = 1 AND date >= NOW() AND state = 0 LIMIT 1");
		if($db->sql_affectedrows() < 1):
			set_error("Cet événement est passé et il n'est plus possible de s'y enregistrer.");
			break;
		endif;
		
		$fields = "event, user, time";
		$values = "$id, $u, NOW()";
		$update = "time = NOW()";
		
		if(isset($args["answer"])):
			$answer = (int) $args["answer"];
			if($answer < 1 || $answer > 2):
				set_error("Présence non valide.");
				break;
			endif;
			
			$fields .= ", answer";
			$values .= ", '$answer'";
			$update .= ", answer = '$answer'";
		endif;
		
		if(isset($args["note"])):
			$note = $db->sql_escape(trim($args["note"]));
			
			$fields .= ", note";
			$values .= ", '$note'";
			$update .= ", note = '$note'";
		endif;
		
		if($answer == 2 && $note == ""):
			set_error("Vous devez fournir une raison pour vous enregistrer comme indisponible.");
			break;
		endif;
		
		$db->sql_query("INSERT INTO bt_answers ($fields) VALUES ($values) ON DUPLICATE KEY UPDATE $update");
		break;
		
	case "accept-all":
		require_chars();
		$db->sql_query("INSERT INTO bt_answers (event, user, answer, time) SELECT id AS event, $u AS user, 1 AS answer, NOW() AS time FROM bt_events AS e LEFT JOIN bt_answers AS a ON a.user = $u AND a.event = e.id WHERE e.type = 1 AND e.date >= NOW() AND state = 0 AND a.answer IS NULL");
		break;
	
	case "set-raidcomp":
	case "set-raidcomp-role":
	case "swap-raidcomp":
	case "unset-raidcomp":
	case "empty-raidcomp":
	case "set-event-state":
	case "set-event-editing":
		$eventid = (int) $args["event"];
		$db->sql_query("SELECT owner, state FROM bt_events WHERE id = $eventid LIMIT 1");
		$event = $db->sql_fetchrow();
		
		if(!$event || !is_user_authorized($event["owner"])):
			set_error("Vous n'êtes pas autorisé à effectuer cette action.");
			break;
		endif;
		
		switch($call):
			case "set-raidcomp":
			case "unset-raidcomp":
			case "set-raidcomp-role":		
			case "swap-raidcomp":
			case "empty-raidcomp":
				$slot = (int) $args["slot"];
				if($slot < 1 || $slot > 40):
					set_error("Slot de raid-comp non valide.");
					break;
				endif;
				
				$comp = (int) $args["comp"];
				if($comp < 0 || $comp > 3):
					set_error("Raid-comp non valide.");
					break;
				endif;
				
				switch($call):
					case "swap-raidcomp":
						$slot2 = (int) $args["slot2"];
						if($slot2 < 1 || $slot2 > 40):
							set_error("Slot de raid-comp non valide.");
							break;
						endif;
						
						$db->_sql_transaction("begin");
						$db->sql_query("UPDATE bt_raidcomps SET `slot` = -1     WHERE `event` = $eventid AND `comp` = $comp AND `slot` = $slot2 LIMIT 1");
						$db->sql_query("UPDATE bt_raidcomps SET `slot` = $slot2 WHERE `event` = $eventid AND `comp` = $comp AND `slot` = $slot  LIMIT 1");
						$db->sql_query("UPDATE bt_raidcomps SET `slot` = $slot  WHERE `event` = $eventid AND `comp` = $comp AND `slot` = -1     LIMIT 1");
						$db->_sql_transaction("commit");
						break;
					
					case "set-raidcomp":
						$char = cast_cid($args["char"]);
						
						$role = $args["role"];
						if(!in_array($role, ["HEALING", "TANK", "DPS", "NULL"])):
							$role = "NULL";
						else:
							$role = "'$role'";
						endif;
						
						$db->_sql_transaction("begin");
						$db->sql_query("DELETE FROM bt_raidcomps WHERE `event` = $eventid AND `comp` = $comp AND `char` IN (SELECT `id` as `char` FROM bt_chars WHERE `owner` = (SELECT `owner` FROM bt_chars WHERE `id` = $char LIMIT 1)) LIMIT 1");
						$db->sql_query("INSERT INTO bt_raidcomps (`event`, `comp`, `slot`, `char`, `forced_role`) VALUES ($eventid, $comp, $slot, $char, $role) ON DUPLICATE KEY UPDATE `char` = VALUES(`char`), forced_role = $role");
						$db->_sql_transaction("commit");
						break;
					
					case "set-raidcomp-role":
						$role = $args["role"];
						if(!in_array($role, ["HEALING", "TANK", "DPS", "NULL"])):
							set_error("Rôle invalide.");
							break;
						endif;
						
						if($role != "NULL"):
							$role = "'$role'";
						endif;
						
						$db->sql_query("UPDATE bt_raidcomps SET forced_role = $role WHERE `event` = $eventid AND `comp` = $comp AND `slot` = $slot LIMIT 1");
						break;
					
					case "unset-raidcomp":
						$db->sql_query("DELETE FROM bt_raidcomps WHERE `event` = $eventid AND `comp` = $comp AND `slot` = $slot LIMIT 1");
						break;
					
					
					case "empty-raidcomp":
						$db->sql_query("DELETE FROM bt_raidcomps WHERE `event` = $eventid AND `comp` = $comp LIMIT 40");
						break;
				endswitch;
				break;
			
			case "set-event-state":
				$state = (int) $args["state"];
				if($state < 0 || $state > 2):
					set_error("État d'événement non valide.");
					break;
				endif;
				$db->sql_query("UPDATE bt_events SET state = $state WHERE id = $eventid LIMIT 1");
				break;
			
			case "set-event-editing":
				$editing = $db->sql_escape($args["editing"]);
				if(isset($args["text"])):
					$text = $db->sql_escape(trim($args["text"]));
				endif;
				$force = $args["force"] == "true";
				
				if(empty($editing)):
					$text = empty($text) ? "NULL" : "'$text'";
					$db->sql_query("UPDATE bt_events SET editing = NULL, event_note = $text WHERE id = $eventid LIMIT 1");
				else:
					$db->_sql_transaction("begin");
					$db->sql_query("SELECT id FROM bt_events WHERE id = $eventid AND editing IS NULL LIMIT 1");
					if($db->sql_affectedrows() < 1):
						if(!$force):
							set_error("Cette note est déjà en cours d'édition et ne peux pas être éditée pour le moment.");
							break;
						endif;
					endif;
					$db->sql_query("UPDATE bt_events SET editing = '$editing' WHERE id = $eventid LIMIT 1");
					$db->_sql_transaction("commit");
				endif;
		endswitch;
		break;
endswitch;

// --- Fetch -------------------------------------------------------------------

// Event
if($d == "event"):
	$id = (int) $a;
	
	$db->sql_query("SELECT e.id, e.title, e.type, e.desc, e.date, e.owner, e.event_note, e.state, e.editing, a.answer, a.time, a.note, u.username AS owner_name FROM bt_events AS e LEFT JOIN bt_answers AS a ON a.event = e.id AND a.user = $u LEFT JOIN phpbb_users AS u ON u.user_id = e.owner WHERE e.id = $id LIMIT 1");
	if(!$event = $db->sql_fetchrow()):
		set_error("L'événement sélectionné n'existe plus.");
		set_redirect("calendar");
	else:	
		$event["editable"] = is_user_authorized($event["owner"]);
		
		if(!$event["editable"] && !$event["state"]):
			$event["event_note"] = null;
		endif;
		
		$event["answers"] = [];
		$db->sql_query("SELECT u.group_id, a.answer, a.time, a.note, c.id, c.name, c.server, c.class, c.role, c.owner FROM phpbb_users AS u LEFT JOIN bt_answers AS a ON user_id = user AND event = $id JOIN bt_chars AS c ON c.owner = user_id AND main = 1 WHERE group_id IN (8, 9, 10, 11) ORDER BY c.class ASC, c.name ASC");
		while($row = $db->sql_fetchrow()):
			$event["answers"][] = cast_event_answer($row);
		endwhile;
		
		$event["raidcomp_roster"] = [];
		$event["raidcomp"]        = [];
		$event["rerolls"]         = [];
		
		if($event["state"] || $event["editable"]):
			$db->sql_query("SELECT DISTINCT c.id, c.owner, c.name, c.server, c.class, c.role FROM bt_chars AS c WHERE (c.owner IN (SELECT DISTINCT c.owner FROM bt_chars AS c WHERE id IN (SELECT DISTINCT rc.char FROM bt_raidcomps AS rc WHERE event = $id)) AND active = 1) OR c.id IN (SELECT DISTINCT rc.char FROM bt_raidcomps AS rc WHERE event = $id)");
			while($row = $db->sql_fetchrow()):
				$row["owner"] = (int) $row["owner"];
				if(!isset($event["rerolls"][$row["owner"]])) $event["rerolls"][$row["owner"]] = [];
				$event["raidcomp_roster"][$row["id"]] = cast_event_raidcomp($row);
				$event["rerolls"][$row["owner"]][] = $row["id"];
			endwhile;
			
			$db->sql_query("SELECT rc.comp, rc.slot, rc.forced_role, rc.char FROM bt_raidcomps AS rc WHERE rc.event = $id ORDER BY rc.slot ASC");
			while($row = $db->sql_fetchrow()):
				$row["comp"] = (int) $row["comp"];
				if(!isset($event["raidcomp"][$row["comp"]])) $event["raidcomp"][$row["comp"]] = [];
				$event["raidcomp"][$row["comp"]][$row["slot"]] = ["id" => $row["char"], "role" => $row["forced_role"]];
			endwhile;
		endif;
		
		$return["event"] = cast_event($event);
	endif;
else:
	$return["event"] = new StdClass;
endif;

// Events
//if($d == "calendar"):
	function importNumericVar(&$var, $name, $lower, $upper, $error) {
		if(!isset($_POST[$name]) || !is_numeric($_POST[$name])) set_error($error, true);
		$var = (int) $_POST[$name];
		if($var < $lower || $var > $upper) set_error($error, true);
	}
	
	importNumericVar($m, "m", 0, 11, "Erreur lors de l'importation du mois sélectionné.");
	importNumericVar($y, "y", 1000, 9999, "Erreur lors de l'importation de l'année sélectionnée.");

	$now = mktime(0, 0, 0, $m + 1, 1, $y);
	$lower = date("Y-m-d", $now - 604800);
	$upper = date("Y-m-d", $now + 3888000);

	$return["events"] = [];

	$db->sql_query("SELECT e.id, e.title, e.type, e.desc, e.date, e.owner, e.state, a.answer, a.time, a.note, u.username AS owner_name FROM bt_events AS e LEFT JOIN bt_answers AS a ON a.event = e.id AND a.user = $u LEFT JOIN phpbb_users AS u ON u.user_id = e.owner WHERE e.date > \"$lower\" AND e.date < \"$upper\"");
	while($row = $db->sql_fetchrow()):
		$day_id = explode(" ", $row["date"])[0];
		if(!isset($return["events"][$day_id]))
			$return["events"][$day_id] = [];
		
		$return["events"][$day_id][] = cast_event($row);
	endwhile;
//endif;

// Chars
$return["chars"] = $chars;

// Roster
if($d == "associate"):
	$return["roster"] = [];
	
	$db->sql_query("SELECT id, name, class FROM bt_chars WHERE is_blow = 1 AND owner IS NULL");
	while($row = $db->sql_fetchrow()):
		$row["class"] = (int) $row["class"];
		$return["roster"][] = $row;
	endwhile;
else:
	$return["roster"] = [];
endif;

// Officier flag
$return["officier"] = is_blow_officier();

// Username
$return["username"] = $user->data["username"];

// Echo
$return["display"] = $d;
$return["arg"] = $a;

// Signature tag
$return["tag"] = sha1(json_encode($return));

if($return["tag"] == $_POST["t"]):
	$return = ["tag" => $return["tag"]];
endif;

echo json_encode($return);
