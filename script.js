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
        this.#status = this.#status === true ? false : true; 
    }

    get id() {
        return this.#id;
    }

    get info() {
        return {
            title : this.#title,
            author : this.#author,
            pages : this.#pages,
            status : this.#status,
            id : this.#id
        };
    } 
}

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

    toggleReadStatus(...ids) {
        for (const book of this.#books) {
            if (ids.includes(book.id)) book.changeStatus(); 
        }
    }

    constructor() {
        // test books
        this.add(new Book('A Game of Thrones', 'George R. R. Martin', 694, false));
        this.add(new Book('Sherlock Holmes', 'Arthur Conan Doyle', 210, true));
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
        this.#form.addEventListener('submit', (event) => this.#formHandler(event.target));

        // Initial draw of library
        this.#displayLibrary()
    } 
    
    // Event handling functions
    #btnHandler(event) {
        const selection = document.querySelectorAll('.book:has(input:checked)');
        const selectionIds = Array.from(selection).map(el => el.dataset.id);

        switch (event.target.className) {
            case ('toggle-btn'):
                Library.toggleReadStatus(...selectionIds);

                selection.forEach((bookEl) => {
                    // Unselect the selection
                    bookEl.querySelector('input').checked = false;
                    
                    const statusEl = bookEl.querySelector('.status');
                    // Change status on page
                    statusEl.innerHTML = statusEl.dataset.read === "false" ? 
                    'read <img class="icon" src="media/icons/book-close.svg">' :
                    'not read yet <img class="icon" src="media/icons/book-open.svg">';
                    // Change data attribute
                    statusEl.dataset.read = statusEl.dataset.read === "true" ? false : true;
                });
                break;
            case ('delete-btn'):
                selection.forEach((book) => book.remove());
                Library.delete(...selectionIds);
                break;
        }
    }

    #formHandler(form) {
        const inputs = document.querySelectorAll('.modal-form input');
        const response = {};
        inputs.forEach((el) => el.id === 'status' ? response[el.id] = el.checked : response[el.id] = el.value);
        form.reset();
        Library.add(new Book(response.title, response.author, response.pages, response.status));
        this.#displayBook(Library.getLastBook());
    }
    
    #displayBook(book) {
        const bookHTML = this.#convertBookToHTML(book.info);
        this.#content.appendChild(bookHTML);
    }

    #displayLibrary() {
        Library.books.forEach((book) => this.#displayBook(book));
    }

    #convertBookToHTML(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.dataset.id = book.id;
    
        const input = document.createElement('input');
        input.setAttribute("type", "checkbox");
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
        bookStatus.dataset.read = book.status;
        bookStatus.innerHTML = book.status ? 
            'read <img class="icon" src="media/icons/book-close.svg">' :
            'not read yet <img class="icon" src="media/icons/book-open.svg">';
        bookElement.appendChild(bookStatus);
    
        return bookElement;
    }
}