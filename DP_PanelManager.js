/*  DepressedPress.com, DP_PanelManager

Author: Jim Davis, the Depressed Press
Created: January 9, 2007
Contact: webmaster@depressedpress.com
Website: www.depressedpress.com

Full documentation can be found at:
http://depressedpress.com/javascript-extensions/

DP_PanelManager provides features and abstractions to make DHTML design simpler.

Event Abstraction code (the addEvent(), removeEvent(), and handleEvent() methods) is based in large part on code authored by Dean Edwards (2005, http://dean.edwards.name/weblog/2005/10/add-event/, input from Tino Zijdel, Matthias Miller, Diego Perini)


+ + + + + + + + LEGAL NOTICE + + + + + + + +

Copyright (c) 1996-2014, The Depressed Press (depressedpress.com)

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

+) Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

+) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

+) Neither the name of the DEPRESSED PRESS (DEPRESSEDPRESS.COM) nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/


	// Panel Manager
DP_PanelManager = function(AnimationInterval, ZFront, ZBack, ZBase) {

		// Set Z Properties
	if ( isNaN(ZFront) ) { ZFront = 500 };
	this.ZFront = ZFront;
	if ( isNaN(ZBack) ) { ZBack = -500 };
	this.ZBack = ZBack;
	if ( isNaN(ZBase) ) { ZBase = 0 };
	this.ZBase = ZBase;

		// Set a Count of the member panels, used for automatic naming
	this.PanelCount = 0;

		// Set SlideInterval (the duration between steps for "Slide" methods)
	if ( isNaN(AnimationInterval) || AnimationInterval < 1 ) { AnimationInterval = 5 };
	this.AnimationInterval = AnimationInterval;

		// Set the Panel collection
	this.Panels = new Object();

};


	// Gets the current browser size (the size of the viewable window)
DP_PanelManager.prototype.getWindowSize = function() {

	var WindowHeight, WindowWidth;
	var doc = document;
	if ( typeof window.innerWidth != 'undefined' ) {
		WindowHeight = window.innerHeight;
		WindowWidth = window.innerWidth;
	} else {
		if ( doc.documentElement && typeof doc.documentElement.clientWidth != 'undefined' && doc.documentElement.clientWidth != 0 ) {
			WindowHeight = doc.documentElement.clientHeight;
			WindowWidth = doc.documentElement.clientWidth;
		} else {
			if ( doc.body && typeof doc.body.clientWidth != 'undefined' ) {
				WindowHeight = doc.body.clientHeight
				WindowWidth = doc.body.clientWidth
			};
		};
	};

		// Return a Height, Width array
	return [WindowHeight, WindowWidth]

};


	// Gets the current canvas size
DP_PanelManager.prototype.getCanvasSize = function() {

	var CanvasHeight, CanvasWidth;
	var doc = document;

	var WindowSize = this.getWindowSize();

	CanvasHeight = doc.documentElement.scrollHeight
	CanvasWidth = doc.documentElement.scrollWidth - (doc.documentElement.scrollWidth - WindowSize[1]);

		// Adjust Height in IE to match Opera and Firefox
	if ( doc.documentElement.scrollHeight < WindowSize[0] ) {
		CanvasHeight = WindowSize[0];
	};

		// Return a Height, Width array
	return [CanvasHeight, CanvasWidth]

};


	// Gets the current mouse position relative to the canvas
DP_PanelManager.prototype.getMousePosition = function(Event) {

	var Top = 0;
	var Left = 0;
	if ( !Event ) { var Event = window.event };
	if ( Event.pageX || Event.pageY ) {
		Top = Event.pageY;
		Left = Event.pageX;
	} else if ( Event.clientX || Event.clientY ) {
		Left = Event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		Top = Event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	};

		// Return a Top, Left array
	return [Top, Left]

};


	// Creates a panel and adds it to the collection
DP_PanelManager.prototype.newPanel = function(PanelId, PanelEl, DefaultDisplay) {

		// Default the panelId element to null
	if ( typeof PanelId != "string" ) {
		PanelId = null;
	};
		// Default the panel element to "div"
	if ( typeof PanelEl != "string" ) {
		PanelEl = "div";
	};
		// Default the DefaultPanelDisplay (the display when NOT "none")
	if ( typeof DefaultDisplay != "string" ) {
		DefaultDisplay = "block";
	};

		// Create the Div
	var NewPanel;
	NewPanel = document.createElement(PanelEl);
	if ( PanelId ) {
		NewPanel.id = PanelId;
	};
	NewPanel.style.position = "absolute";
	NewPanel.style.display = "none";
	NewPanel.style.zIndex = this.ZBase;

		// Add the Div to the document
	document.getElementsByTagName("BODY")[0].appendChild(NewPanel);

		// Extend the new Panel and return it
	return this.addPanel(NewPanel, DefaultDisplay);

};


	// Returns an array of all Panels in the Manager sorted by the specified property
DP_PanelManager.prototype.getPanelList = function(Prop){

		// Create an Array of all Panels
	var AllPanels = new Array();
	for ( var PanelKey in this.Panels ) {
		AllPanels[AllPanels.length] = this.Panels[PanelKey];
	};
		// Sort the Panels
		// Determine the type of the sort and generate the function for testing
	switch ( Prop.toLowerCase() ) {
		case "height" :
			var SortFunction = function(A,B) { return A.getSize()[0] - B.getSize()[0] };
			break;
		case "width" :
			var SortFunction = function(A,B) { return A.getSize()[1] - B.getSize()[1] };
			break;
		case "top" :
			var SortFunction = function(A,B) { return A.getPosition()[0] - B.getPosition()[0] };
			break;
		case "left" :
			var SortFunction = function(A,B) { return A.getPosition()[1] - B.getPosition()[1] };
			break;
		case "opacity" :
			var SortFunction = function(A,B) { return A.getOpacity() - B.getOpacity() };
			break;
		case "order" :
			var SortFunction = function(A,B) { return A.getOrder() - B.getOrder() };
			break;
		case "id" :
			var SortFunction = function(A,B) { if ( A.id < B.id ) return -1; if ( A.id > B.id ) return 1; return 0  };
			break;
	};

		// Sort the Array
	AllPanels.sort(SortFunction);

		// Return Array
	return AllPanels;

};


	// Adds an existing panel to the collection
DP_PanelManager.prototype.addPanel = function(El, DefaultDisplay) {

		// Update the PanelCount
	this.PanelCount = this.PanelCount + 1;

		// Get the Element
	if ( typeof El == "string" ) {
		var Panel = document.getElementById(El);
	} else {
		var Panel = El;
	};

		// Try to get the ID of the element
	var ElId = Panel.id;
		// If no ID is present, create a label
	if ( !ElId ) {
		var PanelKey = "Panel_" + this.PanelCount;
	} else {
		var PanelKey = ElId;
	};
		// Set a reference to the object in the Panel Manager
	this.Panels[PanelKey] = Panel;

		// Default the Panel to "relative" position if no position is set
	if ( Panel.style ) {
		if ( Panel.style.position == "static" || Panel.style.position == "" ) {
			Panel.style.position = "relative";
		};
	};

	if ( Panel.style ) {
			// Set the DefaultDisplay value
		if ( typeof DefaultDisplay != "string" ) {
			DefaultDisplay = Panel.style.display;
		};
	};
	Panel.DefaultDisplay = DefaultDisplay;

		// Set a reference to the parent panel manager
	Panel.panelManager = this;



	/* Content Load Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Load Content
	Panel.load = function(Content) {

			// "null" the old (to clear it)
		Panel.innerHTML = null;

			// Load the content
		Panel.innerHTML = Content;

			// Load Scripts
		var AllScripts = Panel.getElementsByTagName("script");
		var AllScriptsCnt = AllScripts.length;
		for (var Cnt = 0; Cnt < AllScriptsCnt; Cnt++){
			var CurScript = document.createElement('script');
			CurScript.type = "text/javascript";
			CurScript.text = AllScripts[Cnt].text;
			Panel.appendChild(CurScript);
		};

	};



	/* Visibilty/Display (Showing/Hiding) Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Get Visibility
	Panel.getVisibility = function() {

		return Panel.style.visibility;

	};

		// Set Visibility
	Panel.setVisibility = function(Action, Delay) {

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() { Panel.setVisibility(Action) }, Delay);
			return;
		};

		switch ( Action.toLowerCase() ) {
			case "show":
				Panel.style.visibility = "visible";
				break;
			case "hide":
				Panel.style.visibility = "hidden";
				break;
			case "toggle":
				if ( Panel.style.visibility == "hidden" ) {
					Panel.setDisplay("show");
				} else {
					Panel.setDisplay("hide");
				};
				break;
		};

	};


		// Get Display
	Panel.getDisplay = function() {

		return Panel.style.display;

	};

		// Set Display
	Panel.setDisplay = function(Action, Delay) {

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() { Panel.setDisplay(Action) }, Delay);
			return;
		};

		switch ( Action.toLowerCase() ) {
			case "show":
				Panel.style.display = Panel.DefaultDisplay;
				break;
			case "hide":
				Panel.style.display = "none";
				break;
			case "toggle":
				if ( Panel.style.display == "none" ) {
					Panel.setDisplay("show");
				} else {
					Panel.setDisplay("hide");
				};
				break;
		};

	};



	/* Order (z-index) Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Get Order
	Panel.getOrder = function() {

		if ( parseFloat(Panel.style.zIndex, 10) == ( Panel.style.zIndex * 1 ) ) {
			return Panel.style.zIndex;
		};
		return 0;

	};

		// Set Order
	Panel.setOrder = function(Action, Delay) {

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() { Panel.setOrder(Action) }, Delay);
			return;
		};

		if ( typeof Action == 'number' ) {

			Panel.style.zIndex = Action;

		} else {

			switch ( Action.toLowerCase() ) {
				case "tofront":
					Panel.style.zIndex = Panel.panelManager.ZFront;
					break;
				case "toback":
					Panel.style.zIndex = Panel.panelManager.ZBack;
					break;
				case "tobase":
					Panel.style.zIndex = Panel.panelManager.ZBase;
					break;
			};

		};

	};



	/* Interaction (collision/overlap) Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Has Collision with Element?
	Panel.hasCollisionWith = function(El) {

			// Get the Distance
		var Distance = Panel.getDistanceFrom(El);

			// Determine collision
		if (Distance[0] < 0 && Distance[1] < 0) {
			return true;
		} else {
			return false;
		};

	};

		// Get Distance From Element
	Panel.getDistanceFrom = function(El) {

			// Get the Element
		if ( typeof El == "string" ) {
			var TestPanel = document.getElementById(El);
		} else {
			var TestPanel = El;
		};

			// Get the Center of this panel
		var ThisY = Panel.getPosition()[0] + (Panel.getSize()[0]/2);
		var ThisX = Panel.getPosition()[1] + (Panel.getSize()[1]/2);
			// Get the Center of the test panel
		var TestY = TestPanel.getPosition()[0] + TestPanel.getSize()[0]/2;
		var TestX = TestPanel.getPosition()[1] + TestPanel.getSize()[1]/2;

			// Get the total height and width of the two panels (divide by half since we're checking from the center)
		var TotalH = (Panel.getSize()[0] + TestPanel.getSize()[0])/2;
		var TotalW = (Panel.getSize()[1] + TestPanel.getSize()[1])/2;

			// Get the Distance
		var DisY = Math.abs(ThisY - TestY) - TotalH;
		var DisX = Math.abs(ThisX - TestX) - TotalW;

			// Determine Bearing
		var Bear = Math.round( ( ( ( ( Math.atan2((TestX-ThisX),(ThisY-TestY)) ) * 180 / Math.PI ) + 360 ) % 360 ) * 100) / 100;

			// Determine the Direction X and Y
		var DirY = 0;
		if ( Math.abs(ThisY) < Math.abs(TestY) ) { DirY = -1 };
		if ( Math.abs(ThisY) > Math.abs(TestY) ) { DirY = 1 };
		var DirX = 0;
		if ( Math.abs(ThisX) > Math.abs(TestX) ) { DirX = -1 };
		if ( Math.abs(ThisX) < Math.abs(TestX) ) { DirX = 1 };

			// Get the distance between the two objects, and return
		return [DisY, DisX, Bear, DirY, DirX];

	};



	/* Position Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Get Position
	Panel.getPosition = function() {

		var CurTop = 0;
		var CurLeft = 0;
		var CurOb = Panel;

		if ( CurOb.offsetParent ) {
			CurTop = Panel.offsetTop;
			CurLeft = Panel.offsetLeft;
			while ( CurOb = CurOb.offsetParent ) {
				CurTop += CurOb.offsetTop;
				CurLeft += CurOb.offsetLeft;
			};
		};

			// Return an array with the values
		return [CurTop, CurLeft];

	};

		// Set Position
	Panel.setPosition = function(TopLeft, Delay, Duration) {

			// Extract TopLeft
		var Top = TopLeft[0];
		var Left = TopLeft[1];

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() {Panel.setPosition([Top,Left], 0, Duration) }, Delay );
			return;
		};

			// Get the Interval
		var Interval = Panel.panelManager.AnimationInterval;
			// Set the Duration
		if ( isNaN(Duration) || Duration <= Interval ) { Duration = 0 };

			// Get Current Position
		var CurPosition = Panel.getPosition();

			// Set Top to current, if not provided
		if ( isNaN(Top) || Top == null ) { Top = CurPosition[0] };
			// Set Left to current, if not provided
		if ( isNaN(Left) || Left == null ) { Left = CurPosition[1] };

			// If the Duration is greater than the interval, begin an animation
		if ( Duration > Interval ) {

				// Calc params
			var Steps = Duration / Interval;
			var TopStep = Math.abs(Top - CurPosition[0]) / Steps;
			var LeftStep = Math.abs(Left - CurPosition[1]) / Steps;

				// Loop over and set the timeouts
			var CurTopStep, CurLeftStep;
			var AnimFrames = new Array();
			var DelayedStep = 0;
			for ( var Step = 1; Step <= Steps; Step++ ) {
				if ( CurPosition[0] < Top ) {
					CurTopStep = Math.round(CurPosition[0] + (TopStep * Step));
				} else {
					CurTopStep = Math.round(CurPosition[0] - (TopStep * Step));
				};
				if ( CurPosition[1] < Left ) {
					CurLeftStep = Math.round(CurPosition[1] + (LeftStep * Step));
				} else {
					CurLeftStep = Math.round(CurPosition[1] - (LeftStep * Step));
				};
					// Add the current values to the AnimFrames array
				AnimFrames[Step] = [CurTopStep,CurLeftStep];
					// Set the delayed rePosition
				window.setTimeout(function(){ DelayedStep++; Panel.setPosition([AnimFrames[DelayedStep][0],AnimFrames[DelayedStep][1]]); }, (Step * Interval));

			};

		} else {

				// Adjust for relative position
			if ( Panel.style.position == "relative" ) {
				var TopOffset = parseInt( Panel.style.top, 10 );
				if ( isNaN(TopOffset) ) { TopOffset = 0 };
				Top = Top - CurPosition[0] + TopOffset;
				var LeftOffset = parseInt( Panel.style.left, 10 );
				if ( isNaN(LeftOffset) ) { LeftOffset = 0 };
				Left = Left - CurPosition[1] + LeftOffset;

			};

				// Set the Position
			Panel.style.top = Top + "px";
			Panel.style.left = Left + "px";

		};

			// Return
		return;

	};

		// Shift Position
	Panel.shiftPosition = function(TopLeft, Delay, Duration) {

			// Extract TopLeft
		var Top = TopLeft[0];
		var Left = TopLeft[1];

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() {Panel.shiftPosition([Top,Left], 0, Duration) }, Delay);
			return;
		};

			// Get the current Position
		var CurPosition = Panel.getPosition();

			// Set Top
		if ( isNaN(Top) ) { Top = 0 };
		var NewTop = CurPosition[0] + Top;
			// Set Left
		if ( isNaN(Left) ) { Left = 0 };
		var NewLeft = CurPosition[1] + Left;

			// Set the Position
		Panel.setPosition([NewTop, NewLeft], 0, Duration);

	};



	/* Size Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Get size
	Panel.getSize = function() {

		return [Panel.offsetHeight, Panel.offsetWidth];

	};

		// Set size
	Panel.setSize = function(HeightWidth, Delay, Duration) {

			// Extract HeightWidth
		var Height = HeightWidth[0];
		var Width = HeightWidth[1];

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function(){ Panel.setSize([Height,Width], 0, Duration) }, Delay );
			return;
		};

			// Get the Interval
		var Interval = Panel.panelManager.AnimationInterval;
			// Set the Duration
		if ( isNaN(Duration) || Duration <= Interval ) { Duration = 0 };

			// Get/Set the current Size
		var CurSize = Panel.getSize();

			// Set Height
		if ( isNaN(Height) ||  Height == null ) { Height = CurSize[0] };
		if ( Height < 0 ) { Height = 0 };
			// Set Width
		if ( isNaN(Width) ||  Width == null ) { Width = CurSize[1] };
		if ( Width < 0 ) { Width = 0 };

			// If the Duration is greater than the interval, begin an animation
		if ( Duration > Interval ) {

				// Calc params
			var Steps = Duration / Interval;
			var HeightStep = Math.abs(Height - CurSize[0]) / Steps;
			var WidthStep = Math.abs(Width - CurSize[1]) / Steps;

				// Loop over and set the timeouts
			var CurHeightStep, CurWidthStep;
			var AnimFrames = new Array();
			var DelayedStep = 0;
			for ( var Step = 1; Step <= Steps; Step++ ) {
				if ( CurSize[0] < Height ) {
					CurHeightStep = Math.round(CurSize[0] + (HeightStep * Step));
				} else {
					CurHeightStep = Math.round(CurSize[0] - (HeightStep * Step));
				};
				if ( CurSize[1] < Width ) {
					CurWidthStep = Math.round(CurSize[1] + (WidthStep * Step));
				} else {
					CurWidthStep = Math.round(CurSize[1] - (WidthStep * Step));
				};
					// Add the current values to the AnimFrames array
				AnimFrames[Step] = [CurHeightStep,CurWidthStep];
					// Set the delayed reSize
				window.setTimeout(function(){ DelayedStep++; Panel.setSize([AnimFrames[DelayedStep][0],AnimFrames[DelayedStep][1]]); }, (Step * Interval));
			};

		} else {

				// Set the Size
			Panel.style.height = Height + "px";
			Panel.style.width = Width + "px";

		};

			// Return
		return;

	};

		// Shift Size
	Panel.shiftSize = function(HeightWidth, Delay, Duration) {

			// Extract HeightWidth
		var Height = HeightWidth[0];
		var Width = HeightWidth[1];

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function(){ Panel.shiftSize([Height,Width], 0, Duration) }, Delay);
			return;
		};

			// Get the current Size
		var CurSize = Panel.getSize();

			// Set Height
		if ( isNaN(Height) ) { Height = 0 };
		var NewHeight = CurSize[0] + Height;
			// Set Width
		if ( isNaN(Width) ) { Width = 0 };
		var NewWidth = CurSize[1] + Width;

			// Set the Size
		Panel.setSize([NewHeight, NewWidth], 0, Duration);

	};



	/* Opacity Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		// Get Opacity
	Panel.getOpacity = function() {

		if ( parseFloat(Panel.style.opacity, 10) == ( Panel.style.opacity * 1 ) ) {
			if ( Panel.style.opacity < 1 ) {
				return Panel.style.opacity * 100;
			};
		};
		return 100;

	};

		// Set Opacity
	Panel.setOpacity = function(Opacity, Delay, Duration) {

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout( function() {Panel.setOpacity(Opacity) }, Delay);
			return;
		};

			// Set Opacity
		if ( isNaN(Opacity) || Opacity == null ) { Opacity = Panel.getOpacity() }
		if ( Opacity < 0 ) { Opacity = 0 };
		if ( Opacity > 100 ) { Opacity = 100 };

			// Get the Interval
		var Interval = Panel.panelManager.AnimationInterval;
			// Set the Duration
		if ( isNaN(Duration) || Duration <= Interval ) { Duration = 0 };

			// Get the current value
		var CurOpacity = Panel.getOpacity();

			// If the Duration is greater than the interval, begin an animation
		if ( Duration > Interval ) {

				// Calc params
			var Steps = Duration / Interval;
			var OpacityStep = Math.abs(Opacity - CurOpacity) / Steps;

				// Loop over and set the timeouts
			var CurOpacityStep;
			var AnimFrames = new Array();
			var DelayedStep = 0;
			for ( var Step = 1; Step <= Steps; Step++ ) {
				if ( CurOpacity < Opacity ) {
					CurOpacityStep = Math.round(CurOpacity + (OpacityStep * Step));
				} else {
					CurOpacityStep = Math.round(CurOpacity - (OpacityStep * Step));
				};
					// Add the current values to the AnimFrames array
				AnimFrames[Step] = [CurOpacityStep];
					// Set the delayed reSize
				window.setTimeout(function(){ DelayedStep++; Panel.setOpacity(AnimFrames[DelayedStep][0]); }, (Step * Interval));
			};

		} else {

				// Set the Opacity
	    	Panel.style.opacity = (Opacity / 100);
		    Panel.style.filter = "alpha(opacity=" + Opacity + ")";
		    Panel.style.MozOpacity = (Opacity / 100);
	    	Panel.style.KhtmlOpacity = (Opacity / 100);

		};

			// Return
		return;

	};

		// Shift Opacity
	Panel.shiftOpacity = function(Opacity, Delay, Duration) {

			// Set input params
		if ( isNaN(Opacity) ) { Opacity = 0 };

			// Set Delay
		if ( isNaN(Delay) ) { Delay = 0 };
			// If a Delay is set, postpone the call.
		if ( Delay > 0 ) {
			window.setTimeout(function() { Panel.shiftOpacity(Opacity, 0, Duration) }, Delay);
			return;
		};

			// Calc new value
		var NewOpacity = Panel.getOpacity() + Opacity;

			// Set the Opacity
		Panel.setOpacity(NewOpacity, 0, Duration);

	};


	/* Event Methods */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	Panel.addEvent = function(Type, Handler) {
		if (Panel.addEventListener) {
			Panel.addEventListener(Type, Handler, false);
		} else {
				// Create collection of event types
			if (!Panel.events) Panel.events = {};
				// Collection of event handlers for the Type
			var Handlers = Panel.events[Type];
			if (!Handlers) {
				Handlers = Panel.events[Type] = {};
					// Get and store the existing handler (if needed)
				if (Panel["on" + Type]) {
					Handlers[0] = Panel["on" + Type];
				};
			};
				// Store the handler
			Handlers[Handler] = Handler;
				// Assign a global handler for the Type
			Panel["on" + Type] = Panel.handleEvent;
		};
	};

	Panel.removeEvent = function(Type, Handler) {
		if (Panel.removeEventListener) {
			Panel.removeEventListener(Type, Handler, false);
		} else {
				// Delete the handler
			if (Panel.events && Panel.events[Type]) {
				delete Panel.events[Type][Handler];
			};
		};
	};

	Panel.handleEvent = function(event) {
			// Default the return value
		var returnValue = true;
			// Get the event (IE uses a global)
		event = event || ((Panel.ownerDocument || Panel.document || Panel).parentWindow || window).event;
			// Normalize the Event methods
		if (!event.preventDefault) {
			event.preventDefault = function() { this.returnValue = false; };
		};
		if (!event.stopPropagation) {
			event.stopPropagation = function() { this.cancelBubble = true; };
		};
			// Get the handlers for this type
		var Handlers = Panel.events[event.type];
			// Run all of the handlers
		for (var Handler in Handlers) {
			Panel["executeHandler"] = Handlers[Handler];
			if ( Panel["executeHandler"](event) === false ) {
				returnValue = false;
			};
		}
		return returnValue;
	};

		// Return a reference to the newly added panel
	return Panel;

};