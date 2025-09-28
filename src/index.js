import "./style.css";
import { format, compareAsc } from "../node_modules/date-fns";
import todo from "./todos";
import {Project} from "./projects";
import {DOM} from "./dom";
import {Events} from "./events";
import { arMA } from "date-fns/locale";
import {Storage} from "./storage";

// Cache frequently used DOM elements
const projectDialog = document.querySelector(".new-project");
const projectName = document.getElementById("project-name");
const todoName = document.getElementById("todo-title");
const todoDesc = document.getElementById("todo-description");
const todoDate = document.getElementById("todo-duedate");
const todoPriority = document.getElementById("todo-priority");
const todoProject = document.getElementById("todo-project");
const todoDialog = document.querySelector(".todo-dialog");
const rightTop = document.querySelector(".right-top");      // cached
const rightBottom = document.querySelector(".right-bottom"); // cached
const projectsContent = document.querySelector(".projects-content"); // cached

let projects = [];
const projectStorage = new Storage("projects");
let loadProjects = projectStorage.getStorage();


if(projects.length === 0 && projectStorage.getStorage() === null){
    projects.push(new Project("Today"));
    projectStorage.populateStorage(projects);
    loadProjects = projectStorage.getStorage();
    projectStorage.methodAttachment(loadProjects, Project);
    projects = loadProjects;
    DOM.renderProjects(loadProjects);
}else if(projects.length === 0 && !(projectStorage.getStorage() === null)){
    loadProjects = projectStorage.getStorage();
    projectStorage.methodAttachment(loadProjects, Project);
    projects = loadProjects;
    DOM.renderProjects(loadProjects);
}

//Create new project and show project form
const addProject = new Events(document.querySelector(".add-project"), () => {
    projectDialog.showModal();
});

addProject.attachClick();

//Create project button
const createProject = new Events(document.querySelector(".project-submit"), (e) => {
    const projectForm = document.getElementById("project-form");

    if(!projectForm.checkValidity()){
        projectForm.reportValidity();
        return;
    }

    e.preventDefault();

    projects.push(new Project(projectName.value));
    projectStorage.populateStorage(projects);
    DOM.renderProjects(loadProjects);
    projectName.value = "";
    projectDialog.close();
});

createProject.attachClick();

//Close dialog button
const cancelProject = new Events(document.querySelector(".project-cancel"), () => {
    projectDialog.close();
    projectName.value = "";
});

cancelProject.attachClick();

//Function to get the index from the projects
function getProjectIndex(event){
    const projectElement = event.target.closest(".project");
    if (!projectElement) return -1;
    const parentId = projectElement.dataset.id;
    const index = projects.map(p => p.id).indexOf(parentId);
    return index;
}

let activeProjectIndex = null;

