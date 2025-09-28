import {Events} from "./events";

class DOM{
    static renderProjects(projects){
        const projectsContainer = document.querySelector(".projects-content");
        projectsContainer.textContent = "";
        projects.forEach((project, index) => {
            const div = document.createElement("div");
            div.className = "project";
            div.dataset.id = project.id;
            projectsContainer.appendChild(div);
            const projectText = document.createElement("div");
            projectText.className = "project-text";
            projectText.textContent = project.name;
            div.appendChild(projectText);
            const btnsContainer = document.createElement("div");
            btnsContainer.className = "btns-container";
            div.appendChild(btnsContainer);
            if(!(index === 0)){
                const deleteButton = document.createElement('button');
                deleteButton.className = "delete-project";
                deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>`;
                const editButton = document.createElement('button');
                editButton.className = "edit-project";
                editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>square-edit-outline</title>
                <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
                </svg>`;
                btnsContainer.appendChild(editButton);
                btnsContainer.appendChild(deleteButton);
            }
        });
    }

    static renderTodos(projects, indexDisplay, div){
        projects[indexDisplay].todos.forEach(t => {
            const cardContainer = document.createElement("div");
            cardContainer.className = "card-container";
            cardContainer.dataset.id = t.id;
            div.appendChild(cardContainer);
            const customRadio = document.createElement("label");
            customRadio.className = "custom-radio";
            cardContainer.appendChild(customRadio);
            const radioTodo = document.createElement("input");
            radioTodo.className = "radio-todo";
            radioTodo.type = "radio";
            customRadio.appendChild(radioTodo);
            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            customRadio.appendChild(checkmark);
            new Events(radioTodo, () => {
                setTimeout(() => {
                    div.removeChild(cardContainer);
                }, 400);
            }).attachClick();
            const todoCard = document.createElement("div");
            todoCard.className = "todo-card priority-" + t.priority;
            cardContainer.appendChild(todoCard);
            const cardHeader = document.createElement("div");
            cardHeader.className = "card-header";
            todoCard.appendChild(cardHeader);
            const todoName = document.createElement("h2");
            todoName.className = "todo-name";
            todoName.textContent = t.title;
            cardHeader.appendChild(todoName);
            const deleteTodo = document.createElement("button");
            deleteTodo.className = "delete-todo";
            deleteTodo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
            </svg>`;
            cardHeader.appendChild(deleteTodo);
            new Events(deleteTodo, () => {
                div.removeChild(cardContainer);
            }).attachClick();
            const todoDesc = document.createElement("div");
            todoDesc.className = "todo-desc";
            todoDesc.textContent = t.description;
            todoCard.appendChild(todoDesc);
            const todoDate = document.createElement("div");
            todoDate.className = "todo-date";
            todoDate.textContent = "Due on: " + t.dueDate;
            todoCard.appendChild(todoDate);
        })
    }
}

export {DOM};