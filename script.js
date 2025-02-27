let errorTable, symbolTable, Arm64Editor, consoleResult, dotStringCst = "";

$(document).ready(function () {
    Arm64Editor = editor('julia__editor', 'text/x-rustsrc');
    consoleResult = editor('console__result', '', false, true, false);
});

function editor(id, language, lineNumbers = true, readOnly = false, styleActiveLine = true) {
    return CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        styleActivateLine: true,
        matchBrackets: true,
        theme: "moxer",
        mode: "text/x-rustsrc"
    });
}

const openFile = async (editor) => {
    const {value: file} = await Swal.fire({
        title: 'Select File',
        input: 'file',

    })
    if (!file) return

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        editor.setValue(file);
    }
    reader.onerror = (e) => {
        console.log("Error to read file", e.target.error)
    }
    reader.readAsText(file)
}

const saveFile = async (fileName, extension, editor) => {
    if (!fileName) {
        const {value: name} = await Swal.fire({
            title: 'Enter File name',
            input: 'text',
            inputLabel: 'File name',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!'
                }
            }
        })
        fileName = name;
    }
    if (fileName) {
        download(`${fileName}.${extension}`, editor.getValue())
    }
}

const download = (name, content) => {
    let blob = new Blob([content], {type: 'text/plain;charset=utf-8'})
    let link = document.getElementById('download');
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", name)
    link.click()
}

const cleanEditor = (editor) => {
    editor.setValue("");
}

const analysis = async () => {
    const text = Arm64Editor.getValue();
    try {
        let resultado = FASE1.parse(text);
        consoleResult.setValue(resultado.toString());
    } catch (error) {
        consoleResult.setValue(error.message);
    }
}

const newDataTable = (id, columns, data) => {
    let result = $(id).DataTable({
        responsive: true,
        lengthMenu: [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "lengthChange": true,
        data,
        columns
    });
    $('select').formSelect();
    return result;
}

const btnOpen = document.getElementById('btn__open'),
    btnSave = document.getElementById('btn__save'),
    btnClean = document.getElementById('btn__clean'),
    btnShowCst = document.getElementById('btn__showCST'),
    btnAnalysis = document.getElementById('btn__analysis');

btnOpen.addEventListener('click', () => openFile(Arm64Editor));
btnSave.addEventListener('click', () => saveFile("file", "rs", Arm64Editor));
btnClean.addEventListener('click', () => cleanEditor(Arm64Editor));
// btnShowCst.addEventListener('click', () => localStorage.setItem("dot", dotStringCst));
btnAnalysis.addEventListener('click', () => analysis());

function easyTabs() {
	
    var groups = document.querySelectorAll('.t-container');
    
    //if t-container
    if (groups.length > 0) {

        for(i = 0; i < groups.length; i++){
            //tabs
            var tabs = groups[i].querySelectorAll('.t-tab');
            for(t = 0; t < tabs.length; t++){
                tabs[t].setAttribute("index", t+1);
                if(t==0)tabs[t].className="t-tab selected";
            }
            //contents
            var contents = groups[i].querySelectorAll('.t-content');
            for(c = 0; c < contents.length; c++){
                contents[c].setAttribute("index", c+1);
                if(c==0)contents[c].className="t-content selected";
            }
            if(tabs.length!=contents.length) alert('ERROR: \r\nEl número de elementos <li> y <div> de algún grupo de pestañas creado no es el correcto. Por favor, revísalo para corregir el error.');
        }
        
        //clicks
        var clicks = document.querySelectorAll('.t-tab');
        for(i = 0; i < clicks.length; i++){
            clicks[i].onclick = function() {
                //remove tab selected classes
                var tSiblings = this.parentElement.children;
                for(i = 0; i < tSiblings.length; i++){
                    tSiblings[i].className="t-tab";
                }
                //add tab selected class
                this.className="t-tab selected";
                var idx = this.getAttribute("index"); 
                if(idx==5)document.getElementById('t-multiple').className='t-container showit';
                else 
                    if(this.parentElement.parentElement.getAttribute('id')=='t-principal')document.getElementById('t-multiple').className='t-container';
                // selected content
                var cSiblings = this.parentElement.parentElement.querySelectorAll('.t-content');
                for(i = 0; i < cSiblings.length; i++){
                    //remove content selected classes
                    cSiblings[i].className="t-content";
                    //add content selected classes					
                    if(cSiblings[i].getAttribute("index")==idx){
                        cSiblings[i].className="t-content selected";
                    }
                }					
            };
        }
    
    }
}

(function() { 
    easyTabs() ;
})();