document.addEventListener("DOMContentLoaded", () => {

    // Event delegation for projectsContent
    const projectsHandler = new Events(projectsContent, (e) => {

        // --- Delete project ---
        const deleteProject = e.target.closest(".delete-project");
        if(deleteProject){
            const index = getProjectIndex(e);
            projects.splice(index,1);
            projectStorage.populateStorage(projects);
            DOM.renderProjects(loadProjects);
            return; // prevent further processing for this click
        }

        // --- Edit project ---
        const editProject = e.target.closest(".edit-project");
        if(editProject){
            const index = getProjectIndex(e);
            const projectId = projects[index].id;
            const projectDivs = document.querySelectorAll(".project");
            projectDivs.forEach(div => {
                if(div.dataset.id === projectId){
                    div.textContent = "";
                    const editInput = document.createElement("input");
                    editInput.type = "text";
                    editInput.value = projects[index].name;
                    editInput.maxLength = 15;
                    div.appendChild(editInput);

                    const btnsDiv = document.createElement("div");
                    btnsDiv.clyassName = "edit-btns";
                    div.appendChild(btnsDiv);

                    const cancelEdit = document.createElement("button");
                    cancelEdit.className = "cancel-edit";
                    cancelEdit.textContent = "Cancel";
                    cancelEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-thick</title>
                        <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                    </svg>`;
                    btnsDiv.appendChild(cancelEdit);
                    new Events(cancelEdit, () => DOM.renderProjects(loadProjects)).attachClick();

                    const saveEdit = document.createElement("button");
                    saveEdit.className = "save-edit";
                    saveEdit.textContent = "Save";
                    saveEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                    </svg>`;
                    btnsDiv.appendChild(saveEdit);
                    new Events(saveEdit, () => {
                        if(editInput.value !== ""){
                            projects[index].name = editInput.value;
                            projectStorage.populateStorage(projects);
                            DOM.renderProjects(loadProjects);
                        } else {
                            alert("Enter a valid name");
                        }
                    }).attachClick();
                }
            });
            return;
        }

        // --- Display project ---
        const projectText = e.target.closest(".project-text");
        if(projectText){
            const index = getProjectIndex(e);
            activeProjectIndex = index;

            rightTop.innerHTML = "";
            rightBottom.innerHTML = "";

            const topContainer = document.createElement("div");
            topContainer.className = "top-container";
            rightTop.appendChild(topContainer);

            const projectHeader = document.createElement("div");
            projectHeader.className = "project-header";
            projectHeader.textContent = projects[index].name;
            topContainer.appendChild(projectHeader);

            const addTask = document.createElement("button");
            addTask.className = "add-task";
            addTask.textContent = "Add To-do";
            topContainer.appendChild(addTask);

            DOM.renderTodos(loadProjects, index, rightBottom);
        }
    });
    projectsHandler.attachClick();

    // Event delegation for add-task
    const addTaskHandler = new Events(rightTop, (e) => {
        const addTaskBtn = e.target.closest(".add-task");
        if(addTaskBtn){
            // Populate project dropdown
            todoProject.innerHTML = ""; // clear previous options
            projects.forEach(optionTxt => {
                const option = document.createElement("option");
                option.value = optionTxt.name;
                option.textContent = optionTxt.name;
                todoProject.appendChild(option);
            });
            todoDialog.showModal();
        }
    });
    addTaskHandler.attachClick();
});

//Create todo button
const createTodo = new Events(document.querySelector(".todo-submit"), (e) => {
    const todoForm = document.getElementById("todo-form");

    if(!todoForm.checkValidity()){
        todoForm.reportValidity();
        return;
    }

    e.preventDefault();

    const projectHeader = document.querySelector(".project-header");
    const indexSelect = todoProject.selectedIndex;
    projects[indexSelect].addTodo(new todo (todoName.value, todoDesc.value, format(new Date(todoDate.value), "EEEE, MMMM d, yyyy"), todoPriority.value));
    projectStorage.populateStorage(projects);
    if(projectHeader.textContent === projects[indexSelect].name){
        rightBottom.innerHTML = "";
        DOM.renderTodos(loadProjects, indexSelect, rightBottom);
    }
    todoName.value = "";
    todoDesc.value = "";
    todoDate.value = "";
    todoPriority.value = "";
    todoProject.innerHTML = "";
    todoDialog.close();
});

createTodo.attachClick();

//Close dialog button
const cancelTodo = new Events(document.querySelector(".todo-cancel"), () => {
    todoDialog.close();
    todoName.value = "";
    todoDesc.value = "";
    todoDate.value = "";
    todoPriority.value = "";
    todoProject.innerHTML = "";
});

cancelTodo.attachClick();

//Delete or complete to-do logic
document.addEventListener("click", (e) => {
    const cardContainer = e.target.closest(".card-container");
    if (!cardContainer) return;
    const cardDataSet = cardContainer.dataset.id;
    const radioTodo = e.target.closest(".radio-todo");
    const deleteTodo = e.target.closest(".delete-todo");

    if (radioTodo || deleteTodo) {
        if (activeProjectIndex !== null) {
            const todoIndex = projects[activeProjectIndex].todos.findIndex(todo => todo.id === cardDataSet);
            projects[activeProjectIndex].removeTodo(todoIndex);
            projectStorage.populateStorage(projects);
        }
    }
});