/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
import '@babel/polyfill';
import "../css/style.scss";

import {prevent_drag_event} from "./prevent_draganddrop.js";
import {top_list,td_list,compact_tables} from "./insert_table.js";

window.onload = function(){
    'use strict';
    const csInterface = new CSInterface();
    const fs = require(`fs`);
    prevent_drag_event();
    themeManager.init();
    
    const extensionId = csInterface.getExtensionID(); 
    const filePath = csInterface.getSystemPath(SystemPath.EXTENSION) +`/js/`;
    const toJSX = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    
    
    const persistence = new CSEvent(`com.adobe.PhotoshopPersistent`,`APPLICATION`);
    persistence.extensionId = extensionId;
    csInterface.dispatchEvent(persistence);//persistence
    
    function loadJSX (fileName) {
        csInterface.evalScript(`$.evalFile("${toJSX + fileName}")`);
    }
    loadJSX(`json2.js`);
    const crop_jsx = `get_ID_crop.jsx`;//id_取得jsx
    const json_path = filePath + `crop.json`;
    
    const color_switch = document.getElementById(`Color_Switch`);
    const guide_switch = document.getElementById(`Guide_Switch`);
    const guideform = Array.from(document.getElementsByClassName(`guideform`));
    const options = document.forms.options;
    
    const Openallfile = document.getElementById(`Openallfile`);
    const centerguide = document.getElementById(`centerguide`);
    const deleteguide = document.getElementById(`deleteguide`);
    const savefile = Array.from(document.getElementById(`saveFile`));
    const event_on = document.getElementById(`Event_on`);
    const event_off = document.getElementById(`Event_off`);
    const presets = document.getElementById(`presets`);
    
    const crop = Array.from(document.forms.crop);//フォーム要素取得
    //const RGBnum = Array.from(document.forms.RGB);//フォーム要素取得 
    const color_value = Array.from(document.getElementsByClassName(`color_value`));
    const guidenum = Array.from(document.forms.guide);//フォーム要素取得  
    const register = document.getElementById(`register`);
    const content = document.getElementById(`content`);
    const compact_mode = document.getElementById(`compact_mode`);
    
    function set_event(flag){
        content.dataset.event = flag;
    }
    
    
    console.log(typeof content.dataset.event);
    function read_json(){
        const file_content = fs.readFileSync(json_path,`utf8`);
        const result = JSON.parse(file_content);
        console.log(result);
        return result;
    }
    
    read_json().forEach(v=>{
        console.log(v);
        make_select(v);
    });
    function make_select(obj){
        register.innerHTML += `<option value="${obj.name}">${obj.name}</option>`;
    }
    
    function write_file_disk(data){
        fs.writeFile(json_path,JSON.stringify(data,null,4),(err)=>{
           if(err){
               alert(err);
               return;
           }   
            let accumlate = ``;
             data.forEach((v,i)=>{//reducde構文は最初の値（0）を処理してくれないのでforEachで対応
                 accumlate += `<option value="${v.name}">${v.name}</option>`;
             });
            register.innerHTML = accumlate;
        });
    }
    
    
    
    
    guide_switch.addEventListener(`change`,disable_guide);
    function disable_guide(){
        let flag = true;
        let font_color = ``;
        if(guide_switch.checked){
            flag = ``;
            font_color = `white`;
        }
        guideform.forEach(v=>{
            v.disabled = flag; 
            v.style.color = font_color;    
        });
    }
    
    color_switch.addEventListener(`change`,disable_color);
    function disable_color(){
        const rgb_color = [`red`,`green`,`blue`];
        let flag = true;
        if(color_switch.checked){
            flag = ``;
        }
            color_value.forEach((v,i)=>{
                v.disabled = flag;
                if(color_switch.checked){
                    v.style.backgroundColor = rgb_color[i];
                    v.style.color = `white`;
                }else{
                    v.style.backgroundColor = ``;
                    v.style.color = ``;
                }
            });
    }
    
    class Register_event{
        constructor(){
            this.register = register;
            this.add_data = document.getElementById(`add_data`);
            this.delete = document.getElementById(`delete`);
            
            this.add_data.addEventListener(`click`,this.add_preset);
            this.delete.addEventListener(`click`,this.delete_data);
            this.register.addEventListener(`change`,this.change_preset);
        }
        
        add_preset(){
            this.name = document.getElementById(`name_preset`).value;
            console.log(this.name);
            if(this.name===null||this.name===undefined||this.name===``){
                alert(`empty in the text box`);
                return;
            }
            const json_list = read_json();
            const add_data = new Sent_data(false);
            add_data.get_data();
            delete add_data.elm;//elmプロパテが余計なので削除
            delete add_data.crop_event;
            add_data.name = this.name;
            document.getElementById(`name_preset`).value = ``;
            json_list.push(add_data);
            write_file_disk(json_list);
        }
        
        delete_data(){
            this.select_index = parseFloat(document.local_data.register.selectedIndex);
            console.log(this.select_index);
            const json_list = read_json();
            json_list.splice(this.select_index,1);
            console.log(json_list);
            write_file_disk(json_list);
        }
        
        change_preset(){
            this.select_index = parseFloat(document.local_data.register.selectedIndex);
            console.log(document.local_data.register.selectedIndex);
            const json_list = read_json();
            console.log(json_list[this.select_index]);
            const obj = json_list[this.select_index];
            
            guide_switch.checked = obj.guide_switch;
            document.forms.unit_type.unit.value = obj.unit;
            options.openAllFile.checked = obj.open_file;
            options.centerGuide.checked = obj.center_guide;
            options.deleteGuide.checked = obj.delete_guide;
            options.saveFile.checked = obj.save_file;
            
            color_switch.checked = obj.color_switch;
            color_value[0].value = parseFloat(obj.R);
            color_value[1].value = parseFloat(obj.G);
            color_value[2].value = parseFloat(obj.B);
            
            crop[0].value = parseFloat(obj.top);
            crop[1].value = parseFloat(obj.bottom);
            crop[2].value = parseFloat(obj.left);
            crop[3].value = parseFloat(obj.right);
            
            guidenum[1].value = parseFloat(obj.gh01);
            guidenum[2].value = parseFloat(obj.gh02);
            guidenum[3].value = parseFloat(obj.gv01);
            guidenum[4].value = parseFloat(obj.gh02);
            
            disable_guide();
            disable_color();
        }
    }
    const register_event = new Register_event();
    
    class Sent_data{
        constructor(elm){
            this.elm = elm;
            if(elm){
                document.getElementById(`Done`).addEventListener(`click`,this);
                document.getElementById(`compact_switch`).addEventListener(`click`,this);
                this.crop_event = false;
            }else{
                this.crop_event = true;//イベントか否かのフラグ
            }
            
        }
        
        get_data(){
            this.unit = document.forms.unit_type.unit.value;
            
            this.color_switch = color_switch.checked;
            this.guide_switch = guide_switch.checked;
            this.open_file = options.openAllFile.checked;
            this.center_guide = options.centerGuide.checked;
            this.delete_guide = options.deleteGuide.checked;
            this.save_file = options.saveFile.checked;
            this.R = color_value[0].value;
            this.G = color_value[1].value;
            this.B = color_value[2].value;
        
            this.top = crop[0].value;
            this.bottom = crop[1].value;
            this.left = crop[2].value;
            this.right = crop[3].value;
            
            this.gh01 = guidenum[1].value;
            this.gh02 = guidenum[2].value;
            this.gv01 = guidenum[3].value;
            this.gv02 = guidenum[4].value;
        }
        
        handleEvent(){
            this.get_data();
            
            const obj = this;
            console.log(obj);
            csInterface.evalScript(`begin_crop(${JSON.stringify(obj)})`);
        }
    }
    
    const done_button = new Sent_data(document.getElementById(`Done`));
    
    /*==============================Event dispatch==============================*/
    const event = new CSEvent();
    const PhotoshopCallbackUnique = function(){
            const event_button = new Sent_data(false);
            event_button.get_data();
            console.log(event_button);
            csInterface.evalScript(`begin_crop(${JSON.stringify(event_button)})`);
        }
    

    function dispatch_event(){
        event_on.disabled = true;
        event_off.disabled = false;
        csInterface.evalScript(`alert("dispatch crop event")`);
        csInterface.evalScript(`$.evalFile("${toJSX+crop_jsx}")`,(e)=>{
            event.data = e;
            event.type = `com.adobe.PhotoshopRegisterEvent`;
            event.scope = `APPLICATION`; 
            event.appId = csInterface.getApplicationID();
            event.extensionId = csInterface.getExtensionID();
            csInterface.dispatchEvent(event);
            console.log(event);
        });
        csInterface.addEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
        set_event(true);
    }
    event_on.addEventListener(`click`,dispatch_event);
    /*============================================================================*/
    
    event_off.addEventListener(`click`,()=>{
        csInterface.evalScript(`alert("Event off")`);
        event_on.disabled = false;
        event_off.disabled = true;
        csInterface.removeEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
        set_event(false);
    });
    
   
    class Compact_list{
        constructor(){
            this.compact = document.getElementById(`compact`);
            const spread = document.getElementById(`spread`).children[0];
            const RGB_list = document.getElementById(`color_list`).children[0];
            const option_flag = document.getElementById(`option_flag`).children[0];
            const addition_guide = document.getElementById(`addition_guide`).children[0];
            this.compact.addEventListener(`click`,()=>{
                console.log(content);
                const f = new Sent_data();
                f.get_data();
                const table_row = [RGB_list,spread,option_flag,addition_guide].map(v=>{
                    v.deleteRow(1);
                    const table_tr = v.insertRow(1);//テーブル情報を入れ替え
                    return table_tr;
                });
                const rows = compact_tables(f);
                rows.forEach((v,i)=>{
                    table_row[i].innerHTML = v;
                })
                
                content.style.display = `none`;
                compact_mode.style.display = `block`;
                document.getElementById(`JSON_data`).style.display = `none`;
                csInterface.resizeContent(190,200);
                
            });
            
            document.getElementById(`back_normal`).addEventListener(`click`,()=>{
                content.style.display = ``;
                compact_mode.style.display = `none`;
                csInterface.resizeContent(500,600);
            });
            
        }
        
    }
    
    
    const compact_list = new Compact_list();
    
    const in_json_menu = '<Menu> \
    <MenuItem Id="show_you" Label="Show preset" Enabled="true" Checked="false"/> \
    </Menu>';//プリセットモードへのメニュー
    
    const out_json_menu = '<Menu> \
    <MenuItem Id="out" Label="Back panel" Enabled="true" Checked="false"/> \
    </Menu>';//プリセットモードから元のパネルに戻るメニュー
    
    csInterface.setPanelFlyoutMenu(in_json_menu);
    function flyoutMenuClickedHandler(event){
        console.log(event);
        switch(event.data.menuId){
                case `show_you`:
                        //csInterface.requestOpenExtension( 'com.example.customCEPEvents.bill' ); 
                        const show_json = new Show_json();
                        show_json.make_list();
                        csInterface.setPanelFlyoutMenu(out_json_menu);
                        csInterface.resizeContent(800,500);
                break;
                
                case `out`:
                        content.style.display = ``;
                        document.getElementById(`JSON_data`).style.display = `none`;
                        csInterface.setPanelFlyoutMenu(in_json_menu);
                        csInterface.resizeContent(500,600);
                default:
        }
    }
    csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", flyoutMenuClickedHandler);
    
    class Show_json{
        constructor(){
            
        }
        
        make_list(){
            const data = read_json();
            turn_json_into_table(data);
            function turn_json_into_table(obj){
                let lists = top_list();
                obj.forEach(v=>{
                    lists += td_list(v);
                });
                
                document.getElementById(`preset_list`).innerHTML = lists;
                compact_mode.style.display = `none`;
                content.style.display = `none`;
                document.getElementById(`JSON_data`).style.display = `block`;
            }
        }
    }
    
    csInterface.addEventListener(`com.adobe.csxs.events.WindowVisibilityChanged`,(event)=>{//persistenceがonになっていないと作動しない
        if(!event.data){
            set_event(String(event.data));
            event_on.disabled = false;
            event_off.disabled = true;
            csInterface.removeEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
        }else if(content.dataset.event===`true`){
            csInterface.addEventListener(`com.adobe.PhotoshopJSONCallback`+extensionId,PhotoshopCallbackUnique);
        }
    });
}

