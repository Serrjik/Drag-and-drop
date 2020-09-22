// Элементы, которые можно перетаскивать.
const dragItems = document.querySelectorAll('.dragItem')
// Зоны, на которые можно перетаскивать.
const dropZones = document.querySelectorAll('.dropZone')

// Перетаскиваемый элемент.
let draggedItem = null
// Элемент, над которым отпускаем, если он такой же, как и отпускаемый.
let droppedItem = null

dragItems.forEach(dragItem => {
	/*
	Вешаем обработчик начала перетаскивания на элементы,
	которые можно перетаскивать.
	*/
	dragItem.addEventListener('dragstart', handlerDragstart)

	/*
	Вешаем обработчик завершения перетаскивания на элементы,
	которые можно перетаскивать.
	*/
	dragItem.addEventListener('dragend', handlerDragend)

	/*
	Вешаем обработчик, который запускается при перемещении элемента или
	выделенного текста на элементы, которые можно перетаскивать.
	*/
	dragItem.addEventListener('drag', handlerDrag)

	/*
	Вешаем обработчик попадания перетаскиваемого элемента на зоны,
	на элементы, которые можно перетаскивать.
	*/
	dragItem.addEventListener('dragenter', () => {
		// Если элемент проводится НЕ над самим собой:
		if (draggedItem !== droppedItem) {
			// Запомним элемент, над которым можем отпустить.
			droppedItem = dragItem
		}
	})

	/*
	Вешаем обработчик выхода перетаскиваемого элемента за пределы элементов
	на которые можно перетаскивать.
	*/
	dragItem.addEventListener('dragleave', () => {
		droppedItem = null
	})
})

dropZones.forEach(dropZone => {
	/*
	Вешаем обработчик попадания перетаскиваемого элемента на зоны,
	на которые можно перетаскивать.
	*/
	dropZone.addEventListener('dragenter', handlerDragenter)

	/*
	Вешаем обработчик выхода перетаскиваемого элемента за пределы зон,
	на которые можно перетаскивать.
	*/
	dropZone.addEventListener('dragleave', handlerDragleave)

	/*
	Вешаем обработчик нахождения перетаскиваемого элемента над зонами,
	на которые можно перетаскивать.
	*/
	dropZone.addEventListener('dragover', handlerDragover)

	/*
	Вешаем обработчик "сбрасывания" перетаскиваемого элемента над зонами,
	на которые можно перетаскивать.
	*/
	dropZone.addEventListener('drop', handlerDrop)
})

// Обработчик начала перетаскивания.
function handlerDragstart (event) {
	// Установим перетаскиваемый элемент.
	draggedItem = this
	// Выделяем перетаскиваемый элемент.
	this.classList.add('dragItem--active')
}

// Обработчик завершения перетаскивания.
function handlerDragend (event) {
	// Возвращаем обычный вид перетаскиваемому элементу.
	this.classList.remove('dragItem--active')

	// Очистим перетаскиваемый элемент.
	draggedItem = null
}

/*
Обработчик, который запускается при перемещении элемента
или выделенного текста.
*/
function handlerDrag (event) {}

/*
Обработчик попадания перетаскиваемого элемента на зоны,
на которые можно перетаскивать.
*/
function handlerDragenter (event) {
	/*
	Отменяем стандартную обработку события,
	чтобы дать возможность стработать событию drop.
	*/
	event.preventDefault()
	// Выделяем зону, на которую попал перетаскиваемый элемент.
	this.classList.add('dropZone--active')
}

/*
Обработчик выхода перетаскиваемого элемента за пределы зон,
на которые можно перетаскивать.
*/
function handlerDragleave (event) {
	// Если элемент покидает зону своего родителя:
	if (event.target === this && !droppedItem) {
		// Возвращаем обычный вид зоне, с которой вышел перетаскиваемый элемент.
		this.classList.remove('dropZone--active')
	}

	event.stopPropagation()
}

/*
Обработчик нахождения перетаскиваемого элемента над зонами,
на которые можно перетаскивать.
*/
function handlerDragover (event) {
	/*
	Отменяем стандартную обработку события,
	чтобы дать возможность стработать событию drop.
	*/
	event.preventDefault()
}

/*
Обработчик "сбрасывания" перетаскиваемого элемента над зонами,
на которые можно перетаскивать.
*/
function handlerDrop (event) {
	// Если есть элемент, над которым отпускаем:
	if (droppedItem) {
		/*
		Если сбрасываемый элемент и элемент, над которым происходит
		сбрасывание являются дочерними элементами одного и того же элемента:
		*/
		if (droppedItem.parentElement === draggedItem.parentElement) {
			// Узнать очерёдность этих элементов в одной зоне.
			/*
				Дочерние элементы родителя элемента,
				над которым происходит сбрасывание.
			*/
			const children = Array.from(droppedItem.parentElement.children)
			const draggedIndex = children.indexOf(draggedItem)
			const droppedIndex = children.indexOf(droppedItem)

			if (draggedIndex > droppedIndex) {
				// Вставить элемент перед тем, над которым сбросили.
				draggedItem.parentElement.insertBefore(draggedItem, droppedItem)
			}

			else {
				// Вставить элемент следом за тем, над которым сбросили.
				draggedItem.parentElement.insertBefore(
					draggedItem,
					droppedItem.nextElementSibling
				)
			}
		}

		/*
		Если сбрасываемый элемент и элемент, над которым происходит
		сбрасывание являются дочерними элементами РАЗНЫХ родителей:
		*/
		else {
			this.insertBefore(draggedItem, droppedItem)
		}
	}

	else {
		// Вставляем сброшенный элемент в зону, над которой сбросили.
		this.append(draggedItem)
	}

	// Возвращаем обычный вид всем зонам, в которые могут упасть элементы.
	dropZones.forEach(x => x.classList.remove('dropZone--active'))
}
