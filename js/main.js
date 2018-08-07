'use strict';

var gTodos;
var gTodosFilter = 'All';



var TODOS_KEY = 'todosApp'

function init() {
    console.log('Todo App');
    gTodos = createTodos();
    renderCounts();
    renderTodos();
}

function todoClicked(elTodo, todoIdx) {
    //debugger;
    gTodos[todoIdx].isDone = !gTodos[todoIdx].isDone;
    elTodo.classList.toggle('done');
    renderCounts();
    saveToStorage(TODOS_KEY, gTodos);
}

function deleteTodo(ev, todoId) {
    // debugger;
    ev.stopPropagation();
    var todoIdx = -1;
    gTodos.forEach(function (todo, idx) {
        if (todo.id === todoId) todoIdx = idx
    })

    console.log('Deleting Todo', todoId);
    if (todoIdx != -1) {
        gTodos.splice(todoIdx, 1);
    }
    renderTodos();
    renderCounts();
    saveToStorage(TODOS_KEY, gTodos);

}


function addTodo() {
    // console.log('Add Todo');
    //debugger;
    var todoTxt = askForTodo();
    if (todoTxt === null) return;
    var importanceNum = askForImportance();
    if (importanceNum === null) return;
    var newTodo = createTodo(todoTxt, importanceNum);
    gTodos.unshift(newTodo);
    renderCounts();
    document.querySelector('.status-filter').value = 'All';
    gTodosFilter = 'All';
    renderTodos();
    saveToStorage(TODOS_KEY, gTodos);

}


function setFilter(strFilter) {
    gTodosFilter = strFilter;
    renderTodos();
}


function todosSort(sortPref) {

    switch (sortPref) {
        case 'Text':
            setPrefTxt()
            break;
        case 'Created':
            setPrefCreated();
            break;
        case 'Importance':
            setPrefImportance();
            break;

    }

}


function setPrefTxt() {
    gTodos.sort(function (a, b) {
        if (a.txt.toLowerCase() < b.txt.toLowerCase()) return -1;
        if (a.txt.toLowerCase() > b.txt.toLowerCase()) return 1;
        return 0;
    })
    renderTodos();
    return gTodos;
}

function setPrefCreated() {
    gTodos.sort(function (a, b) {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    })
    renderTodos();
    return gTodos;
}

function setPrefImportance() {
    gTodos.sort(function (a, b) {
        if (a.importance < b.importance) return -1;
        if (a.importance > b.importance) return 1;
        return 0;
    })
    renderTodos();
    return gTodos;
}


function askForImportance() {
    var importanceNum = prompt('What is level of importance 1-3?..');
    if (importanceNum === null) return importanceNum;
    while (!isImportanceValid(importanceNum) || !isImportanceValid === null) {
        alert('You must fill a number between 1 to 3!');
        importanceNum = prompt('What is level of importance 1-3?..');
    }
    return importanceNum;
}


function askForTodo() {
    var todoTxt = prompt('What do you want todo?..');
    if (todoTxt === null) return todoTxt;
    while (!isTodoTxtValid(todoTxt)) {
        alert('You must fill a to do in order to add it to the list!');
        todoTxt = prompt('What do you want todo?..');
    }
    return todoTxt;
}

function isTodoTxtValid(txt) {
    var isTxtValid = true;
    if (txt == '') isTxtValid = false;
    return isTxtValid;
}

function isImportanceValid(num) {
    if (num === 0) return num;
    var isImportanceValid = true;
    if (num < 1 || num > 3 || isNaN(num)) {
        isImportanceValid = false;
    }
    return isImportanceValid;
}



