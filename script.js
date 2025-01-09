const Library = new class {
    #books = [];
    
    add(book) {
        if (!(book instanceof Book)) {
            throw new Error('Invalid book entry.')
        }
        this.#books.push(book);
    }

    delete(...ids) {
        this.#books = this.#books.filter((book) => !ids.includes(book.id));
    }

    get books() {
        // Return shallow copy as to prevent altering of #books
        return [...this.#books];
    }

    getLastBook() {
        return this.#books.at(-1);
    }
}

class Book {
    #title;
    #author;
    #pages;
    #status;
    #id;

    constructor(title, author, pages, status) {
        this.#title = title;
        this.#author = author;
        this.#pages = pages;
        this.#status = status;
        this.#id = this.#makeId(6);
    } 

    #makeId(length) {
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

    changeStatus() {
        this.#status = true ? false : true; 
    }

    get id() {
        return this.#id;
    }

    get info() {
        return {
            title : this.#title,
            author : this.#author,
            pages : this.#pages,
            status : this.#status
        };
    } 


}

const displayController = new class {
    
    // Initialize references to DOM elements
    #content = document.querySelector('.content');
    // Modal elements
    #addBtn = document.querySelector('.add-btn');
    #modal = document.querySelector('dialog');
    #form = document.querySelector('.modal-form');
    #closeBtn = document.querySelector('.close-btn');
    // Bottom menu buttons
    #deleteBtn = document.querySelector('.delete-btn');
    #toggleBtn = document.querySelector('.toggle-btn');

    constructor () {
        // Initialize event listeners
        this.#addBtn.addEventListener('click', () => this.#modal.showModal());
        this.#closeBtn.addEventListener('click', () => this.#modal.close());
        this.#toggleBtn.addEventListener('click', this.#btnHandler);
        this.#deleteBtn.addEventListener('click', this.#btnHandler);
        this.#form.addEventListener('submit', this.#formHandler);

        // Initial draw of library array.
        // Doesn't do anything as of now, 
        // since there is no storage of data between page reloads
        Library.books.forEach(this.displayBook);
    } 
    
    // Event handling functions
    #btnHandler(event) {
        console.log(event.target.classList);
        switch (event.target.className) {
            case ('toggle-btn'):
                alert('Toggle pressed');
                break;
            case ('delete-btn'):
                alert('Delete pressed');
                break;
        }
    }

    #formHandler() {
        const inputs = document.querySelectorAll('.modal-form input');
        const response = {};
        inputs.forEach((el) => el.id === 'status' ? response[el.id] = el.checked : response[el.id] = el.value);
        this.reset();
        Library.add(new Book(response.title, response.author, response.pages, response.status));
        displayController.displayBook(Library.getLastBook().info);
    }
    
    displayBook(book) {
        const bookHTML = this.#convertBookToHTML(book);
        this.#content.appendChild(bookHTML);
        console.log(this)
    }

    // TODO: Fix dit. De variabelen in boek zijn private.
    #convertBookToHTML(book) {
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
}

/*
let myLibrary = [];
const content = document.querySelector('.content');

// Modal elements
const addBtn = document.querySelector('.add-btn');
const modal = document.querySelector('dialog');
const form = document.querySelector('.modal-form');
const closeBtn = document.querySelector('.close-btn');

// Bottom menu buttons
const deleteBtn = document.querySelector('.delete-btn');
const toggleBtn = document.querySelector('.toggle-btn');

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

toggleBtn.addEventListener('click', toggleBookStatus);

function toggleBookStatus() {
    const selection = Array.from(content.querySelectorAll('.book input:checked'));
    const ids = selection.map(selected => selected.value);

    myLibrary.forEach(book => {
        if (ids.includes(book.id)) {
            book.read = !book.read;
            updateStatusDisplay(book.id, book.read);
        }
    })
    selection.forEach(selected => selected.checked = false);
}

function updateStatusDisplay(id, newStatus) {
    const targetBook = content.querySelector(`input[value='${id}']`).parentElement;
    let bookStatus = targetBook.querySelector('.status');

    bookStatus.innerHTML = newStatus ? 
        'read <img class="icon" src="media/icons/book-close.svg">' :
        'not read yet <img class="icon" src="media/icons/book-open.svg">';
}


// Default books for testing
addBookToLibrary('A Game of Thrones', 'George R. R. Martin', 816, false);
addBookToLibrary('Sherlock Holmes', 'Arthur Conan Doyle', 160, true);
addBookToLibrary('Harry Potter', 'J. K. Rowling', 480, true);
displayLibrary();
*/
