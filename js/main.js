// Находим элементы страницы
const form = document.querySelector('#form');
// Обращаемся к инпуту
const taskInput = document.querySelector('#taskInput');  
// Обращаемся к родителю новой задачи в которой он будет находиться
const tasksList = document.querySelector('#tasksList');
// Удаляем фразу список пуст (точнее ссылаемся для начала)
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
	// Преобразуем строку в объект
	// И передаем все данные опять в массив
	tasks = JSON.parse(localStorage.getItem('tasks'));
	// перебираем каждый элемент в таскс для вывода
	tasks.forEach((task) => renderTask(task));
}

		
checkEmptyList();

// Отслеживания отправки значения инпут
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', completeTask)




function addTask(e){
	e.preventDefault();

	// Достаем текст задачи из инпута
	const taskText = taskInput.value;


	// Описываем задачу в виде объекта
	const newTask = {
		// Айди в милисекундах для придания задачам уникальности
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// push добавляет элемент в конец массива()
	tasks.push(newTask)

	saveToLocalStorage();
	
	 renderTask(newTask);
	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value	= '';
	taskInput.focus();
	checkEmptyList();
	
	
}

// Реализуем при помощи нажатия на кнопку(при этом в css для img надо прописать свойство pointer-events:none;)

function deleteTask	(e) {

	// Проверяем на какой элемент кликнули и если это нужный нам атрибут, то выполняем функцию
	//датасет нужен для распознования атрибута дата и после точки идет его категория
	if(e.target.dataset.action !== 'delete')return;
		
		// Ищет ближайшего родителя (closest)
		const parentNode = e.target.closest('.list-group-item');

		// Опредяем id задачи
		const id = Number(parentNode.id);

		// // Находим индекс задачи в массиве
		// const index = tasks.findIndex((task) => task.id === id);
		
		// // Удаляем задачу из массива(1смотрит на индекс,2 количество удаляемых элементов)
		// tasks.splice(index,1);

		// Фильтрует каждый элемент массива, и у которых вернет true , попадут в новый массив
		tasks = tasks.filter((task) => task.id !== id);

		saveToLocalStorage();
		parentNode.remove();
		checkEmptyList();
		
		
	
	// Проверка на количество элементов в списке, если нету то фраза список пуст появляется
	
}

function completeTask(e) {

	// Проверяем на какой элемент кликнули и если это нужный нам атрибут, то выполняем функцию
	//датасет нужен для распознования атрибута дата и после точки идет его категория
	if(e.target.dataset.action !== 'done') return;

		// Ищем родителя кнопки done
		const parentNode = e.target.closest('.list-group-item');
		
		// Id задачи
		const id = Number(parentNode.id); 


		const task = tasks.find((task) => task.id === id);
			
				
		

		// Меняет значение тру на фолс или наоборот, работает как тогл(нужно если мы 2 раза нажали на галочку)
		task.done = !task.done;

		saveToLocalStorage();
		// Найдя родителя ищем в нем тег спан с класом таск тайтл(чтобы придать нужные стили задачи)
		const taskTitle = parentNode.querySelector('.task-title');

		// Добавляем класс для задачи, при ее выполнении и удаляем при повтором нажатии
		taskTitle.classList.toggle('task-title--done'); 
	}
	
// Проверка на наличие элементов в массиве, при отсутсвии появляется фраза Список пуст
function checkEmptyList() {

	if(tasks.length === 0){
	const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
	<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
	<div class="empty-list__title">Список дел пуст</div>
	</li>`; 
	tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}
	if(tasks.length > 0){
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}



function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))

}
// Рендерит задачи
function renderTask(task) {
	const cssClass = task.done ? "task-title task-title--done": "task-title";

	// Формируем разметку для новой задачи
	const taskHTML = `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Добавляем задачку на страницу(данное свойство позволяет работать с html, beforeend ставит задачу в конец)
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}