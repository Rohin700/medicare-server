var jwt = require("jsonwebtoken");
let doValidateToken = (req,resp,next) => {
    console.log("****  ****")

    const fullToken = req.headers['authorization'];
    console.log(fullToken);

    var ary = fullToken.split(" ");//we have split the token on the bases of the space between them
    
    let actualToken=ary[1];
    let TokenValidObj;

    console.log(process.env.SEC_KEY)

    try{
            TokenValidObj= jwt.verify(actualToken,process.env.SEC_KEY);
            console.log(TokenValidObj);
            if(TokenValidObj!=null)
            {
                const payload = jwt.decode(ary[1]);//in the payload we have stored the data that we have stored inside the json web tokn
                console.log(payload);
                next();
                //resp.json({status:true,msg:"**Aauthorized",item:payload});
            }
            else
            resp.json({status:false,msg:"**Invalid Token"});
        }
        catch(err)
        {
            resp.json({status:false,msg:err.message});
            return;
        }            
}
module.exports={doValidateToken};
