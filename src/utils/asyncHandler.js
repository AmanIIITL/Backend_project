// promises handler
const asyncHandler = (requestHandler) => {
    (re, res, next) => {
        Promise.resolve(requestHandler(requestHandler, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}



// try catch handler

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}

//handler starts above is for function understanding
// const asyncsHandler = (fn) => async(req, res, next) => {
//     try{
//         await fn(req, res, next)
//     } catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
