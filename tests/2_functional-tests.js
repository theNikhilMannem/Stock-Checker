const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Viewing one stock: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData', 'stockData should be a property in the response')

        done()
      })
  })

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData', 'stockData should be a property in the response')
        assert.property(res.body.stockData, 'likes', 'likes should be a property in the response')
        // assert.equal()

        done()
      })
  })

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData', 'stockData should be a property in the response')
        assert.property(res.body.stockData, 'likes', 'likes should be a property in the response')

        done()
      })
  })
  
  test('Viewing two stocks: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog&stock=msft')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData', 'stockData should be a property in the response')
        assert.isArray(res.body.stockData, 'stockData property of the response should be a array')
        assert.property(res.body.stockData[0], 'rel_likes', 'rel_likes should be a property in the response')
        assert.property(res.body.stockData[1], 'rel_likes', 'rel_likes should be a property in the response')
        assert.equal(res.body.stockData.length, 2, 'stockData property length should be 2')

        done()
      })
  })

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', done => {
    chai.request(server)
      .get('/api/stock-prices?stock=goog&stock=msft&like=true')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'stockData', 'stockData should be a property in the response')
        assert.isArray(res.body.stockData, 'stockData property of the response should be a array')
        assert.property(res.body.stockData[0], 'rel_likes', 'rel_likes should be a property in the response')
        assert.property(res.body.stockData[1], 'rel_likes', 'rel_likes should be a property in the response')
        assert.equal(res.body.stockData.length, 2, 'stockData property length should be 2')

        done()
      })
  })
});
