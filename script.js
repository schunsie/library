const myLibrary = [];
const content = document.querySelector('.content');
const dialog = document.querySelector('dialog');

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);

    myLibrary.push(book);
}

function displayLibrary() {
    myLibrary.forEach((book) => {
        const bookElement = convertBookToHTML(book);
        content.appendChild(bookElement);
    })
}

function convertBookToHTML(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');

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
    bookStatus.innerHTML = book.read ? 
        'read <img class="icon" src="media/icons/book-close.svg">' :
        'not read yet <img class="icon" src="media/icons/book-open.svg">';
    bookElement.appendChild(bookStatus);

    return bookElement;
}

content.addEventListener('click', (event) => {
    const target = event.target
    
    switch (target.classList[0]) {
        case 'add':
            return dialog.showModal();
        case 'nr':
            return alert('test2');
        case 'r':
            return alert('test2');
    }
});