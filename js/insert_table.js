export function top_list(){
    const list = `<tr>
                    <th>name</th><th>unit</th><th>allfile</th><th>center guide</th><th>remove guide</th><th>save</th>
                    <th>top</th><th>bottom</th><th>left</th><th>right</th>
                    <th>add color</th><th>R</th><th>G</th><th>B</th>
                    <th>add guide</th><th>hori01</th><th>hori02</th><th>vert01</th><th>vert02</th>
                </tr>`;
    return list;
}

export function td_list(v){
    const td = `<tr>
            <td>${v.name}</td><td>${v.unit}</td><td>${flag_value(v.open_file)}</td><td>${flag_value(v.center_guide)}</td>
            <td>${flag_value(v.delete_guide)}</td><td>${flag_value(v.save_file)}</td><td>${v.top}</td><td>${v.bottom}</td>
            <td>${v.left}</td><td>${v.right}</td><td>${flag_value(v.color_switch)}</td><td>${v.R}</td><td>${v.G}</td><td>${v.B}</td>
            <td>${flag_value(v.guide_switch)}</td><td>${v.gh01}</td><td>${v.gh02}</td><td>${v.gv01}</td><td>${v.gv02}</td>
    </tr>`;
    return td;
}

export function compact_tables(f){
    const RGB = `<tr><td>${flag_value(f.color_switch)}</td><td>${f.R}</td><td>${f.G}</td><td>${f.B}</td></tr>`;
    const spread = `<tr><td>${f.top}</td><td>${f.bottom}</td><td>${f.left}</td><td>${f.right}</td></tr>`;
    const options = `<tr><td>${f.unit}</td><td>${flag_value(f.open_file)}</td><td>${flag_value(f.center_guide)}</td><td>${flag_value(f.delete_guide)}</td><td>${flag_value(f.save_file)}</td></tr>`;
    const guide = `<tr><td>${flag_value(f.guide_switch)}</td><td>${f.gh01}</td><td>${f.gh02}</td><td>${f.gh01}</td><td>${f.gh02}</td></tr>`;
    return [RGB,spread,options,guide];
}

function flag_value(flag){
    if(flag){
        return `ON`;
    }else{
        return `OFF`;
    }
}