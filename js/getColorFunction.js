function getColorFunction( colorString, hslDifferences, mode ){

  // default mode: sass
  var mode = typeof mode !== 'undefined' ? mode : "sass";

  var colorFunction = colorString;

  // H
  if ( hslDifferences[0] !== 0 ) { // if hue changes
    var invH = hslDifferences[0] * -1;
    var hueFunction = ( mode == "sass" ) ? "adjust-hue" : "spin";
    colorFunction = hueFunction + "( " + colorFunction + ", " + invH + "deg )";
  }

  // S
  if ( hslDifferences[1] < 0 ) { // if second color is more saturated
    var absS = Math.abs( hslDifferences[1] );
    colorFunction = "saturate( " + colorFunction + ", " + absS + " )";
  } else if ( hslDifferences[1] > 0 ) { // if second color is less saturated
    colorFunction = "desaturate( " + colorFunction + ", " + hslDifferences[1] + " )";
  }

  // L
  if ( hslDifferences[2] < 0 ) { // if second color is lighter
    var absL = Math.abs( hslDifferences[2] );
    colorFunction = "lighten( " + colorFunction + ", " + absL + " )";
  } else if ( hslDifferences[2] > 0 ) { // if second color is darker
    colorFunction = "darken( " + colorFunction + ", " + hslDifferences[2] + " )";
  }

  // console.log( hslDifferences );
  return( colorFunction );

}

// const round = (num) => Math.round((num + Number.EPSILON) * 10) / 10
const round = (num) => {
  if(num == 0) return 0;
  return Math.round(num * 10) / 10
}

const  HexToHSL = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw new Error("Could not parse Hex Color tt"+ hex);
  }

  const rHex = parseInt(result[1], 16);
  const gHex = parseInt(result[2], 16);
  const bHex = parseInt(result[3], 16);

  const r = rHex / 255;
  const g = gHex / 255;
  const b = bHex / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // Achromatic
    return [0,0,l*100];
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;

  s = s * 100;
  l = l * 100;
  h = 360 * h;

  return [ h, s, l ];
}



function getColorDifferences( start, end ) {

  var differences = [];
  var startColorHSL = HexToHSL(start);
  var endColorHSL = HexToHSL(end);

  console.log('start', startColorHSL);
  console.log('end', endColorHSL);

  for ( var i = 0; i < 3; i++ ) {
    differences[i] = round(startColorHSL[i] - endColorHSL[i]);
  }

  console.log(differences);

  return( differences );

}

// #startColor
// #endColor

$(function(){
  $( ".colorInput" ).on( "change", function(){
    var startColor = document.getElementById( "startColor" ).value;
    var endColor = document.getElementById( "endColor" ).value;
    var differences = getColorDifferences( startColor, endColor );
    var outputText = getColorFunction( startColor, differences );
    $( "#functionOutput" ).text(outputText);
    console.log('tt', differences.map(i=>-i));
    $( "#functionOutput2" ).text(differences.map(i=>-i).join(', '));
  });
});
