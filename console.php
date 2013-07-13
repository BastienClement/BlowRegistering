<?php require "core.php"; ?>
<?php blow_header(); ?>

<?php if(is_blow_officier()): ?>
	<div class="console-wrapper">
<?php else: ?>
	<div style="height: 450px;">
<?php endif; ?>

<?php if(!is_blow_officier()): ?>
	<div id="calendarError" class="modal">
		<div id="calendarErrorMessage" class="message">
			<div class="title">Accès non autorisé</div>
			<span>L'accès à la console est réservé aux officiers de la guilde Blow.<br>
			Si vous êtes un officier Blow, veuillez vous connecter sur le forum.</span>
		</div>
	</div>
<?php else: ?>
	<div id="console-screen"><span id="console"></span><span id="caret"> </span></div>
	<script type="text/javascript">
		var $bt_shell = {
			user: "<?= addslashes($user->data["username"]); ?>"
		};
	</script>
	<script type="text/javascript" src="static/console.js"></script>
<?php endif; ?>

</div>
</div><!-- #container -->
<?php blow_footer(); ?>
