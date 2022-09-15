let text__area = document.querySelector('.text__area');
let infoCharacter = document.querySelector('.infoCharacter');
let btnAdd = document.querySelector('.addNote');
let inputTitle = document.querySelector('.inputTitle');
let wrapper__result = document.querySelector('.wrapper__result');
let ediEls = false;
let editBtn = document.querySelector('.editBtn')
text__area.addEventListener('keydown',() => {
  let hasil = text__area.value;
  let angka = 1000
  infoCharacter.innerHTML = hasil.length + ` / ${angka} charackters`;
});

btnAdd.addEventListener('click',(e) => {
  e.preventDefault();
  showElement.createEl(e)
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
window.addEventListener('DOMContentLoaded',() => {
  let resultTheObj = storeLocal.getNotesLocal();
  resultTheObj.forEach((itemObj) => {
    resultObj.createEls(itemObj)
  })
});
class showElement{
  static createEl(data){
    let emptyValue = inputTitle.value;
    let text__areaEmpty = text__area.value;
    // date now
    let dates = new Date()
    let day = dates.getDate() ;
    let month = ("0" + (dates.getMonth() + 1));
    let year = dates.getFullYear();
    // date time
    let seconds = dates.getSeconds() < 10 ? "0" + dates.getSeconds() : dates.getSeconds();
    let minutes = dates.getMinutes() < 10 ? "0" + dates.getMinutes() : dates.getMinutes();
    let hours = dates.getHours() < 10 ? "0" + dates.getHours() : dates.getHours(); 
    let dateFull = `${day}/${month}/${year}`
    let timeFull = `${hours}:${minutes}:${seconds}`;
    if(!emptyValue || !text__areaEmpty){
      window.alert('Mohon isi form, jangan kosong!!')
    }else{
       let getId = () => {
        return Math.floor(Math.random() * 1000);
       }
        let objResult = new createObj(inputTitle.value,text__area.value,getId(),timeFull,dateFull);
        storeLocal.saveNotesLocal(objResult);
        resultObj.clearInput();
        resultObj.createEls(objResult)
    }
  }
}
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
      let  targetId = e.target.parentElement.parentElement;
      let currentValueTitle = targetId.childNodes[1].childNodes[3].textContent
      let currentValueContent = targetId.childNodes[3].textContent;
      inputTitle.value = currentValueTitle;
      text__area.value = currentValueContent;
      ediEls = true;
      btnAdd.style.display = "none";
      editBtn.style.display = "block";
      editBtn.addEventListener('click',(e) => {
        e.preventDefault();
        if(ediEls && targetId){
          let valueNew = inputTitle.value;
          let contentNew = text__area.value;
          let getLocal = storeLocal.getNotesLocal();
          let valueNewObj =  getLocal.map((itemnew) => {
            if(itemnew.id === parseInt(targetId.id)){
              itemnew.title = valueNew;
              itemnew.content = contentNew;
            }
            return itemnew
          });
          localStorage.setItem("notes",JSON.stringify(valueNewObj))
          targetId.children[0].children[1].innerHTML = valueNew;
          targetId.children[1].innerHTML = contentNew;
          location.reload();
          window.alert('Your list hasbeen update')
          resetEl();
          return
        }
      })
    }
  }
}
function resetEl(){
  inputTitle.value = ""
  text__area.value = ""
  btnAdd.style.display = "block";
  editBtn.style.display = "none";
  ediEls = false;
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
    notes.splice(notes.indexOf(targetIndex),1);
    localStorage.setItem("notes",JSON.stringify(notes));
  }
}
