var meta;
var frames;

function getPluginInfo(lang)
{
//	fl.trace("==== getPluginInfo");
//	fl.trace(lang);
//	fl.trace("---- getPluginInfo");

	pluginInfo = new Object();
	pluginInfo.id = "CSS Keyframe Animations v1";
	pluginInfo.name = "CSS Keyframe Animation";
	pluginInfo.ext = "css";
	pluginInfo.capabilities = new Object();
	pluginInfo.capabilities.canRotate = false;
	pluginInfo.capabilities.canTrim = false;
	pluginInfo.capabilities.canShapePad = false;
	pluginInfo.capabilities.canBorderPad = false;
	pluginInfo.capabilities.canStackDuplicateFrames = true;
	
	return pluginInfo;
}

function beginExport(meta)
{
	frames = [];
	fl.trace("Starting export...");
	return "";
}

function frameExport(frame)
{
	frames.push( frame );
	return  "";
}

function endExport(meta)
{
	/*
	fl.trace("==== endExport");
	fl.trace(meta.app);
	fl.trace(meta.version);
	fl.trace(meta.image);
	fl.trace(meta.format);
	fl.trace(meta.size.w);
	fl.trace(meta.size.h);
	fl.trace(meta.scale);
	fl.trace("---- endExport");

	fl.trace("==== frameExport");
	fl.trace(frame.id);
	fl.trace(frame.frame.x);
	fl.trace(frame.frame.y);
	fl.trace(frame.frame.w);
	fl.trace(frame.frame.h);
	fl.trace(frame.offsetInSource.x);
	fl.trace(frame.offsetInSource.y);
	fl.trace(frame.sourceSize.w);
	fl.trace(frame.sourceSize.h);
	fl.trace(frame.rotated);
	fl.trace(frame.trimmed);
	fl.trace(frame.frameNumber);
	fl.trace(frame.symbolName);
	fl.trace(frame.frameLabel);
	fl.trace(frame.lastFrameLabel);
	fl.trace("---- frameExport");
	*/


	var numFrames = frames.length;
	var fps = fl.getDocumentDOM().frameRate;
	var i,t,kf;
	var s = "";
	var f = frames[0];
	var name = f.symbolName.replace(" ","");

	// create class for applying animation
	s += "." + name + " {\n";
	s += "\tbackground: url(" + meta.image + ");\n";
	s += "\tdisplay: block;\n";
	s += "\twidth: " + f.frame.w + "px;\n";
	s += "\theight: " + f.frame.h + "px;\n";
	s += "\tmargin: 0;\n";
	s += "\tpadding: 0;\n";
	s += "\t-webkit-animation: " + name + " " + (numFrames / fps).toFixed(2) + "s infinite;\n";
	s += "\t-moz-animation: " + name + " " + (numFrames / fps).toFixed(2) + "s infinite;\n";
	s += "\t-ms-animation: " + name + " " + (numFrames / fps).toFixed(2) + "s infinite;\n";
	s += "\t-o-animation: " + name + " " + (numFrames / fps).toFixed(2) + "s infinite;\n";
	s += "\tanimation: " + name + " " + (numFrames / fps).toFixed(2) + "s infinite;\n";
	s += "}\n";
	s += "\n";

	// gather keyframes
	kf = "keyframes " + name + " {\n";
	for(i=0;i<numFrames;i++){
		f = frames[i];
		kf += "\t" + (Math.round(10000/numFrames*i)/100) + "%, ";
		t = Math.round(10000/numFrames*(i+1))/100;
		kf += ((i==numFrames-1)?t:(t-0.01).toFixed(2)) + "% ";
		kf += "{ background-position: " + -f.frame.x + "px " + -f.frame.y + "px; }\n";
	}
	kf += "}\n\n";

	// duplicate keyframes using vendor prefixes
	s += "@-webkit-" + kf;
	s += "@-moz-" + kf;
	s += "@-ms-" + kf;
	s += "@-o-" + kf;
	s += "@" + kf;

	fl.trace("...DONE");

	return s;
}
