(function() {
    let arrowJob = [],
        listName = '';

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form'),
            input = document.createElement('input'),
            buttonWrapper = document.createElement('div'),
            button = document.createElement('button');
          
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function(e) {
            e.preventDefault();
            if (input.value.length > 0) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }      

    function createTodoItem(job) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = job.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (job.done == true) {
            item.classList.add('list-group-item-success')
        }

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            arrowJob.forEach(function(item) {
                if (item.id == job.id) {
                    item.done = !item.done;
                    saveToLocalStorage(arrowJob, listName);
                    console.log(arrowJob);
                }
            })
        });

        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();
                arrowJob = arrowJob.filter(function(item) {
                    return item.id !== job.id;
                });
                saveToLocalStorage(arrowJob, listName);
                console.log(arrowJob);
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        };
    } 

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) {
                max = item.id
            }
        }
        return max + 1;
    }

    function saveToLocalStorage(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName, defaultArr = []) {
        const todoAppTitle = createAppTitle(title);                                
        const todoItemForm = createTodoItemForm();  
        const todoList = createTodoList();         
        
        listName = keyName;
        arrowJob = defaultArr;

        container.append(todoAppTitle);                   
        container.append(todoItemForm.form);               
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        
        if (localData !== null && localData !== '') {
            arrowJob = JSON.parse(localData);
        }

        for (const itemList of arrowJob) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);  
        }
        
        todoItemForm.form.addEventListener('submit', function(e) {              
            e.preventDefault();                                                 
            
            if (!todoItemForm.input.value) {                                    
                return;
            }

            let newItem = {
                id: getNewID(arrowJob),
                name: todoItemForm.input.value,
                done: false
            }
            
            let todoItem = createTodoItem(newItem);

            arrowJob.push(newItem);
            console.log(arrowJob);
            saveToLocalStorage(arrowJob, listName);
            
            todoList.append(todoItem.item);                                    
            todoItemForm.input.value = '';                                      
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;

})();