$(document).ready(function() {

	// on affiche les zones touchées par le multitouch
	if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
		Hammer.plugins.showTouches();
	}

	// on simule le multitouch grâce à SHIFT + MOUSE
	if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
		Hammer.plugins.fakeMultitouch();
	}

	var hammer = Hammer($("#ball"), {
		transform_always_block: true,
		tap_always: false,
		drag_min_distance: 0
	});

	hammer.on("touch tap doubletap transformstart transform dragstart drag dragend hold", function(event) {
		ballAction(event);
	});

	var $msg = $("#message");
	var $ball = $("#ball");

	var txt = "";
	var transform = "";
	var boxShadow = "";
	var divToDelete = 0;

	var scale = lastScale = 1,
		positionX = positionY = lastPositionX = lastPositionY = initPosY = initPosX = 0,
		pushed = false,
		square = false;

	function ballAction(event) {
		switch(event.type) {

			// au touch (quelque soit l'évenement), on initialise les variables
			case "touch" :
				lastScale = scale;
				console.log(positionX + " - " + positionY);
				lastPositionX = positionX;
				lastPositionY = positionY;
			break;

			// case "tap" :
			// 	txt = "Tap : changement de couleur";
			// 	// couleur au hasard
			// 	$ball.css("background", '#'+Math.floor(Math.random()*16777215).toString(16));
			// break;

			// case "doubletap" :
			// 	txt = "DoubleTap : changement de forme";
			// 	if(square)
			// 		$ball.css("border-radius", "50%");
			// 	else
			// 		$ball.css("border-radius", "10px");
			// 	square = !square;
			// break;

			// case "transformstart" :
			// 	txt = "Transform : zoom sur la forme";
			// break;

			// case "transform" :
			// 	scale = Math.min(2, Math.max(0.2, lastScale * event.gesture.scale));
			// break;

			case "dragstart" :
				txt = "Drag : déplacement de la forme";
			break;

			case "drag" :
			console.log(positionX);
				positionX = lastPositionX + event.gesture.deltaX;
				positionY = lastPositionY + event.gesture.deltaY;
			break;

			case "dragend" :
				console.log("END : " + positionX + " - " + positionY);
				// $ball.
				$ball.animate({translateX: "-"+positionX+"px"}, 200);
			// 	positionX = initPosX;
			// 	positionY = initPosY
			// 	console.log("END : " + positionX + " - " + positionY);
			break;

			// case "hold" :
			// 	txt = "Hold : on enfonce la forme";
			// 	if(pushed)
			// 		boxShadow = "";
			// 	else
			// 		boxShadow = "inset 0px 0px 53px 1px rgba(0,0,0,0.75)";
			// 	pushed = !pushed;

			// 	$ball.css("-webkit-box-shadow", boxShadow);
			// 	$ball.css("-moz-box-shadow", boxShadow);
			// 	$ball.css("box-shadow", boxShadow);
			// break;
		}

		// console.log("1");
		// $ball.animate({translateX: event.gesture.deltaX+"px"}, 0);
		// console.log("2");


		transform = "translate3d(" + positionX + "px, " + positionY + "px, 0)" +
					"scale(" + scale + ")";

		$ball.css("transform", transform);
		$ball.css("-ms-transform", transform);
		$ball.css("-webkit-transform", transform);

		/**
		* Affichage du message et suppression si en surnombre
		**/
		if(txt != "") {
			// affichage
			$msg.css("opacity", 1);
			$msg.append("<div>" + txt + "</div>");
			txt = "";
			// suppression
			if($msg.find("div").length > 3) {
				var $div = $msg.find("div").eq(divToDelete);
				divToDelete++;
				$div.css("transition", "opacity 0.2s");
				$div.css("-webkit-transition", "opacity 0.2s");
				$div.css("opacity", 0);
				$div.on("webkitTransitionEnd transitionend", function() {
					$(this).remove(); 
					divToDelete--;
				});
			}
		}
	}
});