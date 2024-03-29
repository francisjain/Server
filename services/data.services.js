const jwt = require('jsonwebtoken')
const db = require('./db')


users = {
  1000: { acno: 1000, uname: "Neer", password: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Laisha", password: "1001", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "Vyom", password: "1002", balance: 5000, transaction: [] }
}

//register definition
const register = (acno, password, uname) => {
  return db.User.findOne({ acno }).then(user => {
    console.log(user);
    if (user) {
      return {
        statusCode: 401,
        status: false,
        message: "Account already Exists...Please Login!!!"
      }
    } else {
      const newUser = new db.User({
        acno, uname, password, balance: 0, transaction: []
      })
      newUser.save()

      // console.log(db);
      return {
        statusCode: 200,
        status: true,
        message: "Account Successfully Created"
      }
    }
  })
}

//---------------------------------without-----conn/syn----!!!

// const register = (acno, password, uname) => {
//   if (acno in users) {
//     return {
//       statusCode: 401,
//       status: false,
//       message: "Account already Exists...Please Login!!!"
//     }
//   } else {
//     users[acno] = {
//       acno, uname, password, balance: 0, transaction: []
//     }
//     // console.log(db);
//     return {
//       statusCode: 200,
//       status: true,
//       message: "Account Successfully Created"
//     }
//   }
// }

//---------------------------------without-----conn/syn----!!!

// login
const login = (acno, password) => {
  return db.User.findOne({ acno, password }).then(user => {
    if (user) {

      currentuserName = user.uname
      currentAcno = acno

      //token generation
      const token = jwt.sign({
        currentAcc: acno
      }, 'supersecretkey123')

      return {
        statusCode: 200,
        status: true,
        message: "Account login Successfully",
        currentAcno,
        currentuserName, token
      }
    }
    return {
      statusCode: 401,
      status: false,
      message: "Invalide credentials"
    }


  })

}

//deposit
const deposite = (acno, password, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      user.balance = user.balance + amount
      user.transaction.push({
        amount: amount,
        type: "CREDIT"
      })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: amount + " is been credited. Your current Balance is " + user.balance
      }
    }
    return {
      statusCode: 401,
      status: false,
      message: "Invalide credentials"
    }

  })

}
//withdraw
const withDraw = (req, acno, password, amt) => {
  var amount = parseInt(amt);

  return db.User.findOne({ acno, password }).then(user => {

    if (req.currentAcc != acno) {
      return {
        statusCode: 401,
        status: false,
        message: "Permission Denied"
      }
    }

    if (user) {

      if (user.balance >= amount) {
        user.balance = user.balance - amount
        user.transaction.push({
          amount: amount,
          type: "DEBITED"
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: amount + " is been debited. Your current Balance is " + user.balance
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: "Insufficent balance"
        }
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalide credentials"
      }
    }

  })



}
//transaction
const getTransaction = (req) => {
acno=req.currentAcc
return db.User.findOne({acno}).then(user=>{
  if (user) {
    return {
      statusCode: 200,
      status: true,
      transaction: user.transaction
    }
  } else {
    return {
      statusCode: 401,
      status: false,
      message: "Invalide credentials"
    }
  }
})
}
//export
module.exports = {
  register,
  login,
  deposite,
  withDraw,
  getTransaction
}