<h2>DP_PanelManager</h2>

<ul>	<li>Author: Jim Davis, the Depressed Press</li>
	<li>Created: January 9, 2007</li>
	<li><b>Documentation</b>: http://depressedpress.com/javascript-extensions/dp_panelmanager/</li>
	<li>Contact: http://depressedpress.com/about/contact-me/</li>
	<li>Other Components: http://depressedpress.com/javascript-extensions/</li>
</ul>

<p>The DP_PanelManager library provides a simple, consistent way to manipulate HTML elements with features such as:
<ul>	<li>Visibility and Display: Hide or show HTML elements with ease.</li>
	<li>Size and Position: Get the current size and position of elements and change them either directly or relatively with optional animation.  Complex animations can be created by chaining animations with delays.</li>
	<li>Opacity: Get and set Opacity consistently across supported browsers to create attractive "fade" effects.</li>
	<li>Event management: Add and remove events programmatically to allow for better separation between logic and presentation and better management of dynamic interfaces.</li>
	<li>Simple collision management (methods to tell when two panels are intersecting).</li>
	<li>Can provide lists of member panels ordered by panel properties (height, width, top, left, opacity, etc).  This is very useful for dynamic sorting and display of interface elements.</li>
</ul>
<p>DP_PanelManager also provides access to useful environmental information such as mouse pointer location and window/canvas size.  It makes the creation of common dynamic features like animated menus, pop-up tool tips, message boxes, etc much simpler.</p>
<ul>	<li>The library has a very small footprint; no global variables are created.</li>
	<li>Multiple instances of panel manager can be instantiated allowing for more control over related elements.</li>
	<li>Highly compatible.  The library normalizes access to properties and manipulations across all major browsers.</li>
</ul>
<p><em>Event Abstraction code (the addEvent(), removeEvent(), and handleEvent() methods) is based in large part on code authored by Dean Edwards (2005, <a href="http://dean.edwards.name/weblog/2005/10/add-event/">Original Blog Post</a>, input from Tino Zijdel, Matthias Miller, Diego Perini).</em></p>
<p>This component requires a JavaScript (ECMAScript) 1.3 (or better) run-time environment and has been tested successfully in Internet Explorer versions 6+, FireFox 1.5+, Opera 9+ and Google Chrome but should function on any modern browser.</p>

<blockquote style="background: #dedede;">
Copyright (c) 1996-2013, The Depressed Press (depressedpress.com)
<br />
All rights reserved.
<br />
Covered under the BSD Open Source License (included in the code).  Full legal information here: http://depressedpress.com/about/source-code-policy/
</blockquote>