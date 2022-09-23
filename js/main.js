let text__area = document.querySelector('.text__area');
let infoCharacter = document.querySelector('.infoCharacter');
let btnAdd = document.querySelector('.addNote');
let inputTitle = document.querySelector('.inputTitle');
let formSubmit = document.querySelector('.form');
let elementSave = null;
let wrapper__result = document.querySelector('.wrapper__result');
let getIdEls;
window.addEventListener('DOMContentLoaded',() => {
  let resultTheObj = storeLocal.getNotesLocal();
  resultTheObj.forEach((itemObj) => {
    resultObj.createEls(itemObj)
  })
});

class createObj{
  constructor(title,textArea,id,timeFull,dateFull){
    this.id = id
    this.title = title;
    this.content = textArea;
    this.timeFull = timeFull;
    this.dateFull = dateFull;
  }
}
text__area.addEventListener('keydown',() => {
  let hasil = text__area.value;
  let angka = 1000
  infoCharacter.innerHTML = hasil.length + ` / ${angka} charackters`;
});

formSubmit.addEventListener('submit',(e) => {
  e.preventDefault();
  let emptyValue = inputTitle.value;
  let text__areaEmpty = text__area.value;
  if(!emptyValue || !text__areaEmpty){
    window.alert('Mohon isi form, jangan kosong!!')
  }else{
    // date now
    let dates = new Date()
    let day = dates.getDate() ;
    let month = ("0" + (dates.getMonth() + 1));
    let year = dates.getFullYear();
    // date timev
    let seconds = dates.getSeconds() < 10 ? "0" + dates.getSeconds() : dates.getSeconds();
    let minutes = dates.getMinutes() < 10 ? "0" + dates.getMinutes() : dates.getMinutes();
    let hours = dates.getHours() < 10 ? "0" + dates.getHours() : dates.getHours(); 
    let dateFull = `${day}/${month}/${year}`
    let timeFull = `${hours}:${minutes}:${seconds}`;
    let getId = () => {
      return Math.floor(Math.random() * 1000);
    }
    let objResult = new createObj(inputTitle.value,text__area.value,getId(),timeFull,dateFull);
    if(elementSave === null){
        resultObj.createEls(objResult);
        storeLocal.saveNotesLocal(objResult)
        inputTitle.value = "";
        text__area.value = "";
     }else{
        resultObj.editNotes(objResult)
        elementSave = null;
    }
  }
});
wrapper__result.addEventListener('click',(e) => {
  resultObj.deleteResult(e);
  resultObj.editResult(e);
})

class resultObj{
  static clearInput(){
    inputTitle.value = "";
    text__area.value = "";
  }
  static createEls(data){
    let resultNotes = document.createElement('div');
    resultNotes.classList = "resultNotes";
    let dataSet = document.createAttribute('id');
    dataSet.value = `${data.id}`;
    resultNotes.setAttributeNode(dataSet)
    resultNotes.innerHTML = ` <div class="titleNotes">
                                <div class="dates">
                                  <div class="dateTime">${data.timeFull}</div>
                                  <div class="dateFull">${data.dateFull}</div>
                                </div>
                                <h3 class="title">${data.title}</h3>
                             </div>
                             <div class="contentNotes">${data.content}</div>
                             <div class="container__btn">
                              <button class="edit"><i class="fa-solid fa-pencil"></i></button>
                              <button class="delete"><i class="fa-solid fa-trash"></i></button>
                             </div>

  `
  wrapper__result.appendChild(resultNotes);
}
  static deleteResult(data){
      if(data.target.classList.contains('delete')){
        let targetRemove = data.target.parentElement.parentElement;
        targetRemove.remove();
        storeLocal.deleteNotesLocal(targetRemove);
      }
  }
  static editResult(e){
    if(e.target.classList.contains('edit')){
        elementSave = e.target.parentElement.parentElement;
        getIdEls = parseInt(elementSave.id)
        inputTitle.value = elementSave.children[0].children[1].textContent;
        text__area.value = elementSave.children[1].textContent;
        btnAdd.innerHTML = "Edit";
    }else null
  }
  static editNotes(){
    let getObj = storeLocal.getNotesLocal();
    let updateObj =  getObj.map((itemUpdate) => {
      if(itemUpdate.id === getIdEls){
        itemUpdate.title = inputTitle.value;
        itemUpdate.content = text__area.value;
      }
      return itemUpdate
    });

    localStorage.setItem('notes',JSON.stringify(updateObj))
    elementSave.children[0].children[1].innerHTML = inputTitle.value;
    elementSave.children[1].innerHTML = text__area.value;
    btnAdd.innerHTML = "Add Note"
    inputTitle.value = "";
    text__area.value = "";
  }
}
class storeLocal{
  static saveNotesLocal(data){
    let notes;
    if(localStorage.getItem("notes") === null){
        notes = [];
    }else{
      notes = JSON.parse(localStorage.getItem("notes"))
    }
    notes.push(data);
    localStorage.setItem("notes",JSON.stringify(notes))
  }
  static getNotesLocal(){
    let notes;
    if(localStorage.getItem("notes") === null){
      notes = []
    }else{
      notes = JSON.parse(localStorage.getItem("notes"))
    }
    return notes;
  }
  static deleteNotesLocal(data){
    let notes;
    if(localStorage.getItem("notes") === null){
      notes = []
    }else{
      notes = JSON.parse(localStorage.getItem('notes'));
    }
    let targetIndex = data.children[0].children[1].innerText;
    let hasil =  notes.findIndex((itemIndex) => {
          return itemIndex.title === targetIndex
    });
    notes.splice(hasil,1);
    localStorage.setItem('notes',JSON.stringify(notes))
  }
}
