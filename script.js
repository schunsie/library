const myLibrary = [];

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
    const tableBody = document.querySelector('tbody');
    myLibrary.forEach((book) => {
        const bookEntry = document.createElement('tr');
        let stats = Object.values(book);
        stats.forEach((stat) => {
            let tableCell = document.createElement('td');
            tableCell.textContent = stat;
            bookEntry.appendChild(tableCell);
        })

        tableBody.appendChild(bookEntry);
    })
}