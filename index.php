<?php require "core.php"; ?>
<?php blow_header(); ?>

<?php if(is_blow_raider()): ?>
	<div ng-app="BlowTools" ng-controller="Calendar">
<?php else: ?>
	<div style="height: 450px;">
<?php endif; ?>

<?php if(!is_blow_raider()): ?>
	<div id="calendarError" class="modal">
		<div id="calendarErrorMessage" class="message">
			<div class="title">Accès non autorisé</div>
			<span>L'accès au calendar est réservé aux membres de la guilde Blow.<br>
			Si vous êtes un membre Blow, veuillez vous connecter sur le forum.</span>
		</div>
	</div>
<?php else: ?>
	<div id="calendarError" class="modal" ng-show="error">
		<div id="calendarErrorMessage" class="message">
			<div class="title">Une erreur est survenue</div>
			<span>{{ error }}</span>
			<a class="button icon" ng-click="error = undefined" ng-show="!errorFatal"><i class="icon-check"></i> OK</a>
			<div class="clearfix"></div>
		</div>
	</div>
	<div id="calendarStandby" class="modal" ng-show="standby">
		<div id="calendarStandbyMessage" class="message">
			<div class="title">Déconnexion temporaire</div>
			<span>Il semblerait que vous soyez inactif depuis un moment, vous avez donc été déconnecté temporairement du serveur.</span>
			<a class="button icon" ng-click="exitStandby()"><i class="icon-flash"></i> Reconnexion</a>
			<div class="clearfix"></div>
		</div>
	</div>
	<div id="calendarDeclineModal" class="modal" ng-show="showDeclineModal()">
		<div id="calendarDeclineMessage" class="message">
			<div class="title">Raison de l'indisponibilité</div>
			<span>
				<input type="text" id="declineReasonInput" ng-model="declineReason">
			</span>
			<a class="button icon" ng-click="hideDeclineModal(declineReason); declineReason = ''"><i class="icon-floppy"></i> Enregistrer</a>
			<a class="button icon" ng-click="hideDeclineModal()"><i class="icon-cancel"></i> Annuler</a>
			<div class="clearfix"></div>
		</div>
	</div>
<?php endif; ?>

<?php if(is_blow_raider()): ?>
	<script type="text/javascript">
		$bt.classRoles = {};
<?php
	$db->sql_query("SELECT DISTINCT class, role FROM bt_specs ORDER BY role ASC");
	while($row = $db->sql_fetchrow()):
		$c = (int) $row["class"];
		$r = $row["role"];
?>
		($bt.classRoles[<?= $c ?>] = $bt.classRoles[<?= $c ?>] || []).push("<?= $r ?>");
