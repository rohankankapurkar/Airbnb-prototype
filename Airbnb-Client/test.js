var chai = require('chai');
//used to do http request
var chaiHttp      = require('chai-http');
    server        = require('./app');

var should = chai.should();
chai.use(chaiHttp);


/*
 |-----------------------------------------------------------
 | Homepage get test
 |-----------------------------------------------------------
*/
describe('homepage', function() {
  it('should get the homepage', function(){
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});

/*
 |-----------------------------------------------------------
 | Check signin
 |-----------------------------------------------------------
*/
describe('sign in', function() {
  it('should sign in user Successfully', function(){
    chai.request(server)
      .post('/user/signin', {
        username: 'darshan@gmail.com',
        password: '123456789'
      })
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});


/*
 |-----------------------------------------------------------
 | Get properties
 |-----------------------------------------------------------
*/
describe('get properties form San Jose', function() {
  it('should get all properties', function(){
    chai.request(server)
      .post('/properties', {
        city: 'San Jose'
      })
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});


/*
 |-----------------------------------------------------------
 | should get all user trips
 |-----------------------------------------------------------
*/
describe('get user trips', function() {
  it('should get all user upcoming trips', function(){
    chai.request(server)
      .post('/getUserTrips', {
        userId: '000-00-0052'
      })
      .end(function(err, res){
        res.should.have.status(200);
        done();
      })
  })
});




/*
 |-----------------------------------------------------------
 | should get all user trips
 |-----------------------------------------------------------
*/
describe('book trip', function() {
  it('should book Successfully', function(){
    chai.request(server)
      .post('/user/bookproperty', {
          propid : '000-00-0055',
          fromdate : '2017-03-03',
          todate: '2017-03-05',
          userid: '000-00-0056',
          hostid: '000-00-0052',
          city : 'San Jose',
          price : '120'
      })
      .end(function(err, res){
        console.log("response here");
        console.log(res);
        res.should.have.status(200);
        done();
      })
  })
});


describe('host reviews', function()
{
    it('should be able to get Host reviews', function()
    {
        chai.request(server)
            .post('/host/getReviewForHost',  {
                host_id: '000-00-0052'
                    })
                    .end(function(err, res){
                        res.should.have.status(200);
                        done();
                    })
    });
})
