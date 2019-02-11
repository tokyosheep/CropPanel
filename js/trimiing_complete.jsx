
//---------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------

function adguide(adguideHORIZONTAL01,adguideHORIZONTAL02,adguideVERTICAL01,adguideVERTICAL02){//ガイドを追加する関数
    activeDocument.guides.add(Direction.HORIZONTAL,adguideHORIZONTAL01);
    activeDocument.guides.add(Direction.HORIZONTAL,adguideHORIZONTAL02);
    
    activeDocument.guides.add(Direction.VERTICAL,adguideVERTICAL01);
    activeDocument.guides.add(Direction.VERTICAL,adguideVERTICAL02);
    
    }

//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

//背景レイヤー変換関数
function changegroundlayer (){
var blayer = activeDocument.artLayers;
for (i=0; i<blayer.length; i++)
{
if (blayer[i].isBackgroundLayer)
{
blayer[i].blendMode = BlendMode.NORMAL;
}
}    
    
    }

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------




 function groundpaint(R,G,B){//下地レイヤー追加の関数


var idMk = charIDToTypeID( "Mk  " );
    var desc4 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        ref1.putClass( idcontentLayer );
    desc4.putReference( idnull, ref1 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc5 = new ActionDescriptor();
        var idType = charIDToTypeID( "Type" );
            var desc6 = new ActionDescriptor();
            var idClr = charIDToTypeID( "Clr " );
                var desc7 = new ActionDescriptor();
                var idRd = charIDToTypeID( "Rd  " );
                desc7.putDouble( idRd, R );
                var idGrn = charIDToTypeID( "Grn " );
                desc7.putDouble( idGrn, G );
                var idBl = charIDToTypeID( "Bl  " );
                desc7.putDouble( idBl, B );
            var idRGBC = charIDToTypeID( "RGBC" );
            desc6.putObject( idClr, idRGBC, desc7 );
        var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
        desc5.putObject( idType, idsolidColorLayer, desc6 );
    var idcontentLayer = stringIDToTypeID( "contentLayer" );
    desc4.putObject( idUsng, idcontentLayer, desc5 );
executeAction( idMk, desc4, DialogModes.NO );

var layer = activeDocument.artLayers.length;//
var ground = layer-1//ドキュメントのレイヤーの数ｊ引く1
var layName = app.activeDocument.activeLayer;
        var dstLayerSetObj = activeDocument.artLayers[ground];
layName.move(dstLayerSetObj,ElementPlacement.PLACEAFTER);//レイヤーの階層を移動させる命令
 var docObj = activeDocument;
docObj.activeLayer = docObj.layers[0];//一番上のレイヤー選択
}

//-------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------







function psdjpegsave(){


fileObj = new File(activeDocument.fullName);
psdOpt = new PhotoshopSaveOptions();
psdOpt.alphaChannels = true;
psdOpt.annotations = true;
psdOpt.embedColorProfile = true;
psdOpt.layers = true;
psdOpt.spotColors = false;
activeDocument.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);

    app.activeDocument.convertProfile(
"sRGB IEC61966-2.1",
Intent.PERCEPTUAL,//知覚的
true, true );//黒点補正、ディザ補正 

fileObj = new File(activeDocument.fullName);
jpegOpt = new JPEGSaveOptions();
jpegOpt.embedColorProfile = true;
jpegOpt.quality = 12;
jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
jpegOpt.scans = 3;
jpegOpt.matte = MatteType.NONE;
activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
activeDocument.close(SaveOptions.DONOTSAVECHANGES);    
    
    }
















function begin_crop (crop_obj){
 crop_obj. done = function(){
    
if(this.unit=="pixel"){
preferences.rulerUnits = Units.PIXELS;    
     }else if(this.unit=="mm"){
preferences.rulerUnits = Units.MM;        
         }else if(this.unit=="cm"){
preferences.rulerUnits = Units.CM;             
             }else if(this.unit=="inch"){
preferences.rulerUnits = Units.INCHES;                 
                 }else{
preferences.rulerUnits = Units.POINTS;                     
                     }
 

 
 
 
var w = activeDocument.width;
var h = activeDocument.height;        
     
     
  changegroundlayer ();
  
 //----------------------ガイド削除---------------------------- 
if(this.Dguide){
  activeDocument.guides.removeAll();  
    }  
 //--------------------------------------------------------------- 
  
if(this.guideswitch){
adguide(parseFloat (this.gh01),parseFloat (this.gh02),parseFloat (this.gv01),parseFloat (this.gv02));
}

if(this.Cguide){
    activeDocument.guides.add(Direction.HORIZONTAL,h/2);
    activeDocument.guides.add(Direction.VERTICAL,w/2);
    }

/*===================キャンバス拡張実行=======================*/
    activeDocument.guides.add(Direction.HORIZONTAL,0);
    activeDocument.guides.add(Direction.HORIZONTAL,h);
    
    activeDocument.guides.add(Direction.VERTICAL,0);
    activeDocument.guides.add(Direction.VERTICAL,w);
 
    


//jsからjsxに投げられる数値はstringタイプになるのでやはりparseFloatが必要になる
activeDocument.resizeCanvas(w,h+parseFloat (this.top) ,AnchorPosition.BOTTOMCENTER);
var h = activeDocument.height;
activeDocument.resizeCanvas(w,h+parseFloat(this.bottom),AnchorPosition.TOPCENTER);

var h = activeDocument.height;
activeDocument.resizeCanvas(w+parseFloat(this.left),h,AnchorPosition.MIDDLERIGHT);
var w = activeDocument.width;
activeDocument.resizeCanvas(w+parseFloat(this.right),h,AnchorPosition.MIDDLELEFT);
/*========================================================*/   

/*================================================================================
================================オプション=========================================*/







    if(this.colorswitch){ 
 groundpaint(crop_obj.R,crop_obj.G,crop_obj.B);    
     }
 
 
if(this.Save){
psdjpegsave();    
    } 
 
 
     }
 /*================================================================================
 ================================================================================*/
 
 //----------------------------------------------------------------------------------------------------------------------------------------------
 //---------------------------------------------------------------------------------------------------------------------------------------------- 
  if(crop_obj.all){//開いたファイル全てに処理
  var sourceDocs=new Array();//ソースドキュメント用の配列を作成
for(var k=0; k<app.documents.length; k++){
      var soudocObj = app.documents[k];
      app.activeDocument = soudocObj ;
            sourceDocs[k]=app.documents[k];//ソースドキュメント用の配列をつくりまずは格納そしてソースドキュメントを後に指定したらソースドキュメントを順番に閉じることができた

            }
        
         for(var po=0; po<sourceDocs.length; po++){//アクティブドキュメントのlengthではなく一度事前に取得したソースゴキュメントlengthなのに注意
  app.activeDocument=sourceDocs[po];
 
crop_obj. done();
             
    }      
      
      }else{
 crop_obj. done(); }
//-------------------------------------------------------------------------------------------------------------------------------------------------    
//-------------------------------------------------------------------------------------------------------------------------------------------------    
    
    }


function batchprocess(process){
    //以下開いたファイルに適応させる処理
  
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------バッチ処理----------------------------------------------------------------------------------------------------------
 
}