<?php endwhile; ?>
	</script>
	<div id="content" class="section">
	<div id="raids" class="ng-cloak">

	<div id="calendarWrapper">

	<div id="calendarHeader">
		<div id="globalActionsLeft">
			<div class="slidable" ng-class="{ slided: display != 'calendar' }">
				<a ng-click="error = 'Le module d\'absences n\'est pas encore disponible.'"><i class="icon-eye"></i> Voir les absences</a>
				<a ng-show="$bt.officier" href="/console"><i class="icon-monitor"></i> Console</a>
			</div>
			<div class="slidable" ng-class="{ slided: display != 'associate' }">
				<a ng-click="setDisplay('characters');"><i class="icon-left"></i> Retour</a>
			</div>
			<div class="slidable" ng-class="{ slided: display != 'event' }">
				<a class="context" ng-show="$bt.officier"><i class="icon-megaphone"></i> Annoncer <i class="icon-down-open"></i>
					<ul>
						<li class="text">
							Les annonces sont des textes pré-définis publiés automatiquement dans la shoutbox du forum.<br>
							Les éléments marqués d'une * ferment automatiquement l'événement.
						</li>
						<li ng-click="announce('event-new')">
							<i class="icon-list-add"></i> Annoncer de nouveaux événements
							<div class="text">{{ announce('event-new', true) }}</div>
						</li>
						<li ng-click="announce('event-registering')">
							<i class="icon-hourglass"></i> Annoncer les oublis de registering
							<div class="text">{{ announce('event-registering', true) }}</div>
						</li>
						<li ng-click="announce('event-comp-available')">
							<i class="icon-check"></i> Annoncer la composition du raid *
							<div class="text">{{ announce('event-comp-available', true) }}</div>
						</li>
						<li ng-click="announce('event-off')">
							<i class="icon-trash"></i> Annoncer un raid-off *
							<div class="text">{{ announce('event-off', true) }}</div>
						</li>
					</ul>
				</a>
			</div>
		</div>
		
		<div id="calendarNavigator" class="slidable" ng-class="{ slided: display != 'calendar' }">
			<div>
				<a ng-click="monthPrev()">&laquo;</a>
				<span id="month-name">{{ monthNames[month] }}</span>
				<a ng-click="monthNext()">&raquo;</a>
			</div>
			<div class="year">{{ year }}</div>
		</div>
		
		<div id="headerTitle">
			<div class="slidable" ng-class="{ slided: display != 'characters' }">
				<i class="icon-users"></i> Personnages
			</div>
			<div class="slidable" ng-class="{ slided: display != 'associate' }">
				<i class="icon-link"></i> Association
			</div>
			<div class="slidable" ng-class="{ slided: display != 'absences' }">
				<i class="icon-clock"></i> Absences
			</div>
			<div class="slidable" ng-class="{ slided: display != 'editevent' }">
				<i class="icon-pencil"></i> Évenement
			</div>
			<div class="slidable" ng-class="{ slided: display != 'event' }">
				<i ng-class="{ 'icon-flag': getEventType() == 2 }"></i> {{ getEventTitle() }}
			</div>
		</div>
		
		<div id="globalActionsRight">
			<div class="slidable" ng-class="{ slided: display != 'calendar' }">
				<a ng-click="update('accept-all')" title="Accepte automatiquement tous les événements auxquels vous n'avez pas répondu"><i class="icon-check"></i> Tout accepter</a>
				<a ng-click="setDisplay('absences')"><i class="icon-clock"></i> Absences</a>
				<a ng-click="setDisplay('characters')"><i class="icon-users"></i> Personnages</a>
			</div>
			<div class="slidable" ng-class="{ slided: display != 'characters' }">
				<a ng-click="setDisplay('associate')"><i class="icon-link"></i> Associer</a>
			</div>
			<div class="slidable" ng-class="{ slided: display != 'event' }">
				<!--<span ng-show="$bt.event.editable">
					<a ng-click="setDisplay('editevent', getEventID())"><i class="icon-pencil"></i> Editer</a>
					<a ng-click=""><i class="icon-trash"></i> Supprimer</a>
				</span>-->
			</div>
		</div>
	</div>

	<div id="calendarSlider" ng-class="{ slided: display != 'calendar' }">
		<div id="calendarBlock">
			<table id="calendar">
				<tr>	
					<th ng-repeat="day in dayNames">{{ day }}</th>
				</tr>
				<tr ng-repeat="row in getCalendarData()">
					<td ng-repeat="data in row" ng-class="{ today: data.today, inactive: data.inactive }">
						<div class="day-wrapper">
							<div class="day">
								<span>{{ data.day }}</span>
								<!--<div class="actions">
									<a ng-click="setDisplay('editevent', 0)"><i class="icon-plus"></i></a>							
								</div>-->
							</div>
							<div class="events">
								<div class="event" ng-repeat="event in data.events" ng-class="{ accepted: event.answer == 1, declined: event.answer == 2, raid: event.type == 1, note: event.type == 2, locked: event.state == 1, canceled: event.state == 2 }" ng-click="setDisplay('event', event.id, { type: event.type, title: event.title })">
									<a class="name">
										<i ng-class="{ 'icon-flag': event.type == 2 }"></i>
										{{ event.title }}
									</a>
									<div class="hour">{{ event.hour }}</div>
									<div class="actions" ng-show="event.type == 1" ng-switch="event.state">
										<div ng-switch-when="0">
											<a class="accept" ng-click="update('register', { id: event.id, answer: 1 })" eat-click><i class="icon-check"></i></a>
											<a class="decline" ng-click="displayDeclineModal(event.id)" eat-click><i class="icon-cancel"></i></a>
										</div>
										<div ng-switch-when="1">
											<i class="icon-lock" title="Fermé"></i>
										</div>
										<div ng-switch-when="2">
											<i class="icon-block" title="Annulé"></i>
										</div>
									</div>
								</div>
							</div>
						</div>
					</td>
				</tr>
			</table>
			<div id="calendarCover" ng-click="setDisplay('calendar')">
				<div id="calendarCoverText">
					&laquo;
				</div>
			</div>
			<div class="box calendarLegend">
				<table>
					<tr>
						<td>Non register</td>
						<td class="accepted">Accepté</td>
						<td class="declined">Refusé</td>
						<td class="locked accepted">Fermé (Accepté)</td>
						<td class="locked declined">Fermé (Refusé)</td>
						<td class="canceled">Annulé</td>
					</tr>
				</table>
			</div>
		</div>
		<div id="sideBlock" ng-switch="display">
			<div class="panel" ng-switch-when="characters">
				<div class="box with-icon" ng-show="getChars().length < 1">
					<i class="icon-attention"></i>
					Vous n'avez aucun personnage associé à votre utilisateur.<br>
					L'association d'au-moins un personnage est nécessaire avant d'avoir accès aux fonctionnalités de registering.
				</div>
				<div class="character" ng-class="{ inactive: !char.active }" ng-repeat="char in getChars()">
					<img ng-src="{{ char.thumbnail }}" class="thumb">
					<div class="name">
						<i class="icon-star" title="Main" ng-show="char.main"></i>
						<i class="icon-star-empty" title="Actif" ng-show="char.active && !char.main"></i>
						<span class="c{{ char.class }}">{{ char.name }}</span>
						<span class="guild" ng-show="char.guild"><i class="icon-left-open"></i>{{ char.guild }}<i class="icon-right-open"></i></span>
					</div>
					<div class="details">
						<div ng-show="char.class">
							{{ char.class_name }}
							&ndash; {{ char.race_name }}
							&ndash; Niveau {{ char.level }}
							<span ng-show="char-ilvl">
								&ndash; {{ char.ilvl }} ilvl
							</span>
						</div>
						<div ng-show="!char.class">
							Détails non disponibles...
						</div>
					</div>
					<div class="actions">
						<a class="button icon" ng-show="char.active" ng-click="update('update-char', char.id)"><i class="icon-arrows-ccw"></i> Actualiser</a>
						<a class="button icon" ng-show="!char.main && char.active" ng-click="update('set-main', char.id)"><i class="icon-star"></i> Main</a>
						<a class="button icon" ng-show="!char.main && !char.active" ng-click="update('set-active', char.id)"><i class="icon-star-empty"></i> Actif</a>
						<a class="button icon" ng-show="!char.main && char.active" ng-click="update('set-inactive', char.id)"><i class="icon-moon"></i> Inactif</a>
						<a class="button icon" ng-show="!char.main && !char.active" ng-click="update('dissociate', char.id)"><i class="icon-link"></i> Dissocier</a>
					</div>
					<div class="infos" ng-show="char.active">
						<table>
							<tr>
								<th>Rôle principal</th>
								<td><a class="button tab" ng-click="update('set-role', {char: char.id, role: role})" ng-class="{ selected: role == char.role }" ng-repeat="role in getRolesForClass(char.class)">{{ rolesString[role] }}</a></td>
							</tr>
							<tr>
								<th>Dernière actualisation</th>
								<td>Jamais</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="panel"  ng-switch-when="associate">
				<h2>Personnage guildé</h2>
				<div class="roster-browser" ng-controller="RosterBrowser">
					<div class="inner">
						<div class="search">
							<i class="icon-search"></i>
							<input type="text" ng-model="search" />
						</div>
						<div ng-show="$bt.roster.length == 0">
							Chargement en cours...
						</div>
						<div class="char" ng-repeat="char in getRoster()">
							<a class="c{{ char.class }}" ng-click="update('associate-blow', char.id)">{{ char.name }}</a>
						</div>
					</div>
				</div>
				<h2>Personnage externe</h2>
				<div class="box with-icon">
					<i class="icon-traffic-cone"></i>
					Pour le moment, seul les personnages guildés peuvent être associés à un utilisateur.
				</div>
			</div>
			<div class="panel" ng-controller="EventViewer" ng-switch-when="event">
				<div class="event-viewer {{ layout || '' }}" ng-class="{ note: getEventType() == 2 }" onmouseup="return $evScope.dragStop();" onmousemove="$evScope.dragUpdate(event);">
					<div id="dragIndicator" ng-show="dragging_char.name" class="c{{ dragging_char.class }}">
						<img ng-src="/img/{{ dragging_char.role || 'DPS' }}.png">
						{{ dragging_char.name }}
					</div>
					<div class="tabs" ng-show="getEventType() == 1">
						<a class="button right" ng-class="{ selected: layout == 'comp-maker' }" ng-click="toggleLayout('comp-maker')" title="Vue détaillée"><i class="icon-shareable"></i></a>
						<a class="button tab icon" ng-class="{ selected: tab == 1 }" ng-click="tab = 1" title="Disponibles"><i class="icon-check"></i>&nbsp;&nbsp;{{ getAvailableCount() }}&nbsp;</a>
						<a class="button tab icon" ng-class="{ selected: tab == 2 }" ng-click="tab = 2" title="Indisponibles"><i class="icon-block"></i>&nbsp;&nbsp;{{ getUnavailableCount() }}&nbsp;</a>
						<a class="button tab icon" ng-class="{ selected: tab == 0 }" ng-click="tab = 0" title="Non registers"><i class="icon-hourglass"></i>&nbsp;&nbsp;{{ getNonregisterCount() }}&nbsp;</a>
					</div>
					<div class="chars" ng-show="getEventType() == 1">
						<div class="char" ng-repeat="char in getTabChars()" ng-class="{ used: isPlayerUsed(char.owner) }" onmousedown="return $evScope.dragStart('{{ char.id }}', event);">
							<div class="name c{{ char.class }}" title="{{ formatDate(char.time) }}">
								<img ng-src="/img/{{ char.role }}.png">
								{{ char.name }}
							</div>
							<div class="note" ng-show="char.slack" title="{{ char.slack }}">
								<i class="icon-paper-plane"></i>
							</div>
							<div class="note" ng-show="char.note && !char.slack" title="{{ char.note }}">
								<i class="icon-feather"></i>
							</div>
							<div class="noteDetail">{{ char.slack_short || char.note }}</div>
						</div>
						<div class="clearfix"></div>
						<div ng-show="getTabChars().length == 0">
							<span ng-show="data_available">Aucun personnage dans cette section.</span>
							<span ng-show="!data_available">Chargement en cours...</span>
						</div>
						<div class="registering" ng-show="!getEvent().state">
							<div class="status">
								<a class="button tab icon" ng-class="{ selected: answer == 1 }" ng-click="answer = 1"><i class="icon-check"></i> Disponible</a>
								<a class="button tab icon" ng-class="{ selected: answer == 2 }" ng-click="answer = 2"><i class="icon-block"></i> Indisponible</a>
							</div>
							<textarea ng-model="note"></textarea>
							<div>
								<a class="button" ng-click="update('register', { id: id, answer: answer, note: note })"><i class="icon-floppy"></i> Enregistrer</a>
							</div>
						</div>
					</div>
					<div class="raidcomp" ng-show="getEventType() == 1">
						<div class="actions">
							<div class="right" ng-show="getEvent().editable">
								<a class="button" ng-click="emptyComp()" title="Supprimer la compo actuelle"><i class="icon-trash"></i></a>
								<a class="button" ng-click="addComp()" ng-show="canAddComp()"><i class="icon-plus"></i></a>
							</div>
							<a class="button tab" ng-click="setComp(i)" ng-class="{ selected: i == current_comp, self: compHasSelf(i) }" ng-repeat="i in getCompCount()">Raid {{ i + 1 }}</a>
						</div>
						<div class="group group{{ group }}" ng-repeat="group in [1,2,3,4,5,6,7,8]">
							<div class="title">Groupe {{ group }}</div>
							<div class="slot c{{ getCharForSlot(group, slot).class }}" ng-class="{ 'self': getCharForSlot(group, slot).owner == $bt.chars[0].owner }" ng-repeat="slot in [1,2,3,4,5]" data-slotid="{{ computeSlotId(group, slot) }}">
								<div ng-show="getCharForSlot(group, slot) && getCharForSlot(group, slot).id != dragging_char.id" onmousedown="return $evScope.dragStart('{{ getCharForSlot(group, slot).id }}', event, {{ group }}, {{ slot }});">
									<img ng-src="/img/{{ getCharForSlot(group, slot).forced_role || getCharForSlot(group, slot).role || 'DPS' }}.png">
									{{ getCharForSlot(group, slot).name }}
									<div class="warning" ng-show="slotWarning(group, slot)" title="{{ slotWarning(group, slot) }}">
										<i class="icon-attention"></i>
									</div>
									<!--<div class="context-arrow">
										<i class="icon-down-open"></i>
									</div>-->
									<div class="context">
										<div class="context-body" onmousedown="event.stopPropagation(); return false;">
											<div class="role-selector">
												<img src="/img/TANK.png" ng-class="{ selected: getCharForSlot(group, slot).forced_role == 'TANK' }" ng-click="setForcedRole(group, slot, 'TANK')">
												<img src="/img/HEALING.png" ng-class="{ selected: getCharForSlot(group, slot).forced_role == 'HEALING' }" ng-click="setForcedRole(group, slot, 'HEALING')">
												<img src="/img/DPS.png" ng-class="{ selected: getCharForSlot(group, slot).forced_role == 'DPS' }" ng-click="setForcedRole(group, slot, 'DPS')">
											</div>
											<div class="reroll c{{ reroll.class }}" ng-click="update('set-raidcomp', { event: getEvent().id, comp: current_comp, slot: computeSlotId(group, slot), char: reroll.id })" ng-repeat="reroll in getRerolls(group, slot)">
												<img ng-src="/img/{{ reroll.role || 'DPS' }}.png">
												{{ reroll.name }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="raidnote">
						<div class="eventnote" ng-show="getEvent().event_note || getEvent().editable">
							<div ng-show="getEvent().editable">
								<a class="button icon" ng-click="setEventEditing($event.ctrlKey)" ng-show="getEvent().editing != $bt.username"><i class="icon-pencil"></i> Editer la note</a>
								<a class="button icon" ng-click="setEventEditing(null)" ng-show="getEvent().editing == $bt.username"><i class="icon-floppy"></i> Enregistrer</a>
							</div>
							<h2><i class="icon-pencil"></i> Note de l'évenement</h2>
							<div class="box" ng-show="!getEvent().editable || getEvent().editing != $bt.username">
								<em ng-show="getEvent().editing">[ En cours d'édition par <strong>{{ getEvent().editing }}</strong>... ]<br><br></em>
								<div ng-bind-html-unsafe="(getEvent().event_note || '[ Aucune note rédigée ]') | markdown"></div>
							</div>
							<textarea class="box" ng-model="eventNoteText" ng-show="getEvent().editing == $bt.username"></textarea>
						</div>
						<h2><i class="icon-megaphone"></i> Informations de l'événement</h2>
						<div ng-show="!data_available">Chargement en cours...</div>
						<div class="box with-icon" ng-show="getEvent().desc">
							<i class="icon-quote"></i>
							{{ getEvent().desc }}
						</div>
						<table class="infos" ng-show="getEvent().date">
							<tr>
								<th>Date</th>
								<td>{{ formatDate(getEvent().date) }}</td>
								<th>Créateur</th>
								<td>{{ getEvent().owner_name }}</td>
							</tr>
							<tr>
								<th><span ng-show="getEvent().type == 1">Status</span></th>
								<td>
									<div ng-show="getEvent().editable && getEvent().type == 1">
										<a class="button tab" ng-click="setEventState(0)" ng-class="{ selected: !getEvent().state }">Ouvert</a>
										<a class="button tab" ng-click="setEventState(1)" ng-class="{ selected: getEvent().state == 1 }">Fermé</a>
										<a class="button tab" ng-click="setEventState(2)" ng-class="{ selected: getEvent().state == 2 }">Annulé</a>
									</div>
									<div ng-show="!getEvent().editable && getEvent().type == 1">
										<div ng-switch="getEvent().state">
											<span ng-switch-when="2">Annulé</span>
											<span ng-switch-when="1">Fermé</span>
											<span ng-switch-when="0">Ouvert</span>
										</div>
									</div>
								</td>
							</tr>
						</table>
						<div style="width: 75%; margin-left: 75px; font-size: 11px;" ng-show="getEvent().editable && getEvent().type == 1">
							<i class="icon-help-circled"></i> 
							Tant qu'un événement est ouvert, le raid-comp ainsi que la note d'événement
							ne seront pas visible à l'exeption du créateur de l'événement et des officiers.
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
				<table id="stripCalendar">
					<tr>	
						<th ng-repeat="day in getStripDays(getEvent().date)">{{ day.title }}</th>
					</tr>
					<tr>
						<td ng-repeat="day in getStripDays(getEvent().date)" ng-class="{ today: day.today }">
							<div class="day-wrapper">
								<div class="events">
									<div class="event" ng-repeat="event in day.events" ng-class="{ accepted: event.answer == 1, declined: event.answer == 2, raid: event.type == 1, note: event.type == 2, locked: event.state == 1, canceled: event.state == 2, current: event.id == getEvent().id }" ng-click="setDisplay('event', event.id, { type: event.type, title: event.title })">
										<a class="name">
											<i ng-class="{ 'icon-flag': event.type == 2 }"></i>
											{{ event.title }}
										</a>
										<div class="hour">{{ event.hour }}</div>
									</div>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="panel" ng-switch-when="absences">
				<div class="box with-icon">
					<i class="icon-traffic-cone"></i>
					Le module d'absences n'est pas encore disponible.
				</div>
			</div>
			<div class="panel" ng-switch-when="editevent">
				<div class="box with-icon">
					<i class="icon-traffic-cone"></i>
					Le module d'absences n'est pas encore disponible.
				</div>
			</div>
		</div>
		<div style="clear: both;"></div>
	</div>

	<div id="loaderWrapper" ng-show="showLoader">
		<div class="loader">
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
		</div>
	</div>

	</div>

	</div>
	</div><!-- #content -->
<?php endif; ?>

</div>
</div><!-- #container -->
<?php blow_footer(); ?>
