var grpc = require('grpc');

var booksProto = grpc.load('books.proto');

var server = new grpc.Server();

var books = [	{id:123, title:'A Tale of Two Cities', author: 'Charles Dickens'}
];

var bookStream;

server.addProtoService(booksProto.books.BookService.service,{
	//go run client.go list
	list: function(call,callback) {
		callback(null,books);
	},
	//go run client.go insert 2 "BookName" "Author"
	insert: function(call,callback) {
		//call.request is a Book object
		books.push(call.request);
		if (bookStream) {
			bookStream.write(book);
		}
		callback(null,{});
	},
	//go run client.go get 123
	get: function(call,callback) {
		var bookId = call.request.id;
		for (var i = 0; i < books.length; i++) {
			if (books[i].id == bookId) {
				return callback(null,books[i]);
			}
		}
		callback({
			code:grpc.status.NOT_FOUND,
			details: 'Not Found'
		});
	},

	delete: function(call,callback) {
		var bookId = call.request.id;
		for (var i = 0; i < books.length; i++) {
			if (books[i].id == bookId) {
				books.splice(i,1);
				return callback(null,{})
			}
		}
		callback({
			code: grpc.status.NOT_FOUND,
			details: 'Not Found'
		});
	},
	watch: function(stream) {
		bookStream = 
	}
});

server.bind('127.0.0.1:50051',grpc.ServerCredentials.createInsecure());
server.start();

