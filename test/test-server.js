const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('BlogPost', function(){

	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should list items with GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				res.body.forEach(function(item){
					expect(item).to.be.a('object');
					expect(item).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
				});
			});
	});

	it('should add an item with POST', function(){
		const testPost = {title: "The book", content: "the content", author: "Bryan Pham"};
		return chai.request(app)
			.post('/blog-posts')
			.send(testPost)
			.then(function(res){
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
				expect(res.body.id).to.not.equal(null);
				expect(res.body.title).to.equal(testPost.title);
				expect(res.body.content).to.equal(testPost.content);
				expect(res.body.author).to.equal(testPost.author);
			});
	});

	it('should update an item with PUT', function(){
		const testUpdate = {
			title: "new title", 
			content: "new content", 
			author: "new author",
			publishDate: 123456
		};
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				testUpdate.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${res.body[0].id}`)
					.send(testUpdate);
			})
			.then(function(res){
				expect(res).to.have.status(204);
			});
	});

	it('should delete an item with DELETE', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res){
				expect(res).to.have.status(204);
			});
	});


});