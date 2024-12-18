const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${!read ? 'not read yet' : 'read'}`
    }
}

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);

    myLibrary.push(book);
}