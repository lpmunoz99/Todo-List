class Events{
    constructor(element, action){
        this.element = element;
        this.action = action;
    }

    attachClick(){
        if(this.element instanceof NodeList || Array.isArray(this.element)){
            this.element.forEach((el) => {
                el.addEventListener('click', this.action);
            });
        }else{
            this.element.addEventListener('click', this.action);
        }
    }
}

export {Events};