class Storage{
    constructor(sKey){
        this.sKey = sKey;
    }

    populateStorage(sValue){
        localStorage.setItem(this.sKey, JSON.stringify(sValue));
    }

    getStorage(){
        return JSON.parse(localStorage.getItem(this.sKey));
    }

    methodAttachment(variable, parent){
        variable.forEach(v => {
            Object.setPrototypeOf(v, parent.prototype);
        });
    }
}

export {Storage};