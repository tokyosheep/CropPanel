/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
import '@babel/polyfill';
import "../css/style.scss";

import {prevent_drag_event} from "./prevent_draganddrop.js";

(function () {
    'use strict';
    
    var crop = document.forms.crop;//フォーム要素取得
    var RGBnum = document.forms.RGB;//フォーム要素取得    
    var guidenum = document.forms.guide;//フォーム要素取得  
    var Color_Switch = document.getElementById("Color_Switch");
    var Guide_Switch = document.getElementById("Guide_Switch");
    var guideform = document.getElementsByClassName("guideform");
    
    var Openallfile = document.getElementById("Openallfile");
    var centerguide = document.getElementById("centerguide");
    var deleteguide = document.getElementById("deleteguide");
    var savefile = document.getElementById("savefile");
    
    Openallfile.checked = false;
    centerguide.checked = false;
    deleteguide.checked = false;
    savefile.checked = false;
    Guide_Switch.checked = false;
    Color_Switch.checked = false;
    
    
    var csInterface = new CSInterface();
    prevent_drag_event();
    
    Guide_Switch.addEventListener("change",function(e){
        
    if(Guide_Switch.checked==true){
    guidenum.h01.disabled = "";
    guidenum.h02.disabled = ""; 
    guidenum.v01.disabled = "";     
    guidenum.v02.disabled = "";     
     $(".guideform").css({"background-color":"#555555","color":"white"});    
        
    }else{
     guidenum.h01.disabled = "true";
    guidenum.h02.disabled = "true"; 
    guidenum.v01.disabled = "true";     
    guidenum.v02.disabled = "true"; 
     $(".guideform").css({"background-color":"black","color":"gray"});    
           
        
    }   
        
        
    },false);
    
    
    
    Color_Switch.addEventListener("change",function(e){
      
    
     if(Color_Switch.checked==true){     
     $("#R").css({"background-color":"red","color":"white"});
     $("#G").css({"background-color":"green","color":"white"});        
     $("#B").css({"background-color":"blue","color":"white"});        
     RGBnum.R.disabled = ""; 
     RGBnum.G.disabled = "";
     RGBnum.B.disabled = "";     
    }else{
     $("#R").css({"background-color":"black","color":"gray"});  
     $("#G").css({"background-color":"black","color":"gray"});        
     $("#B").css({"background-color":"black","color":"gray"});     
     RGBnum.R.disabled = "true";  
     RGBnum.G.disabled = "true";
     RGBnum.B.disabled = "true";      
    }          
        
    },false);
    
    
    
    $("li",this).click(function(){
        
    $("li").css("background-color","#909090")    
    $(this).css("background-color","#606060");    
        
    });
    
    
    function init() {
                
        themeManager.init();
                
        $("#Done").click(function () {
            
            var hoge = $('#unitSwitch').children('li');
            var unit ="";
            for(var i = 0;i<hoge.length ; i++){
                
            if($(hoge[i]).css("background-color")=="rgb(96, 96, 96)"){
            var unit = $(hoge[i]).html()    
            }
                
            }
            
            

            
            /*==============処理前に数値を判定==============*/
            
            if(!checknum(crop.up.value,crop.bottom.value,crop.right.value,crop.left.value)){
            alert("canvas forms accepts only number. you put something a text");    
            return
                
            }
            
            if(!(checknum(guidenum.h01.value,guidenum.h02.value,guidenum.v01.value,guidenum.v02.value))&&(Guide_Switch.checked)){
               alert("guide forms accepts only number. you put something a text"); 
                return
            }
            
            if((!checknum(RGBnum.R.value,RGBnum.G.value,RGBnum.B.value))&&(Color_Switch.checked)){
                alert("color forms accepts only number. you put something a text");
                return
            }
            
            
            function checknum(){
                
            for(var j=0 ; j<arguments.length;j++ ){
            var check = parseFloat(arguments[j]);    
            if(isNaN(check)){
            return false;    
            }    
                
            }    
             return true;   
            }
            /*===========================================*/
           
            
            var crop_obj ={
            unit:unit,    
            top: crop.up.value,  
            bottom: crop.bottom.value,
            right:  crop.right.value,
            left: crop.left.value,
            guideswitch: Guide_Switch.checked, 
            gh01: guidenum.h01.value,
            gh02: guidenum.h02.value,
            gv01: guidenum.v01.value,
            gv02: guidenum.v02.value,
            colorswitch: Color_Switch.checked,
            R: RGBnum.R.value,
            G: RGBnum.G.value,
            B: RGBnum.B.value,
            all: Openallfile.checked,
            Cguide: centerguide.checked,
            Dguide:deleteguide.checked,
            Save:savefile.checked    
            }
            
 csInterface.evalScript('begin_crop('+ JSON.stringify(crop_obj) +')');
        });
    }
        
    init();

}());
    
