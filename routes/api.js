'use strict';

const request = require('request')
const StockData = require('../models.js').StockData
const IP = require('../models.js').IP
const CheckIP = require('../Controllers/CheckIP.js').CheckIP
// console.log(CheckIP)

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      console.log(req.query)
      const stock = req.query.stock
      const like = req.query.like == 'true' ? true : false
      console.log('like', like)

      const stockData = new StockData()
      // const checkIp = new CheckIP(req.ip)
      // if (req.ip) {
      //   console.log('checkIp: ', checkIp.ipThere())
      // }
      // else {
      //   console.log('ip not there!', req.ip)
      // }

      // if (checkIp.ipThere()) {
      //   console.log('ip in api.js created!')
      // }
      // else {
      //   console.log('ip in api.js already there!')
      // }

      if (!Array.isArray(stock)) {
        console.log('stock isn\'t array')
        request('https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock='+stock, (err, result, body) => {
          console.log('stockData requested from FCC.rocks:', JSON.parse(body).stockData)
          const parsedStockData = JSON.parse(body).stockData
          
          StockData.findOne(
            { stock: parsedStockData.stock },
            (err, stockDataFound) => {
              if (err || !stockDataFound) {
                console.log('stockData not found!', err, stockDataFound)
                
                stockData.stock = parsedStockData.stock
                stockData.price = parsedStockData.price
                
                stockData.save((err, stockDataSaved) => {
                  if (err || !stockDataSaved) {
                    console.log('new stockData can\'t be saved:', err, stockDataSaved)
                  }
                  else {
                    IP.findOne({ ipAddress: req.ip }, (err, ipFound) => {
                      if (err || !ipFound) {
                        console.log('ip not already there!')

                        const ip = new IP({ ipAddress: req.ip })
                        ip.save((err, ipNotFound_Saved) => {
                          if (err || !ipNotFound_Saved) {
                            console.log('ip not found, not saved!')
                          }
                          else {
                            console.log('ip not found, saved!')
                            
                            if (like) {
                              // IP.findOne({  })
                              stockDataSaved.likes += 1
                              stockDataSaved.save((err, stockDataSaved_UpdatedSaved) => {
                                if (err || !stockDataSaved_UpdatedSaved) {
                                  console.log('Error in updating newly saved record', err, stockDataSaved_UpdatedSaved)
                                }
                                else {
                                  console.log('new record saved!')
                                  res.json({
                                    stockData: {
                                      stock: stockDataSaved_UpdatedSaved.stock,
                                      price: stockDataSaved_UpdatedSaved.price,
                                      likes: stockDataSaved_UpdatedSaved.likes
                                    }
                                  })
                                }
                              })
                            }
                            else {
                              console.log('stockDataSaved: ', stockDataSaved)
                              res.json({
                                stockData: {
                                  stock: stockDataSaved.stock,
                                  price: stockDataSaved.price,
                                  likes: stockDataSaved.likes
                                }
                              })
                            }
                          }
                        })
                      }
                      else {
                        console.log('ip already there')
                        
                        console.log('stockDataSaved: ', stockDataSaved)
                        res.json({
                          stockData: {
                            stock: stockDataSaved.stock,
                            price: stockDataSaved.price,
                            likes: stockDataSaved.likes
                          }
                        })
                      }
                    })

                  }
                })
              }
              else {
                console.log('stockData found!', stockDataFound)
                IP.findOne({ ipAddress: req.ip }, (err, ipFound) => {
                      if (err || !ipFound) {
                        console.log('ip not already there!')

                        const ip = new IP({ ipAddress: req.ip })
                        ip.save((err, ipNotFound_Saved) => {
                          if (err || !ipNotFound_Saved) {
                            console.log('ip not found, not saved!')
                          }
                          else {
                            console.log('ip not found, saved!')
                            
                            if (like) {
                              // IP.findOne({  })
                              stockDataFound.likes += 1
                              stockDataFound.save((err, stockDataFound_UpdatedSaved) => {
                                if (err || !stockDataFound_UpdatedSaved) {
                                  console.log('Error in updating newly saved record', err, stockDataFound_UpdatedSaved)
                                }
                                else {
                                  console.log('new record saved!')
                                  res.json({
                                    stockData: {
                                      stock: stockDataFound_UpdatedSaved.stock,
                                      price: stockDataFound_UpdatedSaved.price,
                                      likes: stockDataFound_UpdatedSaved.likes
                                    }
                                  })
                                }
                              })
                            }
                            else {
                              console.log('stockDataFound: ', stockDataFound)
                              res.json({
                                stockData: {
                                  stock: stockDataFound.stock,
                                  price: stockDataFound.price,
                                  likes: stockDataFound.likes
                                }
                              })
                            }
                          }
                        })
                      }
                      else {
                        console.log('ip already there')
                        
                        console.log('stockDataFound: ', stockDataFound)
                        res.json({
                          stockData: {
                            stock: stockDataFound.stock,
                            price: stockDataFound.price,
                            likes: stockDataFound.likes
                          }
                        })
                      }
                    })
              }
            }
          )
        })
      }
      else {
        console.log('stock is array')
        
        console.log(req.query.stock)
        const [ stock1, stock2 ] = req.query.stock
        console.log(stock1, stock2)

        const like = req.query.like == 'true' ? true : false
        console.log('like', like)

        // request('https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock='+ stock1 +'&stock='+stock2)

        StockData.findOne({ stock: stock1.toUpperCase() }, (err, stock1DataFound) => {
          if (err || !stock1DataFound) {
            console.log('stock1Data not found!')
          }
          else {
            console.log('stock1Data found')

            StockData.findOne({ stock: stock2.toUpperCase() }, (err, stock2DataFound) => {
              if (err || !stock2DataFound) {
                console.log('stock2Data not found', err, stock2DataFound)
              }
              else {
                console.log('stock2Data found')

                console.log(stock1DataFound, stock2DataFound)

                if (like) {
                  res.json({
                    stockData: [
                      {
                        stock: stock1DataFound.stock,
                        price: stock1DataFound.price,
                        rel_likes: stock1DataFound.likes - stock2DataFound.likes
                      },
                      {
                        stock: stock2DataFound.stock,
                        price: stock2DataFound.price,
                        rel_likes: stock2DataFound.likes - stock1DataFound.likes
                      }
                    ]
                  })
                }
                else {
                  res.json({
                    stockData: [
                      {
                        stock: stock2DataFound.stock,
                        price: stock2DataFound.price,
                        rel_likes: stock2DataFound.likes - stock1DataFound.likes
                      },
                      {
                        stock: stock1DataFound.stock,
                        price: stock1DataFound.price,
                        rel_likes: stock1DataFound.likes - stock2DataFound.likes
                      }
                    ]
                  })
                }
                
              }
            })
          }
        })
      }
      
      // res.json({
      //   stockData: {
      //     stock: 'stock',
      //     price: 24.5,
      //     likes: 0
      //   }
      // })
    });
    
};
