/* File: apercu.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

/*jshint loopfunc:true*/

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $http, $rootScope, _) {

	$scope.data = [];
	$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.stylePlan = '';

	$scope.init = function(idDocuments) {
		// initialiser le nombre d'appel du service
		var callsFinish = 0;
		// console.log("the documents length ==> ");
		// console.log(idDocuments);

		// $rootScope.profilId = '52f25728f374ca2905e56edc';

		$http.post('/chercherTagsParProfil', {
			idProfil: $rootScope.profilId
		})
			.success(function(data) {
			if (data === 'err') {
				console.log('Désolé un problème est survenu lors de l\'enregistrement');
			} else {
				$scope.profiltags = data;
				// console.log('proflies selected ==> ');
				// console.log(data);
			}
		});

		if (idDocuments) {
			for (var i = 0; i < idDocuments.length; i++) {

				// console.log(idDocuments[i]);

				$http.post('/getDocument', {
					idDoc: idDocuments[i]
				}).success(function(data) {
					// incrémenter le nombre d'appel du service de 1
					callsFinish += 1;
					$scope.blocks.push(data);

					if (idDocuments.length === callsFinish) {
						$scope.position = 0;
						// implement show des blocks
						traverse($scope.blocks);
					}
				}).error(function() {
					$scope.msg = 'ko';
				});

			}
		}
	};


	// init slider
	// $rootScope.idDocument = ['52f0991590b28a4902a4a521'];
	$scope.init($rootScope.idDocument);


	function traverse(obj) {
		//for (var key in obj) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				var alreadyExist = _.findWhere($scope.blocksAlternative, {
					_id: obj[key]._id
				});

				if (!alreadyExist) {
					if (obj[key].text !== '') {
						$scope.counterElements += 1;
						var debutStyle = '<p id="' + $scope.counterElements + '">';
						var finStyle = '</p>';

						for (var profiltag in $scope.profiltags) {
							if (obj[key].tag === $scope.profiltags[profiltag].tag) {
								// console.log('in $scope.profiltags[profiltag].tag');
								// console.log($scope.profiltags[profiltag]);

								$scope.plans.push({
									libelle: $scope.profiltags[profiltag].tagName,
									position: $scope.position
								});

								var style = $scope.profiltags[profiltag].texte;
								debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + $scope.counterElements + '" regle-style="" >';
								break;
							}
						}
						obj[key].text = debutStyle + obj[key].text + finStyle;
					}
					$scope.blocksAlternative.push(obj[key]);
					$scope.position = $scope.position + 1;
				}

				if (obj[key].children.length > 0) {
					traverse(obj[key].children);
				}
			}
		}
		//}
	}

	$scope.setActive = function(idx) {
		$scope.blocksAlternative[idx].active = true;
		$scope.showApercu = 'visible';
		$scope.showPlan = 'hidden';
	};


	// Catch detection of key up
	$scope.$on('keydown', function(msg, code) {
		if (code === 37) {
			$scope.$broadcast('prevSlide');
		} else if (code === 39) {
			$scope.$broadcast('nextSlide');
		}
	});

	/*$scope.initPlayerAudio = function() {
		console.log("ng initialised");
		// Initialiser le lecteur audio
		audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
		});
		var players = document.getElementsByClassName("player-audio");
		console.log(players);
		players.load();
	};*/

	$scope.playSong = function(source) {
		var audio = document.getElementById('player');
		audio.setAttribute('src', source);
		audio.load();
		audio.play();

		/*audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
			as.play();
		});*/
	};

	$scope.printDocument = function() {
		window.print();
	};

});