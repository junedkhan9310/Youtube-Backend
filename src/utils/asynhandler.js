const asynchadnler =(requesthandler)=>{ //requesthadnler is function
    return (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((err)=>next(err))
    }

}




export {asynchadnler}















// const asynchadnler= (fn)=> {async(req,res,next)=>{ //this is example of higher order function as it's accepting function as variable and procesing it
//     try {
//         await fn(req,res,next)
//     } catch (err) {
//         res.status(err.code|| 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }}  //28:34 CUSTOM API RESPONSE and error hadnleing we can or not add '{}' outside wala