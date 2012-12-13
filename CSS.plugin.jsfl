var meta;
var frames;

function getPluginInfo(lang)
{
//	fl.trace("==== getPluginInfo");
//	fl.trace(lang);
//	fl.trace("---- getPluginInfo");

	pluginInfo = new Object();
	pluginInfo.id = "CSS Keyframe Animations v1";
	pluginInfo.name = "CSS Keyframe Animations";
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
	// initialize frames array
	frames = [];
	fl.trace("** Export started **");
	return "";
}

function frameExport(frame)
{
	// store frame for future use
	frames.push( frame );
	return  "";
}

function endExport(meta)
{
	var fps = fl.getDocumentDOM().frameRate,
		totalFrames = frames.length,
		startFrame,endFrame,
		currentName,currentFrame,
		numFrames,keyframes,
		i = 0,
		j,tmp,
		output = "";

	while(i<totalFrames) {
		
		//=== store start frame and get symbol name
		startFrame = i;
		currentName = frames[startFrame].symbolName;

		fl.trace("Processing symbol \"" + currentName + "\"");
		
		//=== find end frame
		for(endFrame=startFrame+1;endFrame<totalFrames;endFrame++){
			if ( currentName != frames[endFrame].symbolName ) {
				--endFrame;
				break;
			}
		}

		//=== export symbol animtion
		numFrames = endFrame - startFrame;
		currentFrame = frames[startFrame];
		currentName = currentName.replace(" ",""); // todo: remove more invalid characters ?
		tmp = (numFrames / fps).toFixed(2);
		
		//= create class
		output +=  "." + currentName + " {\n";
		output +=  "\tbackground: url(" + meta.image + ");\n";
		output +=  "\tdisplay: block;\n";
		output +=  "\twidth: " + currentFrame.frame.w + "px;\n";
		output +=  "\theight: " + currentFrame.frame.h + "px;\n";
		output +=  "\tmargin: 0;\n";
		output +=  "\tpadding: 0;\n";
		output +=  "\t-webkit-animation: " + currentName + " " + tmp + "s infinite;\n";
		output +=  "\t-moz-animation: " + currentName + " " + tmp + "s infinite;\n";
		output +=  "\t-ms-animation: " + currentName + " " + tmp + "s infinite;\n";
		output +=  "\t-o-animation: " + currentName + " " + tmp + "s infinite;\n";
		output +=  "\tanimation: " + currentName + " " + tmp + "s infinite;\n";
		output +=  "}\n";
		output +=  "\n";

		//= gather keyframes
		keyframes = "keyframes " + currentName + " {\n";
		for(j=0;j<numFrames;j++){
			currentFrame = frames[j+startFrame];
			keyframes += "\t" + (Math.round(10000/numFrames*j)/100) + "%, ";
			tmp = Math.round(10000/numFrames*(j+1))/100;
			keyframes += ((j==numFrames-1)?tmp:(tmp-0.01).toFixed(2)) + "% ";
			keyframes += "{ background-position: " + (-currentFrame.frame.x) + "px " + (-currentFrame.frame.y) + "px; }\n";
		}
		keyframes += "}\n\n";

		//= duplicate keyframes using vendor prefixes
		output += "@-webkit-" + keyframes;
		output += "@-moz-" + keyframes;
		output += "@-ms-" + keyframes;
		output += "@-o-" + keyframes;
		output += "@" + keyframes;

		//=== iterate
		i = endFrame + 1;
	}

	fl.trace("** Export finished **");

	return output;
}
