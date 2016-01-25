var grpc = require('grpc');

var booksProto = grpc.load('books.proto');

var client = new booksProto.books.BookService('127.0.0.01:50051',
	grpc.Credentials.createInsecure());

//parse in-line commands
//ie. node client.js list --> processName scriptName command
var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

//ie 2. node client.js insert 2 "BookName" "Author"
switch(command) {
	case "list":
		listBooks();
		break;
	case "insert":
		insertBook(process.argv[0], process.argv[1], process.argv[2]);
		break;
	case "get":
		getBook(process.argv[0]);
		break
	case "delete":
		deleteBook(process.argv[0]);
		break
	case "watch":
		watchBooks();
		break;
	default:
		console.log("Invalid Command")
}

function printResponse(error, response) {
	if (error) {
		console.log('Error: ',error)
	} else {
		console.log(response);
	}
}

function listBooks() {
	client.list({},function(error,books) {
		printResponse(error,books);
	});
}

function insertBook(id,title,author) {
	var book = {id:parseInt(id), title: title, author: author};
	client.insert(book,function(error,empty) {
		printResponse(error,empty);
	});
}

function getBook(id) {
	client.get({id: parseInt(id)}, function(error, book) {
		printResponse(error,book);
	});
}

function deleteBook(id) {
	client.delete({id:parseInt(id)}, function(error,empty) {
		printResponse(error,empty);
	});
}

function watchBooks() {
	var call = client.watch({});
	//callback method. gets called every time a book is inserted
	call.on('data', function(book) {
		console.log(book);
	});
}
