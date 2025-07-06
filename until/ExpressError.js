// class ExpressError extends Error{
//     constructor(statusCode, message){
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

// module.exports = ExpressError;

class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message); // Pass the message to the Error parent class
    this.statusCode = statusCode;
    this.name = "ExpressError"; // Optional: helpful for debugging
    Error.captureStackTrace(this, this.constructor); // Optional: cleaner stack
  }
}

module.exports = ExpressError;
