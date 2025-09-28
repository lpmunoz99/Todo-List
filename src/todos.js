export default class Todo{
    constructor(title, description, dueDate, priority){
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}


//aqui vas a definir las tareas, en proyecto vas a asignarle un nombre, y poder anadir tareas, eliminarlas y modificarlas.