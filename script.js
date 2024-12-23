let myLibrary = [];
const content = document.querySelector('.content');

// Modal elements
const addBtn = document.querySelector('.add-btn');
const modal = document.querySelector('dialog');
const form = document.querySelector('.modal-form');
const closeBtn = document.querySelector('.close-btn');

const deleteBtn = document.querySelector('.delete-btn');

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = makeId(6);
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);

    return myLibrary.push(book);
}

function displayLibrary() {
    myLibrary.forEach((book) => {
        displayBook(book);
    })
}

function displayBook(book) {
    const bookElement = convertBookToHTML(book);
    content.appendChild(bookElement);
}

function convertBookToHTML(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

    const input = document.createElement('input');
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", `${book.id}`);
    bookElement.appendChild(input);

    const name = document.createElement('div');
    name.classList.add('name');
    
    const bookTitle = document.createElement('h2');
    bookTitle.classList.add('title');
    bookTitle.innerText = `${book.title}`;
    name.appendChild(bookTitle);

    const bookAuthor = document.createElement('div');
    bookAuthor.classList.add('author');
    bookAuthor.innerText = `${book.author}`;
    name.appendChild(bookAuthor);
    
    bookElement.appendChild(name);

    const bookPages = document.createElement('div');
    bookPages.classList.add('pages');
    bookPages.innerText = `${book.pages} pages`;
    bookElement.appendChild(bookPages);

    const bookStatus = document.createElement('div');
    bookStatus.classList.add('status');
    bookStatus.innerHTML = book.read ? 
        'read <img class="icon" src="media/icons/book-close.svg">' :
        'not read yet <img class="icon" src="media/icons/book-open.svg">';
    bookElement.appendChild(bookStatus);

    return bookElement;
}

addBtn.addEventListener('click', () => {
    modal.showModal();
});

closeBtn.addEventListener('click', () => modal.close());

form.addEventListener('submit', (e) => {
    const input = Array.from(document.querySelectorAll('.modal-form input')).slice(0, 3);
    const values = input.map(retrieveAndReset);
    const readStatus = document.querySelector('#read');
    
    let title = values[0];
    let author = values[1];
    let pages = values[2];
    let read = readStatus.checked ? true : false;
    readStatus.checked = false;

    let index = addBookToLibrary(title, author, pages, read) - 1;
    displayBook(myLibrary.at(index), index);
});

function retrieveAndReset(input) {
    let value = input.value;
    input.value = '';
    return value;
}

deleteBtn.addEventListener('click', () => {
    deleteSelected();
    // displayLibrary();
});

function deleteSelected() {
    const selection = Array.from(document.querySelectorAll(".book input[type='checkbox']:checked"));
    const ids = selection.map(selected => selected.value);
    removeIdsFromLibrary(ids);
    clearBooksFromPage(ids);
}

function removeIdsFromLibrary(ids) {
    myLibrary = myLibrary.filter(book => !ids.includes(book.id));
}

function clearBooksFromPage(ids) {
    ids.forEach((id) => {
        const delTarget = content.querySelector(`input[value='${id}']`).parentNode;
        delTarget.remove();
    })
}

// Default books for testing
addBookToLibrary('A Game of Thrones', 'George R. R. Martin', 816, false);
addBookToLibrary('Sherlock Holmes', 'Arthur Conan Doyle', 160, true);
addBookToLibrary('Harry Potter', 'J. K. Rowling', 480, true);
displayLibrary();