function renderTodos() {
    var strHTML = ''
    var todos = getTodosForDisplay();
    todos.forEach(function (todo, todoId) {
        var className = (todo.isDone) ? 'done' : '';
        strHTML +=
            `
            <li class="todo ${className}" onclick="todoClicked(this, ${todo.id})">
                ${todo.txt}
                <div class="btns">  
                <button class="btn btn-up" onclick="moveTodoUp(event,${todo.id})">△</button>
                <button class="btn btn-down" onclick="moveTodoDown(event,${todo.id})">▽</button>
                <button class="btn btn-danger" onclick="deleteTodo(event, ${todo.id})">x</button>        
                </div>  
            </li>
            `
    })
    document.querySelector('.todos').innerHTML = strHTML;
    getArrowsDisplay();
    if (todos.length === 0) {
        displayFilterEmpty(gTodosFilter);
    } else {
        var message = document.querySelector('.no-todos-msg');
        message.innerText = '';
    }
}



function createTodos() {
    var todos = loadFromStorage(TODOS_KEY);
    if (todos) return todos;
    todos = [];
    todos.push(createTodo('Learn Javascript'))
    todos.push(createTodo('Play with HTML5'))
    todos.push(createTodo('Master CSS'))
    return todos;
}

function createTodo(txt, importanceNum) {
    return {
        id: Math.floor(Math.random() * 90000) + 10000,
        txt: txt,
        isDone: false,
        createdAt: Date.now(),
        importance: importanceNum
    }
}

function renderCounts() {
    var activeCount = 0;
    gTodos.forEach(function (todo) {
        if (!todo.isDone) activeCount++;
    })

    document.querySelector('.total-count').innerText = gTodos.length;
    document.querySelector('.active-count').innerText = activeCount;
}


function getArrowsDisplay() {
    debugger;
    var arrowUp = document.querySelectorAll('.btn-up')
    var arrowDown = document.querySelectorAll('.btn-down')
    if (gTodosFilter === 'All') {
        arrowUp[0].style.display = 'none';
        arrowDown[arrowDown.length - 1].style.display = 'none';
    }
}



function getTodosForDisplay() {
    var todos = [];
    gTodos.forEach(function (todo) {
        if ((gTodosFilter === 'All') ||
            (gTodosFilter === 'Active' && !todo.isDone) ||
            (gTodosFilter === 'Done' && todo.isDone)) {
            todos.push(todo);
        }

    });

    return todos;
}

function moveTodoUp(ev, todoId) {
    ev.stopPropagation();
    for (var i = 0; i < gTodos.length; i++) {
        if (gTodos[i].id === todoId && gTodos[i] != gTodos[0]) {
            var temp = gTodos[i - 1];
            gTodos[i - 1] = gTodos[i];
            gTodos[i] = temp;
            break;
        }
    }
    renderTodos();
    saveToStorage(TODOS_KEY, gTodos);
}

function moveTodoDown(ev, todoId) {
    ev.stopPropagation();
    for (var i = 0; i < gTodos.length; i++) {
        if (gTodos[i].id === todoId && gTodos[i] != gTodos[gTodos.length - 1]) {
            var temp = gTodos[i + 1];
            gTodos[i + 1] = gTodos[i];
            gTodos[i] = temp;
            break;
        }
    }
    renderTodos();
    saveToStorage(TODOS_KEY, gTodos);
}


function displayFilterEmpty(filter) {
    if (gTodosFilter === 'All') {
        var message = document.querySelector('.no-todos-msg');
        message.innerText = 'No Todos To Display!';
    } else {
        var message = document.querySelector('.no-todos-msg');
        message.innerText = 'No ' + gTodosFilter + ' Todos To Display!';
    }
}





//TO ASK
// function getArrowsDisplay() {
//     debugger;

//     var arrowUp = document.querySelector('.btn-up')
//     var arrowDown = document.querySelector('.btn-down')
//     if (gTodosFilter === 'All') {
//         gTodos.forEach(function (todo) {
//             if (todo === gTodos[0]) {
//                 arrowUp.style.display = 'none';
//             } else if (todo === gTodos[gTodos.length - 1])
//             arrowDown.style.display = 'none';
//         });

//     }

// }